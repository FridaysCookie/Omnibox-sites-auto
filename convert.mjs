// convert.mjs
import fs from "node:fs/promises";

// 源 URL
const FULL_URL =
  "https://raw.githubusercontent.com/hafrey1/LunaTV-config/refs/heads/main/LunaTV-config.json";

const LITE_URL =
  "https://raw.githubusercontent.com/hafrey1/LunaTV-config/refs/heads/main/jingjian.json";

// 判断是否英文开头
function isEnglish(str) {
  return /^[A-Za-z]/.test(str.trim());
}

// 转换函数
function convert(rawApiSite) {
  const apiSite = rawApiSite || {};

  // 映射 + 排序
  const sites = Object.values(apiSite)
    .map((item) => ({
      id: "",
      key: item.name || "",
      name: item.name || "",
      api: item.api || "",
      type: 2,
      isActive: 1,
      time: "",
      isDefault: 0,
      remark: "",
      tags: [],
      priority: 0,
      proxyMode: "none",
      customProxy: "",
    }))
    .sort((a, b) => {
      const na = a.name || "";
      const nb = b.name || "";
      const aEng = isEnglish(na);
      const bEng = isEnglish(nb);

      if (aEng && !bEng) return -1;
      if (!aEng && bEng) return 1;

      if (aEng && bEng)
        return na.localeCompare(nb, "en", { sensitivity: "base" });

      return na.localeCompare(nb, "zh-Hans-CN", { sensitivity: "base" });
    });

  return { sites };
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status}: ${url}`);
  }
  return res.json();
}

async function main() {
  console.log("Fetching full config…");
  const fullRaw = await fetchJSON(FULL_URL);

  console.log("Fetching lite config…");
  const liteRaw = await fetchJSON(LITE_URL);

  console.log("Converting full…");
  const fullOutput = convert(fullRaw.api_site);

  console.log("Converting lite…");
  const liteOutput = convert(liteRaw.api_site);

  console.log("Writing sitesFull.json …");
  await fs.writeFile("sitesFull.json", JSON.stringify(fullOutput, null, 2));

  console.log("Writing sitesLite.json …");
  await fs.writeFile("sitesLite.json", JSON.stringify(liteOutput, null, 2));

  console.log("All done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
