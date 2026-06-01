import { useState } from "react";
import { BsLock, BsPerson, BsRecycle } from "react-icons/bs";
import { USUARIOS } from "../helpers/usuarios";
import "../css/login.css";


function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  function login() {
    const uTrim = String(user).trim();
    const pTrim = String(pass).trim();

    if (!uTrim || !pTrim) {
      setError("Ingresá usuario y contraseña.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const found = USUARIOS.find(
        (u) => u.usuario === uTrim && u.clave === pTrim
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
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <BsRecycle aria-hidden="true" />
          </div>
          <h1>SIMULARG</h1>
          <p>Gestión y simulación de e-waste</p>
        </div>


        <div className="login-field">
          <label>Usuario</label>
          <div className={`login-input-wrap${error ? " error" : ""}`}>
            <BsPerson aria-hidden="true" />
            <input
              type="text"
              value={user}
              placeholder="usuario"
              onChange={(e) => {
                setUser(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>
        </div>

        <div className="login-field">
          <label>Contraseña</label>
          <div className={`login-input-wrap${error ? " error" : ""}`}>
            <BsLock aria-hidden="true" />
            <input
              type="password"
              value={pass}
              placeholder="••••••••"
              onChange={(e) => {
                setPass(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>
        </div>


        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        <button
          type="button"
          className="login-button"
          onClick={login}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="login-spinner" aria-hidden="true"></span>
              Verificando
            </>
          ) : (
            "Iniciar sesión"
          )}
        </button>


        <div className="login-access">
          usuario <code>fnallim</code> · clave{" "}
          <code>reciclarg2026</code>
        </div>
      </div>
    </div>
  );
}


export default LoginScreen;























































