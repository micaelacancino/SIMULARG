import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./componentes/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Logistica from "./componentes/Logistica";
import Footer from "./componentes/Footer";
import Tratamiento from "./componentes/Tratamiento";
import LoginScreen from "./componentes/LoginScreen";
import SobreNosotros from "./componentes/SobreNosotros";

import { useState } from "react";

import Home from "./componentes/Home";

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  });

  function handleLogin(usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setUsuarioLogueado(usuario);
  }

  function handleLogout() {
    localStorage.removeItem("usuario");
    setUsuarioLogueado(null);
  }

  return (
    <>
      <Router>
        {!usuarioLogueado ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <>
            <NavBar
              usuarioLogueado={usuarioLogueado}
              setUsuarioLogueado={handleLogout}
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/logistica" element={<Logistica />} />
              <Route path="/tratamiento" element={<Tratamiento />} />
              <Route path="/nosotros" element={<SobreNosotros />} />
            </Routes>
            <Footer />
          </>
        )}
      </Router>
    </>
  );
}

export default App;
