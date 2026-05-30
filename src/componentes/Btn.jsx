import React from "react";


export default function Btn({ children, onClick, disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#aaa" : "#103b26", // verde si está activo, gris si está deshabilitado
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: disabled ? "default" : "pointer",
        fontWeight: 600,
        padding: "10px 14px",
        transition: "background 0.3s ease",
        ...style
      }}
    >
      {children}
    </button>
  );
}

