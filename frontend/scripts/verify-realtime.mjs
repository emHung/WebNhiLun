import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {createClient} from "@supabase/supabase-js";
import {randomUUID} from "node:crypto";
const env=Object.fromEntries(readFileSync(new URL("../.env.local",import.meta.url),"utf8").split(/\r?\n/).filter(line=>line.includes("=")).map(line=>{const i=line.indexOf("=");return [line.slice(0,i),line.slice(i+1).trim()];}));
const run="qa-realtime-"+randomUUID();
const clients=[]; const received=[new Set(),new Set(),new Set()];
const db=(action,owner="")=>{
 const code=`import sys,asyncio,asyncpg\nsys.path.insert(0,'../backend')\nfrom app.core.config import get_settings\nasync def main():\n c=await asyncpg.connect(get_settings().supabase_db_url,ssl='require')\n try:\n  if sys.argv[1]=='insert':\n   await c.execute("insert into public.change_events(entity,owner_id) values($1,null),($2,$3::uuid)",sys.argv[2]+'-public',sys.argv[2]+'-private',sys.argv[3])\n  else: await c.execute("delete from public.change_events where entity=any($1::text[])",[sys.argv[2]+'-public',sys.argv[2]+'-private'])\n finally: await c.close()\nasyncio.run(main())`;
 const result=spawnSync("python",["-c",code,action,run,owner],{encoding:"utf8",timeout:20000});
 if(result.status!==0)throw Error("Realtime test fixture operation failed: "+result.stderr);
};
try{
 const response=await fetch("http://127.0.0.1:8000/api/v1/auth/demo-login/volunteer",{method:"POST"});
 if(!response.ok)throw Error("Demo authentication failed: "+response.status);
 const session=(await response.json()).data;
 const userResponse=await fetch("http://127.0.0.1:8000/api/v1/auth/me",{headers:{Authorization:"Bearer "+session.access_token}});
 const owner=(await userResponse.json()).data.id;
 for(let i=0;i<3;i++){
  const client=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}}); clients.push(client);
  if(i===1)await client.realtime.setAuth(session.access_token);
  await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(Error("Subscription timeout client "+i)),15000);
   client.channel(run+i).on("postgres_changes",{event:"INSERT",schema:"public",table:"change_events"},payload=>{if(payload.new.entity.startsWith(run))received[i].add(payload.new.entity);}).subscribe(status=>{if(status==="SUBSCRIBED"){clearTimeout(timeout);resolve();}else if(status==="CHANNEL_ERROR"){clearTimeout(timeout);reject(Error("Channel failed client "+i));}});
  });
 }
 db("insert",owner);
 const end=Date.now()+8000;
 while(Date.now()<end && !(received[0].size===1&&received[1].size===2&&received[2].size===1))await new Promise(resolve=>setTimeout(resolve,100));
 if(received[0].size!==1||received[1].size!==2||received[2].size!==1)throw Error("Unexpected event counts: "+received.map(set=>set.size));
 console.log("PASS public change reaches two independent anonymous connections and owner connection");
 console.log("PASS private change reaches owner only; anonymous clients cannot read it");
 console.log("PASS live database signal delivered without polling");
}finally{db("cleanup");await Promise.all(clients.map(client=>client.removeAllChannels()));}
