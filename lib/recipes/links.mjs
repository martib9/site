export function webUrl(value) {
  try {
    const u = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!['http:','https:'].includes(u.protocol) || !u.hostname.includes('.') || u.username || u.password) return '';
    u.hash='';
    for(const key of [...u.searchParams.keys()]) if (/^utm_/i.test(key) || ['igsh','igshid','fbclid','gclid','dclid','msclkid','mc_cid','mc_eid'].includes(key.toLowerCase())) u.searchParams.delete(key);
    u.searchParams.sort();return u.href;
  } catch {return '';}
}
export function urlKey(value) {
  const raw=webUrl(value);if(!raw)return '';
  const u=new URL(raw);const host=u.hostname.replace(/^(www|m)\./,'');
  if(host==='instagram.com'){const id=u.pathname.match(/\/(?:p|reels?)\/([^/]+)/)?.[1];if(id)return `instagram:${id}`;}
  if(host==='tiktok.com'){const id=u.pathname.match(/\/video\/(\d+)/)?.[1];if(id)return `tiktok:${id}`;}
  if(host==='facebook.com') {const id=u.pathname.match(/\/(?:reel|videos)\/(\d+)/)?.[1] || (u.pathname==='/watch/'||u.pathname==='/watch'?u.searchParams.get('v'):null);if(id)return `facebook:${id}`;}
  if(host==='cooking.nytimes.com'){const id=u.pathname.match(/^\/recipes\/(\d+)/)?.[1];if(id)return `nyt:${id}`;}
  if(['youtube.com','youtu.be'].includes(host)){const id=host==='youtu.be'?u.pathname.split('/')[1]:u.searchParams.get('v')||u.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1];if(id)return `youtube:${id}`;}
  if(host==='t.me')u.pathname=u.pathname.replace(/^\/s\//,'/');
  return `${host}${u.pathname.replace(/\/$/,'')}${u.search}`;
}
