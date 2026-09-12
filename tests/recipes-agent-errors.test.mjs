import test from "node:test";
import assert from "node:assert/strict";
import { responseError, failureMessage } from "../lib/recipes/agent-errors.mjs";

test("billing failures explain the required action without exposing provider text", async () => {
  const error = await responseError(new Response(JSON.stringify({ error: {
    code: "insufficient_quota", message: "Sensitive provider details sk-example",
  } }), { status: 429 }));
  assert.match(failureMessage(error), /API billing/);
  assert.doesNotMatch(failureMessage(error), /sk-example|Sensitive/);
});

test("authentication and transient rate limits give different recovery advice", async () => {
  const key = await responseError(new Response("{}", { status: 401 }));
  const rate = await responseError(new Response("{}", { status: 429 }));
  assert.match(failureMessage(key), /key was rejected/);
  assert.match(failureMessage(rate), /Wait a minute/);
});

test("malformed provider responses and unexpected errors do not leak sensitive details", async () => {
  assert.match(failureMessage(await responseError(new Response("private upstream HTML", {status:502}))), /Please retry/);
  assert.doesNotMatch(failureMessage(new Error("postgres://private:secret@host")), /private|secret|postgres/);
  assert.match(failureMessage({name:"TimeoutError"}), /took too long/);
});
