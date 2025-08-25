// Página para actualizar un libro

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GoBackButton from "../../components/GoBackButton";
import { libraryAPI } from "../../services/libraryAPI";

type BookUpdate = {
  title: string;
  author: string;
  published_year: number;
  isbn: string;
  stock: number;
};

type Book = BookUpdate & {
  id: number;
  is_active: boolean;
};

function BooksUpdate() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true); // carga inicial
  const [saving, setSaving] = useState(false); // guardado PATCH
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [book, setBook] = useState<BookUpdate | null>(null);
  const [bookUpdate, setBookUpdate] = useState<BookUpdate>({
    title: "",
    author: "",
    published_year: new Date().getFullYear(),
    isbn: "",
    stock: 1,
  });

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setErrorMsg("ID inexistente.");
        setLoading(false);
        return;
      }
      try {
        const data = await libraryAPI<Book>("get", `/books/${id}`);
        const current: BookUpdate = {
          title: data.title,
          author: data.author,
          published_year: data.published_year,
          isbn: data.isbn,
          stock: data.stock,
        };
        setBook(current);
        setBookUpdate(current);
      } catch (err: any) {
        setErrorMsg(
          err?.response?.data?.detail ||
            err?.message ||
            "Error al cargar el libro."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "published_year" || name === "stock") {
      setBookUpdate((prev) => ({
        ...prev,
        [name]: value === "" ? ("" as any) : Number(value),
      }));
    } else {
      setBookUpdate((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!id || !book) return;

    // Construir el JSON solo con campos modificados
    const update_json: Partial<BookUpdate> = {};
    if (bookUpdate.title !== book.title) update_json.title = bookUpdate.title;
    if (bookUpdate.author !== book.author)
      update_json.author = bookUpdate.author;
    if (bookUpdate.published_year !== book.published_year)
      update_json.published_year = bookUpdate.published_year;
    if (bookUpdate.isbn !== book.isbn) update_json.isbn = bookUpdate.isbn;
    if (bookUpdate.stock !== book.stock) update_json.stock = bookUpdate.stock;

    if (Object.keys(update_json).length === 0) {
      setErrorMsg("No hay cambios para guardar.");
      return;
    }

    try {
      setSaving(true);
      const updated = await libraryAPI<Book>(
        "patch",
        `/books/${id}`,
        update_json
      );
      // Si la API devuelve el libro actualizado, sincronizar estados
      if (updated) {
        const synced: BookUpdate = {
          title: updated.title,
          author: updated.author,
          published_year: updated.published_year,
          isbn: updated.isbn,
          stock: updated.stock,
        };
        setBook(synced);
        setBookUpdate(synced);
      } else {
        // Si no devuelve, al menos actualizar lo original con lo enviado
        setBook((prev) =>
          prev ? ({ ...prev, ...update_json } as BookUpdate) : prev
        );
      }
      setSuccessMsg("Cambios guardados correctamente.");
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.detail ||
          err?.message ||
          "Error al guardar los cambios."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-center">Editar Libro</h1>

        {loading ? (
          <div className="rounded-md border border-slate-200 bg-white p-4 text-slate-600 shadow-sm">
            Cargando...
          </div>
        ) : errorMsg ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
            {errorMsg}
          </div>
        ) : (
          <>
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
                <label className="block text-sm text-slate-600 mb-1">
                  Título
                </label>
                <input
                  name="title"
                  value={bookUpdate.title}
                  onChange={onChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Título"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Autor
                </label>
                <input
                  name="author"
                  value={bookUpdate.author}
                  onChange={onChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Autor"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Año de publicación
                </label>
                <input
                  type="number"
                  name="published_year"
                  value={bookUpdate.published_year}
                  onChange={onChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: 1943"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  ISBN
                </label>
                <input
                  name="isbn"
                  value={bookUpdate.isbn}
                  onChange={onChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ISBN"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={bookUpdate.stock}
                  onChange={onChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: 10"
                  min={0}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </>
        )}

        <GoBackButton />
      </div>
    </main>
  );
}

export default BooksUpdate;
