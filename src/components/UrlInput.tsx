import React, { useState } from "react";

interface UrlInputProps {
  onSubmit: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        type="url"
        placeholder="Enter website URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ flex: 1, padding: 8 }}
        required
      />
      <button type="submit" style={{ padding: 8 }}>Submit</button>
    </form>
  );
};

export default UrlInput; 