import test from "node:test";
import assert from "node:assert/strict";
import { publicAddress, publicTarget, browserUrl } from "../lib/recipes/browser-network.mjs";

test("browser cannot reach loopback, private, metadata, reserved or mapped private IPs", () => {
  for (const address of ["127.0.0.1", "10.0.0.1", "172.16.0.1", "192.168.1.1", "169.254.169.254", "0.0.0.0", "100.64.0.1", "192.0.2.1", "224.0.0.1", "::1", "fc00::1", "fe80::1", "::ffff:127.0.0.1", "bad"])
    assert.equal(publicAddress(address), false, address);
  assert.equal(publicAddress("1.1.1.1"), true);
  assert.equal(publicAddress("2606:4700:4700::1111"), true);
});
test("browser allows web URLs only, without credentials or unusual ports", () => {
  for (const url of ["file:///etc/passwd", "ftp://example.com", "http://user:secret@example.com", "https://example.com:22"])
    assert.throws(() => browserUrl(url));
  assert.equal(browserUrl("https://example.com/recipe").hostname, "example.com");
});
test("DNS target is resolved once and pinned; mixed private records are rejected", async () => {
  let calls = 0;
  const address = await publicTarget("example.com", async () => {
    calls++; return [{ address: "1.1.1.1" }];
  });
  assert.equal(address, "1.1.1.1"); assert.equal(calls, 1);
  await assert.rejects(publicTarget("example.com", async () => [{ address: "1.1.1.1" }, { address: "127.0.0.1" }]));
  await assert.rejects(publicTarget("[::1]"));
});
