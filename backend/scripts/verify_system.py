"""Live, isolated API regression checks. Removes only records this run created."""
import asyncio
import json
import sys
import uuid
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import asyncpg

ROOT=__import__('pathlib').Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'backend'))
from app.core.config import get_settings

BASE='http://127.0.0.1:8000/api/v1'
settings=get_settings()
created=[]
pdf_paths=[]
temporary_user=None
temporary_admin=None
assertions=0
def request(path,token=None,method='GET',body=None):
    headers={'Content-Type':'application/json'}
    if token:headers['Authorization']='Bearer '+token
    req=urllib.request.Request(BASE+path,data=json.dumps(body).encode() if body is not None else None,method=method,headers=headers)
    try:
        with urllib.request.urlopen(req,timeout=20) as response:
            content=response.read()
            return response.status, json.loads(content) if response.headers.get_content_type()=='application/json' else content
    except urllib.error.HTTPError as error:
        return error.code,json.loads(error.read())

def check(condition,name):
    global assertions
    if not condition:raise AssertionError(name)
    assertions+=1
    print('PASS',name)

def supabase(path,method,body=None):
    req=urllib.request.Request(settings.supabase_url+'/auth/v1'+path,data=json.dumps(body).encode() if body else None,method=method,headers={'apikey':settings.supabase_secret_key,'Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=20) as response:
        content=response.read();return json.loads(content) if content else {}

def main_checks():
    global temporary_user, temporary_admin
    check(request('/health/ready')[0]==200,'database readiness')
    tokens={}
    for role in ('volunteer','organizer','admin'):
        status,body=request('/auth/demo-login/'+role,method='POST')
        check(status==200,'demo login '+role)
        tokens[role]=body['data']['access_token']
    volunteer,organizer,admin=(tokens[key] for key in ('volunteer','organizer','admin'))
    check(request('/admin/metrics',admin)[0]==403,'admin without MFA is rejected')
    from qa_auth import create_verified_admin
    temporary_admin,admin=create_verified_admin()
    check(request('/admin/metrics',admin)[0]==200,'disposable admin with verified TOTP is accepted')
    tag='QA-'+uuid.uuid4().hex[:10]
    password=uuid.uuid4().hex+'!aA1'
    user=supabase('/admin/users','POST',{'email':tag.lower()+'@example.test','password':password,'email_confirm':True,'user_metadata':{'name':tag}})
    temporary_user=user['id']
    (ROOT/'backend/logs/qa-manifest.json').write_text(json.dumps({'temporary_user':temporary_user}),encoding='utf-8')
    token_req=urllib.request.Request(settings.supabase_url+'/auth/v1/token?grant_type=password',data=json.dumps({'email':tag.lower()+'@example.test','password':password}).encode(),method='POST',headers={'apikey':settings.supabase_publishable_key,'Content-Type':'application/json'})
    with urllib.request.urlopen(token_req,timeout=20) as response:second=json.load(response)['access_token']
    today=datetime.now(ZoneInfo('Asia/Ho_Chi_Minh')).date()
    payload={'title':tag,'category':'Môi trường','event_date':today.isoformat(),'event_time':'08:00 - 10:00','city':'QA','location':'QA isolation','capacity':1,'verified_hours':3,'description':'Isolated test activity','schedule':[],'publish':False,'idempotency_key':str(uuid.uuid4())}
    check(request('/organizer/activities',volunteer,'POST',payload)[0]==403,'volunteer cannot create activity')
    check(request('/admin/metrics',volunteer)[0]==403,'volunteer cannot access admin')
    check(request('/me/profile',volunteer,'PATCH',{'name':None})[0]==422,'null name rejected with 422')
    check(request('/me/profile',volunteer,'PATCH',{'skills':None})[0]==422,'null skills rejected with 422')
    status,body=request('/organizer/activities',organizer,'POST',payload)
    check(status==201,'create database draft')
    activity=body['data']['id'];created.append(activity)
    status,again=request('/organizer/activities',organizer,'POST',payload)
    check(status==201 and again['data']['id']==activity,'creation idempotency')
    check(request('/activities/'+activity)[0]==404,'draft not publicly visible')

    banner='https://example.test/qa-banner.png'
    check(request('/organizer/activities/'+activity,organizer,'PUT',{**payload,'banner_url':banner})[0]==200,'save draft banner')
    payload['publish']=True
    check(request('/organizer/activities/'+activity,organizer,'PUT',payload)[0]==200,'submit saved draft')
    check(request('/organizer/activities/'+activity,organizer)[1]['data']['banner_url']==banner,'submission preserves draft banner')
    check(request('/activities/'+activity)[0]==404,'pending activity not public')
    check(request('/admin/activities/'+activity+'/review',admin,'POST',{'decision':'approve'})[0]==200,'admin publishes activity')
    check(request('/activities/'+activity)[0]==200,'published activity is public')
    status,body=request('/activities/'+activity+'/apply',volunteer,'POST',{})
    check(status==201,'volunteer application')
    first_app=body['data']['id']
    check(request('/activities/'+activity+'/apply',volunteer,'POST',{})[0]==409,'duplicate application blocked')
    status,body=request('/activities/'+activity+'/apply',second,'POST',{})
    check(status==201,'second volunteer application')
    second_app=body['data']['id']
    def approve(app):return request('/organizer/applications/'+app+'/review',organizer,'POST',{'decision':'approve'})
    with ThreadPoolExecutor(2) as executor:results=list(executor.map(approve,[first_app,second_app]))
    check(sorted(result[0] for result in results)==[200,409],'concurrent approval cannot overfill capacity')
    winner=first_app if results[0][0]==200 else second_app
    winner_token=volunteer if winner==first_app else second
    other_token=second if winner==first_app else volunteer
    before=request('/me/profile',winner_token)[1]['data']['verified_hours']
    def checkin(_):return request('/organizer/applications/'+winner+'/checkin',organizer,'POST')
    with ThreadPoolExecutor(2) as executor:results=list(executor.map(checkin,[0,1]))
    check(all(result[0]==200 for result in results),'repeated concurrent checkin is safe')
    code=next(result[1]['data'].get('certificate_code') for result in results if result[1]['data'].get('certificate_code'))
    check(request('/me/profile',winner_token)[1]['data']['verified_hours']==before+3,'hours added exactly once')
    check(request('/certificates/verify/'+code)[1]['data']['valid'],'public certificate verification')
    check(request('/me/applications/'+winner+'/cancel',winner_token,'POST')[0]==409,'completed application cannot be cancelled by volunteer')
    status,pdf=request('/certificates/'+code+'/pdf',winner_token)
    check(status==200 and isinstance(pdf,bytes) and pdf.startswith(b'%PDF'),'standalone PDF generated')
    async def pdf_path():
        conn=await asyncpg.connect(settings.supabase_db_url,ssl='require')
        try:return await conn.fetchval('select pdf_url from certificates where certificate_code=$1',code)
        finally:await conn.close()
    pdf_paths.append(asyncio.run(pdf_path()))
    status,cached_pdf=request('/certificates/'+code+'/pdf',winner_token)
    check(status==200 and cached_pdf==pdf,'PDF bytes reused for unchanged certificate')
    check(request('/certificates/'+code+'/pdf',other_token)[0]==404,'certificate file ownership enforced')
    check(request('/organizer/applications/'+winner+'/checkin?checked_in=false',organizer,'POST')[0]==200,'revoke checkin')
    check(request('/certificates/verify/'+code)[0]==404,'revoked certificate invalid')
    check(request('/me/profile',winner_token)[1]['data']['verified_hours']==before,'hours restored after revoke')
    check(request('/me/applications/'+winner+'/cancel',winner_token,'POST')[0]==200,'cancel approved application')
    check(request('/activities/'+activity)[1]['data']['applied']==0,'cancel releases capacity')
    check(request('/me/applications/'+winner+'/cancel',winner_token,'POST')[0]==409,'repeat cancellation rejected')
    payload.update(idempotency_key=str(uuid.uuid4()),publish=True,deadline_date=(today-timedelta(days=1)).isoformat())
    status,body=request('/organizer/activities',organizer,'POST',payload)
    check(status==201,'create expired registration fixture')
    expired=body['data']['id'];created.append(expired)
    check(request('/admin/activities/'+expired+'/review',admin,'POST',{'decision':'approve'})[0]==200,'publish expired fixture')
    check(request('/activities/'+expired+'/apply',volunteer,'POST',{})[0]==409,'deadline enforced at API')
    payload.update(deadline_date=(today+timedelta(days=1)).isoformat())
    check(request('/organizer/activities',organizer,'POST',payload)[0]==422,'deadline after event rejected')
    payload.update(idempotency_key=str(uuid.uuid4()),deadline_date=None,event_date=(today-timedelta(days=1)).isoformat())
    check(request('/organizer/activities',organizer,'POST',payload)[0]==422,'past event submission rejected')
    payload.update(idempotency_key=str(uuid.uuid4()),event_date=(today+timedelta(days=7)).isoformat())
    status,body=request('/organizer/activities',organizer,'POST',payload)
    check(status==201,'create future fixture')
    future=body['data']['id'];created.append(future)
    request('/admin/activities/'+future+'/review',admin,'POST',{'decision':'approve'})
    status,body=request('/activities/'+future+'/apply',volunteer,'POST',{})
    check(status==201,'apply future activity')
    application=body['data']['id']
    request('/organizer/applications/'+application+'/review',organizer,'POST',{'decision':'approve'})
    check(request('/organizer/applications/'+application+'/checkin',organizer,'POST')[0]==409,'future checkin blocked')

async def cleanup():
    from qa_auth import admin_dsn
    connection=await asyncpg.connect(admin_dsn(),ssl='require')
    try:
        async with connection.transaction():
            ids=created[:]
            if ids:
                app_ids=[row['id'] for row in await connection.fetch('select id from public.applications where activity_id=any($1::text[])',ids)]
                await connection.execute('delete from public.certificates where activity_id=any($1::text[])',ids)
                await connection.execute('delete from public.notifications where description like any($1::text[])',[f'%{item}%' for item in ids+app_ids])
                await connection.execute('delete from public.audit_logs where target=any($1::text[])',ids+app_ids)
                await connection.execute('delete from public.applications where activity_id=any($1::text[])',ids)
                await connection.execute('delete from public.activities where id=any($1::text[])',ids)
    finally:await connection.close()
    if pdf_paths:
        req=urllib.request.Request(settings.supabase_url+'/storage/v1/object/certificates',data=json.dumps({'prefixes':pdf_paths}).encode(),method='DELETE',headers={'apikey':settings.supabase_secret_key,'Content-Type':'application/json'})
        with urllib.request.urlopen(req,timeout=20) as response:response.read()
    if temporary_user:supabase('/admin/users/'+temporary_user,'DELETE')
    if temporary_admin:supabase('/admin/users/'+temporary_admin,'DELETE')
    (ROOT/'backend/logs/qa-manifest.json').unlink(missing_ok=True)

if __name__=='__main__':
    try:main_checks();print('ALL PASSED',assertions)
    finally:asyncio.run(cleanup());print('QA records cleaned')
