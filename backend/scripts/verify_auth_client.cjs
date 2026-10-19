const fs = require('node:fs');
const cp = require('node:child_process');
const ts = require('../../frontend/node_modules/typescript');
const {createClient} = require('../../frontend/node_modules/@supabase/supabase-js');
const code = "import sys,json;sys.path.insert(0,'backend');from app.core.config import get_settings;s=get_settings();print(json.dumps({'url':s.supabase_url,'key':s.supabase_publishable_key,'password':s.demo_password_usr_001}))";
const config = JSON.parse(cp.execFileSync('backend/.venv/Scripts/python.exe',['-c',code],{encoding:'utf8'}));
process.env.NEXT_PUBLIC_SUPABASE_URL = config.url;
const source = ts.transpileModule(fs.readFileSync('frontend/lib/supabase/auth-fetch.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const exported={};new Function('exports',source)(exported);
const nativeFetch = global.fetch;
let contract = false, captured=[];
global.fetch = async (input,init) => {
  if (contract && String(input).startsWith('/api/v1/auth/')) {
    captured.push({path:input,body:JSON.parse(init.body)});
    return new Response(JSON.stringify(input.endsWith('/register') ? {id:'00000000-0000-4000-8000-000000000001',email:'qa@example.com'}:{}),{status:200,headers:{'Content-Type':'application/json'}});
  }
  return nativeFetch(typeof input==='string'&&input.startsWith('/api/')?'http://127.0.0.1:8000'+input:input,init);
};
const storage=new Map();
const client=createClient(config.url,config.key,{auth:{persistSession:false,autoRefreshToken:false,flowType:'pkce',storage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}},global:{fetch:exported.authFetch}});
(async()=>{
  try {
    const result=await client.auth.signInWithPassword({email:'an.nguyen@email.com',password:config.password});
    if(result.error||!result.data.session)throw Error('SDK password login through protected API failed');
    const token=result.data.session.access_token;
    const me=await nativeFetch('http://127.0.0.1:8000/api/v1/auth/me',{headers:{Authorization:'Bearer '+token}});
    if(me.status!==200)throw Error('Protected SDK session rejected');
    console.log('PASS Supabase SDK password login uses application rate-limited proxy');
    await client.auth.signOut({scope:'local'});
    contract=true;
    const signup=await client.auth.signUp({email:'qa@example.com',password:'Isolated-not-used-1!',options:{data:{name:'Isolated contract',role:'volunteer'}}});
    if(signup.error)throw Error('SDK signup contract failed');
    const recover=await client.auth.resetPasswordForEmail('qa@example.com');
    if(recover.error)throw Error('SDK recovery contract failed');
    for(const item of captured){
      const model=item.path.endsWith('/register')?'AuthRegister':'AuthRecovery';
      if(item.body.code_challenge_method!=='s256'||!item.body.code_challenge)throw Error('PKCE challenge missing');
      cp.execFileSync('backend/.venv/Scripts/python.exe',['-c',`import sys,json;sys.path.insert(0,'backend');from app.auth_routes import ${model};${model}.model_validate(json.load(sys.stdin))`],{input:JSON.stringify(item.body),stdio:['pipe','pipe','pipe']});
    }
    if(captured.length!==2)throw Error('Unexpected auth contract requests');
    console.log('PASS SDK signup/recovery preserve PKCE and match server schemas; no email sent');
  } finally {global.fetch=nativeFetch;}
})().catch(()=>{console.error('FAIL Auth client verification; credentials suppressed');process.exitCode=1});
