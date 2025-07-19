import React, { useState } from "react";
import UrlInput from "../components/UrlInput";
import DonutChart from "../components/DonutChart";
import { scrapeTableFromUrl } from "../utils/scrapeTable";

export default function Home() {
  const [url, setUrl] = useState("");
  const [table, setTable] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCol, setSelectedCol] = useState<number | null>(null);

  const handleUrlSubmit = async (inputUrl: string) => {
    setUrl(inputUrl);
    setTable([]);
    setError("");
    setLoading(true);
    setSelectedCol(null);
    const data = await scrapeTableFromUrl(inputUrl);
    setLoading(false);
    if (data && data.length) {
      setTable(data);
    } else {
      setError("表データを抽出できませんでした。（CORSまたは表が存在しません）");
    }
  };

  // 숫자 컬럼만 필터링
  let numericColIndices: number[] = [];
  let numericColNames: string[] = [];
  if (table.length > 1) {
    table[0].slice(1).forEach((col, idx) => {
      const val = table[1][idx + 1];
      const num = Number(val?.replace(/,/g, ""));
      if (!isNaN(num) && val !== "") {
        numericColIndices.push(idx + 1);
        numericColNames.push(col);
      }
    });
  }

  // 컬럼 선택 시각화 데이터 준비
  let chartLabels: string[] = [];
  let chartData: number[] = [];
  if (table.length > 1 && selectedCol !== null) {
    chartLabels = table.slice(1).map(row => row[0] || ""); // 첫 번째 컬럼을 라벨로
    chartData = table.slice(1).map(row => {
      const val = row[selectedCol!];
      const num = Number(val.replace(/,/g, ""));
      return isNaN(num) ? 0 : num;
    });
  }
  const hasChartData = chartLabels.length > 0 && chartData.some(v => v !== 0);

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: 24 }}>
      <h1>Table to Donut</h1>
      <UrlInput onSubmit={handleUrlSubmit} />
      {loading && <div style={{ marginTop: 24 }}>表データを取得中です...</div>}
      {error && <div style={{ color: "red", marginTop: 24 }}>{error}</div>}
      {table.length > 1 && (
        numericColIndices.length > 0 ? (
          <div style={{ marginTop: 32 }}>
            <div style={{ marginBottom: 12 }}>可視化する列を選択してください：</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {numericColIndices.map((colIdx, i) => (
                <button
                  key={colIdx}
                  onClick={() => setSelectedCol(colIdx)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 20,
                    border: selectedCol === colIdx ? "2px solid #36A2EB" : "1px solid #ccc",
                    background: selectedCol === colIdx ? "#e3f2fd" : "#f5f5f5",
                    color: selectedCol === colIdx ? "#1976d2" : "#333",
                    fontWeight: selectedCol === colIdx ? "bold" : "normal",
                    cursor: "pointer",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                >
                  {numericColNames[i]}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 32, color: "#888", textAlign: "center" }}>
            数値データを持つ列が見つかりませんでした
          </div>
        )
      )}
      {selectedCol !== null && (
        hasChartData ? (
          <DonutChart labels={chartLabels} data={chartData} />
        ) : (
          <div style={{ marginTop: 32, color: "#888", textAlign: "center" }}>
            選択した列に数値データがありません
          </div>
        )
      )}
    </main>
  );
}
