import React, { useState } from "react";
import Btn from "./Btn";
import { USUARIOS } from "../helpers/usuarios";
import { C } from "../helpers/colores";


function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  function login() {
    setLoading(true);
    setTimeout(() => {
      const found = USUARIOS.find(
        (u) => u.usuario === user && u.clave === pass
      );
      if (found) {
        onLogin(found);
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
      setLoading(false);
    }, 600);
  }


  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${C.verdeOsc} 0%, ${C.verde} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "40px 44px",
          width: 370,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 16,
              background: C.verde,
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            ♻
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: C.verde,
              letterSpacing: -0.5,
            }}
          >
            Reciclarg
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
            Inicia sesión para continuar
          </div>
        </div>


        {[["Usuario", "text", "usuario", user, setUser],
          ["Contraseña", "password", "••••••••", pass, setPass]].map(
          ([lbl, type, ph, val, set]) => (
            <div key={lbl} style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.gris,
                  display: "block",
                  marginBottom: 5,
                }}
              >
                {lbl}
              </label>
              <input
                type={type}
                value={val}
                placeholder={ph}
                onChange={(e) => {
                  set(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && login()}
                style={{
                  width: "100%",
                  padding: "10px 13px",
                  borderRadius: 8,
                  fontSize: 14,
                  border: `1.5px solid ${error ? C.rojo : C.borde}`,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )
        )}


        {error && (
          <div
            style={{
              fontSize: 13,
              color: C.rojo,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}


        <Btn
          onClick={login}
          disabled={loading}
          style={{ width: "100%", padding: "11px" }}
        >
          {loading ? "Verificando..." : "Iniciar sesión"}
        </Btn>


        <div
          style={{
            marginTop: 16,
            padding: 11,
            background: C.verdeSup,
            borderRadius: 8,
            fontSize: 12,
            color: C.verde2,
          }}
        >
          <strong>Demo:</strong> usuario <code>fnallim</code> · clave{" "}
          <code>reciclarg2026</code>
        </div>
      </div>
    </div>
  );
}


export default LoginScreen;























































