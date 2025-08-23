// Rutas de la aplicacion

import "./index.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Loans from "./pages/Loans";
import booksRoutes from "./routes/booksRoutes";
import membersRoutes from "./routes/membersRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/loans" element={<Loans />} />
        {membersRoutes}
        {booksRoutes}
      </Routes>
    </>
  );
}

export default App;
