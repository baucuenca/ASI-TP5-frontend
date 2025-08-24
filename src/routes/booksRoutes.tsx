// Rutas asociadas a libros

import { Route } from "react-router-dom";
import Books from "../pages/books/Books";
import BooksCreate from "../pages/books/BooksCreate";
import BooksManage from "../pages/books/BooksManage";

const booksRoutes = (
  <>
    <Route path="/books" element={<Books />} />
    <Route path="/books/create" element={<BooksCreate />} />
    <Route path="/books/manage" element={<BooksManage />} />
  </>
);

export default booksRoutes;
