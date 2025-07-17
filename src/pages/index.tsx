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
      setError("표 데이터를 추출할 수 없습니다. (CORS 또는 표 없음)");
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: 24 }}>
      <h1>Table to Donut</h1>
      <UrlInput onSubmit={handleUrlSubmit} />
      {loading && <div style={{ marginTop: 24 }}>표 데이터를 불러오는 중...</div>}
      {error && <div style={{ color: "red", marginTop: 24 }}>{error}</div>}
      {table.length > 0 && <TablePreview data={table} />}
    </main>
  );
}
