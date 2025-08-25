// Pagina para gestionar los libros

import { useEffect, useMemo, useState } from "react";
import { libraryAPI } from "../../services/libraryAPI";
import GoBackButton from "../../components/GoBackButton";
import EditButton from "../../components/EditButton";
import DeleteButton from "../../components/DeleteButton";
import ReadButton from "../../components/ReadButton";

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

  // Estado del modal de "Ver"
  const [selected, setSelected] = useState<Book | null>(null);
  const closeModal = () => setSelected(null);

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

                      {/* Botón "Ver" */}
                      <ReadButton onClick={() => setSelected(b)} />
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}

        <GoBackButton />
      </div>

      {/* Modal de "Ver" */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          ></div>

          {/* Contenido */}
          <div className="relative z-10 w-full max-w-lg mx-4 rounded-lg bg-white shadow-lg border border-slate-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Detalle del Libro
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-2xl font-bold text-slate-500 hover:text-slate-700"
                aria-label="Cerrar"
                title="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-4 space-y-2">
              <p>
                <span className="font-medium text-slate-700">Título:</span>{" "}
                {selected.title}
              </p>
              <p>
                <span className="font-medium text-slate-700">Autor:</span>{" "}
                {selected.author}
              </p>
              <p>
                <span className="font-medium text-slate-700">ISBN:</span>{" "}
                {selected.isbn}
              </p>
              <p>
                <span className="font-medium text-slate-700">
                  Año de publicación:
                </span>{" "}
                {selected.published_year}
              </p>
              <p>
                <span className="font-medium text-slate-700">Stock:</span>{" "}
                {selected.stock}
              </p>
              <p>
                <span className="font-medium text-slate-700">ID:</span>{" "}
                {selected.id}
              </p>
              <p>
                <span className="font-medium text-slate-700">Activo:</span>{" "}
                {selected.is_active ? "Sí" : "No"}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-200">
              <EditButton to={`/books/update/${selected.id}`} />
              <DeleteButton
                onClick={() => {
                  /* Falta implementacion */
                }}
              />
              <button
                type="button"
                onClick={closeModal}
                className="ml-auto px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default BooksManage;
