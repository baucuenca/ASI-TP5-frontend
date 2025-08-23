// Raiz de la aplicacion

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  /* Se importan las rutas dentro del enrrutador BrowserRouter */
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
