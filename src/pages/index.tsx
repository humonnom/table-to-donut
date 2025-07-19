import React, { useState } from "react";
import UrlInput from "../components/UrlInput";
import TablePreview from "../components/TablePreview";
import { scrapeTableFromUrl } from "../utils/scrapeTable";

export default function Home() {
  const [url, setUrl] = useState("");
  const [table, setTable] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUrlSubmit = async (inputUrl: string) => {
    setUrl(inputUrl);
    setTable([]);
    setError("");
    setLoading(true);
    const data = await scrapeTableFromUrl(inputUrl);
    setLoading(false);
    if (data && data.length) {
      setTable(data);
    } else {
      setError("表データを抽出できませんでした。（CORSまたは表が存在しません）");
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: 24 }}>
      <h1>Table to Donut</h1>
      <UrlInput onSubmit={handleUrlSubmit} />
      {loading && <div style={{ marginTop: 24 }}>表データを取得中です...</div>}
      {error && <div style={{ color: "red", marginTop: 24 }}>{error}</div>}
      {table.length > 0 && <TablePreview data={table} />}
    </main>
  );
}
