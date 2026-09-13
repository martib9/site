import { useState } from 'react';
export default function TelegramCompanion() {
  const [data,setData]=useState(null),[error,setError]=useState(''),[link,setLink]=useState(''),[busy,setBusy]=useState(false);
  async function request(body) {
    setBusy(true);setError('');
    try {
      const r=await fetch('/api/recipes/telegram',{method:body?'POST':'GET',headers:{'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
      const value=await r.json();if(!r.ok)throw new Error(value.error || 'Could not load Telegram connection.');
      if(value.url)setLink(value.url);
      else if(!body)setData(value);
      if(body?.action==='disconnect') {setLink('');setData(previous=>previous?{...previous,users:previous.users.filter(u=>u.id!==body.id)}:previous);}
    } catch(e){setError(e.message);} finally {setBusy(false);}
  }
  return <details className="activity" onToggle={e=>{if(e.currentTarget.open&&!busy)request();}}>
    <summary>Telegram companion</summary>
    <p>Send a recipe link to the bot to save it here and import its ingredients. Connect your account and your spouse’s account separately.</p>
    {data?.users.map(u=><p key={u.id}>{u.name} · connected <button disabled={busy} onClick={()=>request({action:'disconnect',id:u.id})}>Disconnect</button></p>)}
    {data && <button disabled={busy || data.users.length>=2} onClick={()=>request({action:'pair'})}>{busy?'Connecting…':'Connect a Telegram account'}</button>}
    {link&&<p><a href={link} target="_blank" rel="noreferrer">Open Telegram and tap Start</a><br />This private connection link expires in 15 minutes and works once. Generate a separate link for your spouse.</p>}
    {error&&<p role="alert">{error}</p>}
  </details>;
}
