import https from 'node:https';
import { publicTarget } from './browser-network.mjs';
import { webUrl } from './links.mjs';
export function shortLinkPlatform(value) {
  try {const u=new URL(value), h=u.hostname.replace(/^www\./,'');
    if(['vm.tiktok.com','vt.tiktok.com'].includes(h) || (h==='tiktok.com'&&u.pathname.startsWith('/t/'))) return 'tiktok.com';
    if(['facebook.com','m.facebook.com'].includes(h)&&u.pathname.startsWith('/share/')) return 'facebook.com';
  } catch {} return '';
}
async function redirect(url,signal) {
  const u=new URL(url),address=await publicTarget(u.hostname);
  return new Promise((resolve,reject)=>{
    const req=https.request(u,{method:'GET',signal,family:4,lookup:(_host,options,callback)=>options.all?callback(null,[{address,family:4}]):callback(null,address,4)},res=>{
      resolve(res.statusCode>=300&&res.statusCode<400?res.headers.location:null);res.destroy();req.destroy();
    });req.on('error',reject);req.end();
  });
}
export async function resolveRecipeLink(value,request=redirect) {
  const original=webUrl(value),platform=shortLinkPlatform(original);if(!platform)return original;
  let current=original;const signal=AbortSignal.timeout(6000);
  try {
    for(let n=0;n<5;n++){
      const location=await request(current,signal);if(!location)return webUrl(current);
      const next=new URL(location,current);
      if(next.protocol!=='https:'||next.port||next.username||next.password||!(next.hostname===platform||next.hostname.endsWith(`.${platform}`)))return original;
      current=next.href;
    }
  }catch{}return original;
}
