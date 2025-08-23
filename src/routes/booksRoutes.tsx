// Rutas asociadas a libros

import { Route } from "react-router-dom";
import Books from "../pages/Books";

const booksRoutes = (
  <>
    <Route path="/books" element={<Books />} />
  </>
);

export default booksRoutes;
