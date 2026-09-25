import {useEffect,useState} from 'react';
export default function ThemeToggle(){
 const [theme,setTheme]=useState('system');
 useEffect(()=>{try{setTheme(localStorage.getItem('recipes_theme')||'system');}catch{}},[]);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  const update=()=>{document.documentElement.dataset.recipeTheme=theme==='system'?(media.matches?'dark':'light'):theme;};
  update();media.addEventListener('change',update);return()=>{media.removeEventListener('change',update);delete document.documentElement.dataset.recipeTheme;};
 },[theme]);
 return <label className="theme-control"><span className="sr-only">Color theme</span><select aria-label="Color theme" value={theme} onChange={e=>{setTheme(e.target.value);try{localStorage.setItem('recipes_theme',e.target.value);}catch{}}}><option value="system">Device theme</option><option value="light">Light</option><option value="dark">Dark</option></select></label>;
}
