// Rutas de la aplicacion

import "./index.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Loans from "./pages/Loans";
import Members from "./pages/Members";
import booksRoutes from "./routes/booksRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/members" element={<Members />} />
        {booksRoutes}
      </Routes>
    </>
  );
}

export default App;
