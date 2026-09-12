import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { browserProxy, browserUrl } from "./browser-network.mjs";
let executable;

// An unsigned browser visit is separate evidence from the AI search provider.
// No login, CAPTCHA bypass, video playback or synthetic screenshot fallback.
export async function captureSource(url) {
  browserUrl(url);
  let browser, proxy, expired = false, stage = "startup";
  const timer = setTimeout(() => {
    expired = true;
    browser?.process()?.kill("SIGKILL");
    proxy?.close();
  }, 22000);
  try {
    proxy = await browserProxy();
    // Concurrent imports in one warm function must not decompress the same binary twice.
    executable ||= chromium.executablePath().catch((error) => { executable = null; throw error; });
    const executablePath = await executable;
    if (expired) throw new Error("Capture deadline");
    stage = "launch";
    browser = await puppeteer.launch({
      executablePath, headless: "shell", pipe: true, timeout: 8000,
      protocolTimeout: 5000,
      defaultViewport: { width: 1280, height: 960, deviceScaleFactor: 1 },
      env: Object.fromEntries(["PATH", "LD_LIBRARY_PATH", "FONTCONFIG_PATH", "LANG"]
        .filter((key) => process.env[key]).map((key) => [key, process.env[key]])),
      args: [...chromium.args.filter((arg) => !/disable-web-security|ignore-certificate-errors|allow-running-insecure-content/.test(arg)),
        `--proxy-server=${proxy.address}`, "--proxy-bypass-list=<-loopback>",
        "--disable-quic", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp",
        "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1"],
    });
    if (expired) throw new Error("Capture deadline");
    stage = "navigation";
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const allowed = /^(https?:|data:|blob:)/.test(req.url()) && req.resourceType() !== "media";
      (allowed ? req.continue() : req.abort()).catch(() => {});
    });
    let response, navigation = "loaded";
    try { response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 11000 }); }
    catch { navigation = "incomplete"; }
    const finalUrl = page.url();
    if (!/^https?:/.test(finalUrl)) throw new Error("No source page rendered");
    // Bounded readiness for client-rendered login/error screens.
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 1500 }).catch(() => {});
    stage = "screenshot";
    const title = (await page.title()).slice(0, 300);
    const image = Buffer.from(await page.screenshot({ type: "jpeg", quality: 65, fullPage: false }));
    if (image.length > 1024 * 1024) throw new Error("Screenshot too large");
    return { image, title, finalUrl, navigation, httpStatus: response?.status() || null, capturedAt: Date.now() };
  } catch (error) {
    console.warn("Recipe browser capture failed", { stage, type: error.name, code: error.code || null, expired });
    throw error;
  } finally {
    clearTimeout(timer);
    browser?.process()?.kill("SIGKILL");
    proxy?.close();
  }
}
