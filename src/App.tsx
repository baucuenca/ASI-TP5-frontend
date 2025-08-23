// Rutas de la aplicacion

import "./index.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import booksRoutes from "./routes/booksRoutes";
import membersRoutes from "./routes/membersRoutes";
import loansRoutes from "./routes/loansRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        {loansRoutes}
        {membersRoutes}
        {booksRoutes}
      </Routes>
    </>
  );
}

export default App;
