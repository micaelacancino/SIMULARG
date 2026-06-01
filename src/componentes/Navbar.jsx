import { useState } from "react";
import "../css/navbar.css";
import { Link, useNavigate } from "react-router-dom";

function NavBar({ usuarioLogueado, setUsuarioLogueado }) {
  const [desplegarNavbar, setDesplegarNavbar] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuarioLogueado(null);
    navigate("/");
  };

  const toggleNavbar = () => {
    setDesplegarNavbar((prev) => !prev);
  };

  const closeNavbar = () => {
    setDesplegarNavbar(false);
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">

        {/* LOGO */}
        <Link
          to={"/"}
          className="navbar-brand d-flex align-items-center"
        >
          <i className="bi bi-recycle me-2"></i>
          SIMULARG
        </Link>

        {/* BOTON RESPONSIVE */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* LINKS */}
        <div
          className={`navbar-collapse ${
            desplegarNavbar ? "show" : "collapse"
          }`}
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            {/* INICIO */}
            <li className="nav-item">
              <Link
                to={"/"}
                className="nav-link fw-bold"
                onClick={closeNavbar}
              >
                <i className="bi bi-house-fill me-2"></i>
                Inicio
              </Link>
            </li>

            {/* LOGISTICA */}
            <li className="nav-item">
              <Link
                to={"/logistica"}
                className="nav-link fw-bold"
                onClick={closeNavbar}
              >
                <i className="bi bi-truck me-2"></i>
                Logística
              </Link>
            </li>

            {/* TRATAMIENTO */}
            <li className="nav-item">
              <Link
                to={"/tratamiento"}
                className="nav-link fw-bold"
                onClick={closeNavbar}
              >
                <i className="bi bi-recycle me-2"></i>
                Tratamiento
              </Link>
            </li>

            {/* REPORTES */}
            {/* <li className="nav-item">
              <Link
                to={"/reportes"}
                className="nav-link fw-bold"
                onClick={closeNavbar}
              >
                <i className="bi bi-bar-chart-fill me-2"></i>
                Reportes
              </Link>
            </li> */}

            {/* NOSOTROS */}
            <li className="nav-item">
              <Link
                to={"/nosotros"}
                className="nav-link fw-bold"
                onClick={closeNavbar}
              >
                <i className="bi bi-people-fill me-2"></i>
                Nosotros
              </Link>
            </li>

            {/* ADMIN */}
            {usuarioLogueado?.rol === "admin" && (
              <li className="nav-item d-flex align-items-center ms-2">
                <button
                  type="button"
                  className="btn btn-admin"
                >
                  Admin
                </button>
              </li>
            )}

            {/* LOGOUT */}
            {usuarioLogueado && (
              <li className="nav-item d-flex align-items-center ms-2">
                <button
                  type="button"
                  className="btn btn-logout"
                  onClick={() => {
                    handleLogout();
                    closeNavbar();
                  }}
                >
                  Salir
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
