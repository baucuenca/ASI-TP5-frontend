// Pagina para gestionar los libros

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { libraryAPI } from "../../services/libraryAPI";
import GoBackButton from "../../components/GoBackButton";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  is_active: boolean;
  published_year: number;
  stock: number;
};

function BooksManage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await libraryAPI<Book[]>("get", "/books");
        setBooks(data);
      } catch (err: any) {
        setErrorMsg(
          err?.response?.data?.detail ||
            err?.message ||
            "Error al obtener libros."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    // Normaliza la cadena de búsqueda para que no tenga en cuenta acentos ni mayúsculas
    const normalize = (s: string) =>
      s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const q = normalize(search.trim());

    if (!q) return books;
    return books.filter((b) => normalize(b.title).includes(q));
  }, [books, search]); // Dependencias que, si cambian, hacen que se vuelva a calcular el filtro

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-3xl font-bold text-center">Gestionar Libros</h1>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título..."
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {loading ? (
          <div className="rounded-md border border-slate-200 bg-white p-4 text-slate-600 shadow-sm">
            Cargando...
          </div>
        ) : errorMsg ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
            {errorMsg}
          </div>
        ) : (
          // Contenedor con altura limitada y scroll interno
          <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            <div className="max-h-90 overflow-y-auto pr-1">
              <ul className="space-y-3">
                {filtered.length === 0 ? (
                  <li className="rounded-md border border-slate-200 bg-white p-4 text-slate-600 shadow-sm">
                    No hay resultados.
                  </li>
                ) : (
                  filtered.map((b) => (
                    <li
                      key={b.id}
                      className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div>
                        <p className="text-slate-900 font-medium">{b.title}</p>
                        <p className="text-sm text-slate-500">por {b.author}</p>
                      </div>

                      <Link
                        to={`/books/update/${b.id}`}
                        className="opacity-0 group-hover:opacity-100 transition px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`Editar ${b.title}`}
                      >
                        Editar
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}

        <GoBackButton />
      </div>
    </main>
  );
}

export default BooksManage;
