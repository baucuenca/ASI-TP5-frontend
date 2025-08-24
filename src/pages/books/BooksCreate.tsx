// Pagina para dar de alta un libro a traves de un formulario

import { useState } from "react";
import { libraryAPI } from "../../services/libraryAPI";
import GoBackButton from "../../components/GoBackButton";

type BookCreate = {
  title: string;
  author: string;
  published_year: number;
  isbn: string;
  stock: number;
};

function BooksCreate() {
  const [bookCreate, setBookCreate] = useState<BookCreate>({
    title: "",
    author: "",
    published_year: new Date().getFullYear(),
    isbn: "",
    stock: 1, // Stock por defecto
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Seteo de valores a la instancia de BookCreate, se diferencia entre numbers y strings
    if (name === "published_year" || name === "stock") {
      setBookCreate((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setBookCreate((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validación
    if (!bookCreate.title || !bookCreate.author || !bookCreate.isbn) {
      setErrorMsg("Completá título, autor e ISBN.");
      return;
    }
    if (!bookCreate.published_year || Number.isNaN(bookCreate.published_year)) {
      setErrorMsg(
        "El año de publicacion no puede estar vacio y debe ser un numero."
      );
      return;
    }
    if (!bookCreate.stock || Number.isNaN(bookCreate.stock)) {
      setErrorMsg("El stock no puede estar vacio y debe ser un numero.");
      return;
    }

    // Llamada a la API
    try {
      setLoading(true);
      await libraryAPI("post", "/books", bookCreate);
      setSuccessMsg("Libro creado correctamente.");
    } catch (err: any) {
      const apiError =
        err?.response?.data?.detail ||
        err?.message ||
        "Error al crear el libro.";
      setErrorMsg(String(apiError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-center">Nuevo Libro</h1>

        {errorMsg && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
            {successMsg}
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm text-slate-600 mb-1">Título</label>
            <input
              name="title"
              value={bookCreate.title}
              onChange={onChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: El Principito"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Autor</label>
            <input
              name="author"
              value={bookCreate.author}
              onChange={onChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Antoine de Saint-Exupéry"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Año de publicación
            </label>
            <input
              type="number"
              name="published_year"
              value={bookCreate.published_year}
              onChange={onChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: 1943"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">ISBN</label>
            <input
              name="isbn"
              value={bookCreate.isbn}
              onChange={onChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: 978-..."
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={bookCreate.stock}
              onChange={onChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: 10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>

        <GoBackButton />
      </div>
    </main>
  );
}

export default BooksCreate;
