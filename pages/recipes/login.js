import Head from "next/head";
import { useState } from "react";
import { authConfigured, authenticated } from "../../lib/recipes/auth";
import { configured } from "../../lib/recipes/db";
export async function getServerSideProps({ req, res }) {
  res.setHeader("Cache-Control", "private,no-store");
  if (authenticated(req))
    return { redirect: { destination: "/recipes", permanent: false } };
  return { props: { ready: authConfigured() && configured() } };
}
export default function Login({ ready }) {
  const [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch("/api/recipes/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      window.location.assign("/recipes");
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }
  return (
    <div className="recipes-app">
      <Head>
        <title>Sign in · Martib Recipes</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="recipe-login">
        <p className="recipes-brand">
          Martib<span>Recipes</span>
        </p>
        <h1>Your household kitchen.</h1>
        <p className="muted">Recipes worth saving. Meals worth making.</p>
        {ready ? (
          <form className="recipe-form" onSubmit={submit}>
            <label>
              Household password
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && <p role="alert">{error}</p>}
            <button className="primary" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        ) : (
          <p className="notice">
            Your private recipe space is awaiting setup. Household sign-in and
            shared storage must be connected before it opens.
          </p>
        )}
      </main>
    </div>
  );
}
