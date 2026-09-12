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
    [legacy, setLegacy] = useState(null);
  const busy = useRef(false),
    stateRef = useRef(null),
    signingOut = useRef(false);
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
    try {
      let queue = read(QUEUE, []);
      while (queue.length) {
        const response = await fetch("/api/recipes/state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(queue[0]),
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
      const response = await fetch("/api/recipes/state");
      if (response.status === 401) {
        window.location.assign("/recipes/login");
        return;
      }
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not load recipes.");
      adopt(data.state);
      setAgent(data.agent);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      busy.current = false;
    }
  }, [adopt]);
  useEffect(() => {
    adopt(read(CACHE, null));
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
    }, 10000);
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
    let acquired = false;
    const full = { ...action, actionId: crypto.randomUUID() };
    try {
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
      if (busy.current || read(QUEUE, []).length)
        throw new Error("Sync is in progress. Please try again in a moment.");
      busy.current = true;
      acquired = true;
      const response = await fetch("/api/recipes/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(full),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save.");
      adopt(data.state);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      if (acquired) busy.current = false;
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
