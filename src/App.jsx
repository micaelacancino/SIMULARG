import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./componentes/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Logistica from "./componentes/Logistica";
import Footer from "./componentes/Footer";
import Tratamiento from "./componentes/Tratamiento";


function App() {


  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/logistica" element={<Logistica />} />
          <Route path="/tratamiento" element={<Tratamiento />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
