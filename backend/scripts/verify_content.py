"""Isolated stories and private Storage checks; clean only this run's records."""
import asyncio,io,json,sys,uuid,urllib.request,urllib.error
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app.core.config import get_settings
from reportlab.pdfgen import canvas
import asyncpg
from verify_system import request,check
settings=get_settings();story=None;document=None;storage_path=None
async def cleanup():
 c=await asyncpg.connect(settings.supabase_db_url,ssl='require')
 try:
  if story:await c.execute('delete from stories where id=$1',story)
  if document:
   path=await c.fetchval('delete from profile_documents where id=$1 returning path',uuid.UUID(document))
   if path:
    req=urllib.request.Request(settings.supabase_url+'/storage/v1/object/profile-docs',data=json.dumps({'prefixes':[path]}).encode(),method='DELETE',headers={'apikey':settings.supabase_secret_key,'Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=20) as response:response.read()
 finally:await c.close()
def run():
 global story,document
 status,body=request('/auth/demo-login/volunteer',method='POST');check(status==200,'content owner login');token=body['data']['access_token']
 status,body=request('/auth/demo-login/organizer',method='POST');check(status==200,'different user login');other=body['data']['access_token']
 tag='QA-content-'+uuid.uuid4().hex
 status,body=request('/stories',token,'POST',{'title':tag,'body':'Temporary content QA, safe to remove.','category':'all'});check(status==201,'story saved in database');story=body['data']['id']
 check(request('/stories/'+story+'/like',token,'PUT')[0]==200,'like stored')
 check(request('/stories/'+story+'/like',token,'PUT')[0]==200,'repeat like idempotent')
 check(story in request('/me/story-likes',token)[1]['data'],'own like persisted')
 check(next(row for row in request('/stories?search='+tag)[1]['data']['items'] if row['id']==story)['likes']==1,'like count exactly once')
 check(request('/stories/'+story+'/like?liked=false',token,'PUT')[0]==200,'unlike persisted')
 pdf=io.BytesIO();page=canvas.Canvas(pdf);page.drawString(20,800,tag);page.save();boundary=uuid.uuid4().hex
 content=('--'+boundary+'\r\nContent-Disposition: form-data; name="file"; filename="qa-private.pdf"\r\nContent-Type: application/pdf\r\n\r\n').encode()+pdf.getvalue()+('\r\n--'+boundary+'--\r\n').encode()
 req=urllib.request.Request('http://127.0.0.1:8000/api/v1/me/documents',data=content,method='POST',headers={'Authorization':'Bearer '+token,'Content-Type':'multipart/form-data; boundary='+boundary})
 with urllib.request.urlopen(req,timeout=30) as response:body=json.load(response);check(response.status==201,'private document upload')
 document=body['data']['id'];status,body=request('/me/documents/'+document+'/url',token);check(status==200,'owner signed URL')
 with urllib.request.urlopen(body['data']['url'],timeout=20) as response:check(response.read().startswith(b'%PDF'),'signed URL serves original PDF')
 check(request('/me/documents/'+document+'/url',other)[0]==404,'other user cannot access document')
 print('CONTENT CHECKS PASSED')
if __name__=='__main__':
 try:run()
 finally:asyncio.run(cleanup());print('Content QA records cleaned')
