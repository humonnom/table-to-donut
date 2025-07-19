import React, { useState, useEffect } from "react";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  value?: string;
  setValue?: (url: string) => void;
}

const WIKI_REGEX = /^https:\/\/(\w+\.)?wikipedia\.org\//;

const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, value, setValue }) => {
  const [url, setUrl] = useState(value || "");
  const [error, setError] = useState("");

  // 외부 value가 바뀌면 내부 url도 동기화
  useEffect(() => {
    if (value !== undefined && value !== url) {
      setUrl(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setValue?.(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!WIKI_REGEX.test(url.trim())) {
      setError("Wikipedia（https://*.wikipedia.org/）のURLのみ入力できます。");
      return;
    }
    setError("");
    onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="url"
          placeholder="WikipediaのURLを入力してください"
          value={url}
          onChange={handleChange}
          style={{ flex: 1, padding: 8 }}
          required
        />
        <button type="submit" style={{ padding: 8 }}>Submit</button>
      </div>
      {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}
    </form>
  );
};

export default UrlInput; 