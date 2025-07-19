import React, { useState, useEffect } from "react";
import UrlInput from "../components/UrlInput";
import DonutChart from "../components/DonutChart";
import { scrapeTableFromUrl } from "../utils/scrapeTable";
import Head from "next/head";

const recommendedUrls = [
  {
    label: "GDP by Country (Nominal)",
    url: "https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)"
  },
  {
    label: "Population by Country",
    url: "https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population"
  },
  {
    label: "2020 Tokyo Olympics Medal Table",
    url: "https://en.wikipedia.org/wiki/2020_Summer_Olympics_medal_table"
  }
];

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

  // 숫자 컬럼만 필터링 및 합계 계산
  let numericCols: { idx: number; name: string; sum: number }[] = [];
  if (table.length > 1) {
    table[0].slice(1).forEach((col, idx) => {
      const values = table.slice(1).map(row => row[idx + 1]);
      const nums = values.map(val => Number(val?.replace(/,/g, "")));
      if (nums.every((v, i) => !isNaN(v) && values[i] !== "")) {
        const sum = nums.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0);
        numericCols.push({ idx: idx + 1, name: col, sum });
      }
    });
    // 합계가 큰 순서대로 정렬
    numericCols.sort((a, b) => b.sum - a.sum);
  }

  // numericCols가 바뀔 때 첫 번째 조약돌 자동 선택
  useEffect(() => {
    if (numericCols.length > 0) {
      setSelectedCol(numericCols[0].idx);
    } else {
      setSelectedCol(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericCols.map(col => col.idx).join(",")]);

  // 추천 URL 클릭 시 입력창에 자동 입력 및 submit
  const handleRecommendedClick = (recUrl: string) => {
    setUrl(recUrl);
    handleUrlSubmit(recUrl);
  };

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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Head>
        <title>See Wikipedia tables as donut charts</title>
        <meta name="description" content="Visualize any Wikipedia table as a beautiful donut chart. Just paste the URL!" />
      </Head>
      {/* 사이드바 */}
      <aside style={{ width: 220, background: "var(--sidebar-bg)", borderRight: "1px solid var(--border-color)", padding: 24 }}>
        <h3 style={{ fontSize: 18, marginBottom: 16, color: "var(--text-color)" }}>Recommended Wikipedia</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {recommendedUrls.map(rec => (
            <li key={rec.url} style={{ marginBottom: 12 }}>
              <button
                onClick={() => handleRecommendedClick(rec.url)}
                style={{
                  background: "var(--button-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: 15,
                  color: "var(--text-color)",
                  transition: "background 0.2s"
                }}
              >
                {rec.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* 메인 콘텐츠 */}
      <main style={{ flex: 1, maxWidth: 600, margin: "40px auto", padding: 24, background: "var(--main-bg)", color: "var(--text-color)" }}>
        <h1 style={{ marginBottom: 32 }}>See Wikipedia tables<br />as donut charts</h1>
        <UrlInput onSubmit={handleUrlSubmit} value={url} setValue={setUrl} />
        {loading && <div style={{ marginTop: 24 }}>表データを取得中です...</div>}
        {error && <div style={{ color: "red", marginTop: 24 }}>{error}</div>}
        {table.length > 1 && (
          numericCols.length > 0 ? (
            <div style={{ marginTop: 32 }}>
              <div style={{ display: "flex", flexWrap: "nowrap", gap: 8, overflowX: "auto" }}>
                {numericCols.map(col => (
                  <button
                    key={col.idx}
                    onClick={() => setSelectedCol(col.idx)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 20,
                      border: selectedCol === col.idx ? "2px solid #36A2EB" : "1px solid var(--border-color)",
                      background: selectedCol === col.idx ? "#1976d2" : "var(--button-bg)",
                      color: selectedCol === col.idx ? "#fff" : "var(--text-color)",
                      fontWeight: selectedCol === col.idx ? "bold" : "normal",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {col.name}
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
      <style jsx global>{`
        :root {
          --main-bg: #fff;
          --sidebar-bg: #f7f7fa;
          --text-color: #222;
          --button-bg: #f5f5f5;
          --border-color: #ddd;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --main-bg: #181a1b;
            --sidebar-bg: #23272a;
            --text-color: #f1f1f1;
            --button-bg: #23272a;
            --border-color: #444;
          }
        }
        body {
          background: var(--main-bg);
          color: var(--text-color);
        }
        input, button {
          background: var(--button-bg);
          color: var(--text-color);
        }
      `}</style>
    </div>
  );
}
