// convert.mjs
import fs from "node:fs/promises";

// MoonTV 原始配置地址
const SOURCE_URL =
  "https://raw.githubusercontent.com/666zmy/MoonTV/refs/heads/main/config.json";

async function main() {
  const res = await fetch(SOURCE_URL);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch source config: ${res.status} ${res.statusText}`,
    );
  }

  const raw = await res.json();

  const apiSite = raw.api_site || {};

  // 1. 映射为目标结构
  // 2. remark 统一置空
  // 3. 最后按 name 排序（升序）
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
      return na.localeCompare(nb, "zh-Hans-CN", { sensitivity: "base" });
    });

  const output = { sites };

  await fs.writeFile("sites.json", JSON.stringify(output, null, 2), "utf8");
  console.log("Generated sites.json with", sites.length, "items");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
