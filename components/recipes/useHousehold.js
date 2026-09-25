import { useCallback, useEffect, useRef, useState } from "react";
import { applyAction } from "../../lib/recipes/model.mjs";
const CACHE = "martib_recipes_v2_cache",
  QUEUE = "martib_recipes_v2_queue";
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};
export function useHousehold() {
  const [state, setState] = useState(null),
    [error, setError] = useState(""),
    [pending, setPending] = useState(0),
    [online, setOnline] = useState(true),
    [agent, setAgent] = useState(false),
    [legacy, setLegacy] = useState(null),
    [saving,setSaving] = useState(0),
    [undoId,setUndoId] = useState(null),
    [actor,setActorState] = useState(""),
    [lastSynced,setLastSynced] = useState(null);
  const busy = useRef(false),
    stateRef = useRef(null),
    signingOut = useRef(false);
  const lock=useRef(Promise.resolve());
  const acquire=useCallback(async()=>{const previous=lock.current;let release;lock.current=new Promise(resolve=>{release=resolve;});await previous;return release;},[]);
  const setActor=value=>{setActorState(value);localStorage.setItem('recipes_display_name',value.slice(0,40));};
  const adopt = useCallback((s) => {
    if (signingOut.current) return;
    stateRef.current = s;
    setState(s);
    try {
      localStorage.setItem(CACHE, JSON.stringify(s));
    } catch {
      setError("Device storage is full. Offline changes cannot be saved.");
    }
  }, []);
  const sync = useCallback(async () => {
    if (busy.current || !navigator.onLine) return;
    busy.current = true;
    const release=await acquire();
    try {
      let queue = read(QUEUE, []);
      while (queue.length) {
        const response = await fetch("/api/recipes/state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(queue[0]),
          signal: AbortSignal.timeout(20000),
        });
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 401) window.location.assign("/recipes/login");
          throw new Error(data.error || "Could not sync.");
        }
        queue = read(QUEUE, []).filter((x) => x.actionId !== queue[0].actionId);
        localStorage.setItem(QUEUE, JSON.stringify(queue));
        setPending(queue.length);
        adopt(data.state);
      }
      const response = await fetch("/api/recipes/state",{signal:AbortSignal.timeout(20000)});
      if (response.status === 401) {
        window.location.assign("/recipes/login");
        return;
      }
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not load recipes.");
      adopt(data.state);
      setAgent(data.agent);
      setLastSynced(Date.now());
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      busy.current = false;
      release();
    }
  }, [adopt,acquire]);
  useEffect(() => {
    adopt(read(CACHE, null));
    setActorState(localStorage.getItem("recipes_display_name")||"");
    setPending(read(QUEUE, []).length);
    setOnline(navigator.onLine);
    const legacyKeys = {
      custom: "martib_recipes_custom",
      edits: "martib_recipes_edits",
      deleted: "martib_recipes_deleted",
      cooked: "martib_recipes_cooked",
      week: "martib_week_plan",
      weekCooked: "martib_week_cooked",
    };
    if (
      !localStorage.getItem("martib_recipes_v2_migrated") &&
      Object.values(legacyKeys).some((k) => localStorage.getItem(k))
    )
      setLegacy(
        Object.fromEntries(
          Object.entries(legacyKeys).map(([k, v]) => [
            k,
            read(v, ["custom", "deleted"].includes(k) ? [] : {}),
          ]),
        ),
      );
    sync();
    const update = () => {
      setOnline(navigator.onLine);
      sync();
    };
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    window.addEventListener("focus", update);
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") sync();
    }, 5000);
    if ("serviceWorker" in navigator)
      navigator.serviceWorker
        .register("/recipes-sw.js", { scope: "/recipes" })
        .catch(() => {});
    return () => {
      clearInterval(timer);
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      window.removeEventListener("focus", update);
    };
  }, [adopt, sync]);
  const act = async (action) => {
    setError("");
    setSaving(n=>n+1);
    const release=await acquire();
    try {
      const full = { ...action, actor:localStorage.getItem("recipes_display_name")||"Household", actionId: crypto.randomUUID() };
      if (!navigator.onLine) {
        if (!["cooked", "weekCooked", "check"].includes(action.type))
          throw new Error(
            "Connect to the internet for this change. Checkboxes work offline.",
          );
        const next = applyAction(structuredClone(stateRef.current), full);
        const q = [...read(QUEUE, []), full];
        localStorage.setItem(QUEUE, JSON.stringify(q));
        setPending(q.length);
        adopt(next);
        return true;
      }
      let queued=read(QUEUE,[]);
      while(queued.length){
        const replay=await fetch('/api/recipes/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(queued[0]),signal:AbortSignal.timeout(20000)});
        const result=await replay.json();if(!replay.ok)throw Error(result.error||'Could not sync pending changes.');
        queued=read(QUEUE,[]).filter(x=>x.actionId!==queued[0].actionId);localStorage.setItem(QUEUE,JSON.stringify(queued));setPending(queued.length);adopt(result.state);
      }
      const response = await fetch("/api/recipes/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(full),
        signal: AbortSignal.timeout(20000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save.");
      adopt(data.state);
      setLastSynced(Date.now());
      if(['delete','plan','clearBasket','startFresh','basket','shopWeek','cooked','weekCooked'].includes(action.type))setUndoId(full.actionId);
      if(action.type==='undo')setUndoId(null);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      release();
      setSaving(n=>n-1);
    }
  };
  const job = async (payload) => {
    try {
      const r = await fetch("/api/recipes/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not start import.");
      await sync();
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };
  const migrate = async () => {
    let device = localStorage.getItem("martib_recipes_device");
    if (!device) {
      device = crypto.randomUUID();
      localStorage.setItem("martib_recipes_device", device);
    }
    if (await act({ type: "migrate", device, legacy })) {
      localStorage.setItem("martib_recipes_v2_migrated", "true");
      setLegacy(null);
    }
  };
  const logout = async () => {
    if (
      read(QUEUE, []).length &&
      !window.confirm(
        "Some changes have not synced. Sign out and discard those pending changes?",
      )
    )
      return;
    signingOut.current = true;
    try {
      await fetch("/api/recipes/session", { method: "DELETE" });
    } catch {
      signingOut.current = false;
      setError("Connect to the internet to sign out.");
      return;
    }
    localStorage.removeItem(CACHE);
    localStorage.removeItem(QUEUE);
    if ("caches" in window)
      for (const name of await caches.keys())
        if (name.startsWith("martib-recipes-")) await caches.delete(name);
    window.location.assign("/recipes/login");
  };
  return {
    state,
    saving,undoId,actor,setActor,lastSynced,
    error,
    pending,
    online,
    agent,
    legacy,
    act,
    job,
    migrate,
    logout,
    sync,
  };
}
