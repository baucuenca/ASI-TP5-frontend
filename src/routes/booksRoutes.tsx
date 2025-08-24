// Rutas asociadas a libros

import { Route } from "react-router-dom";
import Books from "../pages/books/Books";
import BooksCreate from "../pages/books/BooksCreate";

const booksRoutes = (
  <>
    <Route path="/books" element={<Books />} />
    <Route path="/books/create" element={<BooksCreate />} />
  </>
);

export default booksRoutes;
