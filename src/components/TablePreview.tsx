import React from "react";

interface TablePreviewProps {
  data: string[][];
}

const TablePreview: React.FC<TablePreviewProps> = ({ data }) => {
  if (!data.length) return null;
  return (
    <table style={{ borderCollapse: "collapse", width: "100%", marginTop: 24 }}>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td
                key={j}
                style={{ border: "1px solid #ccc", padding: 6, textAlign: "center" }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablePreview; 