import http from "node:http";
import net from "node:net";
import { lookup } from "node:dns/promises";
import ipaddr from "ipaddr.js";

export function publicAddress(address) {
  try { return ipaddr.process(address).range() === "unicast"; }
  catch { return false; }
}

export function browserUrl(value) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password ||
      (url.port && url.port !== (url.protocol === "https:" ? "443" : "80")))
    throw new Error("Unsupported browser URL");
  return url;
}

// Resolve once and connect to that exact public IP. Checking DNS and then letting
// Chromium resolve again would allow a DNS-rebinding request into private networks.
export async function publicTarget(host, resolver = lookup) {
  const hostname = host.replace(/^\[|\]$/g, "");
  const addresses = net.isIP(hostname) ? [{ address: hostname }] :
    await resolver(hostname, { all: true, family: 4 });
  if (!addresses.length || addresses.some(({ address }) => !publicAddress(address)))
    throw new Error("Private browser destination");
  return addresses[0].address;
}

export async function browserProxy() {
  const sockets = new Set();
  let closed = false, bytes = 0;
  const track = (socket) => {
    if (closed) { socket.destroy(); return socket; }
    sockets.add(socket);
    socket.setTimeout(15000, () => socket.destroy());
    socket.on("error", () => socket.destroy());
    socket.on("close", () => sockets.delete(socket));
    socket.on("data", (data) => {
      bytes += data.length;
      if (bytes > 25 * 1024 * 1024) for (const s of sockets) s.destroy();
    });
    return socket;
  };
  const server = http.createServer(async (req, res) => {
    try {
      const url = browserUrl(req.url);
      if (url.protocol !== "http:" || req.method !== "GET") throw new Error("Unsupported request");
      const address = await publicTarget(url.hostname);
      if (closed) return res.destroy();
      const headers = { ...req.headers, host: url.host };
      delete headers["proxy-authorization"];
      const upstream = http.request({ hostname: address, port: 80, path: url.pathname + url.search,
        method: "GET", headers,
      }, (response) => { res.writeHead(response.statusCode, response.headers); response.pipe(res); });
      upstream.on("socket", track);
      upstream.on("error", () => res.destroy());
      req.on("aborted", () => upstream.destroy());
      upstream.end();
    } catch { res.writeHead(403).end(); }
  });
  server.on("connection", track);
  server.on("connect", async (req, client, head) => {
    try {
      const url = browserUrl(`https://${req.url}`);
      const address = await publicTarget(url.hostname);
      if (closed || client.destroyed) return;
      const upstream = track(net.connect({ host: address, port: 443 }));
      client.on("close", () => upstream.destroy());
      upstream.on("error", () => client.destroy());
      upstream.on("connect", () => {
        client.write("HTTP/1.1 200 Connection Established\r\n\r\n");
        if (head.length) upstream.write(head);
        client.pipe(upstream); upstream.pipe(client);
      });
    } catch { client.end("HTTP/1.1 403 Forbidden\r\n\r\n"); }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return {
    address: `http://127.0.0.1:${server.address().port}`,
    close() { closed = true; for (const s of sockets) s.destroy(); server.close(); },
  };
}
