export async function scrapeTableFromUrl(url: string): Promise<string[][] | null> {
  try {
    const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error("Failed to fetch page");
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const table = doc.querySelector("table");
    if (!table) return null;
    const rows = Array.from(table.querySelectorAll("tr"));
    return rows.map(row =>
      Array.from(row.querySelectorAll("th,td")).map(cell => cell.textContent?.trim() || "")
    );
  } catch (e) {
    return null;
  }
} 