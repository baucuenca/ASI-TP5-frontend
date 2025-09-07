// Pagina para crear un nuevo préstamo

import { useEffect, useState } from "react";
import { libraryAPI } from "../../services/libraryAPI";
import GoBackButton from "../../components/GoBackButton";

type Book = {
  id: number;
  title: string;
  author: string;
  is_active?: boolean;
};

type Member = {
  id: number;
  name: string;
  last_name: string;
  is_active?: boolean;
};

type LoanCreate = {
  book_id: number | "";
  member_id: number | "";
  return_date: string; // fecha en formato YYYY-MM-DD (se convertirá a ISO)
};

function LoansCreate() {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [listsError, setListsError] = useState<string | null>(null);

  const [form, setForm] = useState<LoanCreate>({
    book_id: "",
    member_id: "",
    return_date: defaultReturnDate(), // Por defecto, en 2 semanas
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function defaultReturnDate() {
    // Devuelve la fecha de hoy + 14 días en formato YYYY-MM-DD
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  // Cargar listas de libros y miembros
  useEffect(() => {
    const load = async () => {
      try {
        const [booksData, membersData] = await Promise.all([
          libraryAPI<Book[]>("get", "/books"),
          libraryAPI<Member[]>("get", "/members"),
        ]);
        setBooks(booksData);
        setMembers(membersData);
      } catch (err: any) {
        setListsError(
          err?.response?.data?.detail ||
            err?.message ||
            "Error al cargar libros/miembros."
        );
      } finally {
        setLoadingLists(false);
      }
    };
    load();
  }, []);

  const onChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "book_id" || name === "member_id") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!form.book_id || !form.member_id) {
      setErrorMsg("Seleccioná un libro y un miembro.");
      return;
    }
    if (!form.return_date) {
      setErrorMsg("Seleccioná una fecha de devolución.");
      return;
    }

    // Construir return_date ISO
    const returnDateIso = new Date(form.return_date).toISOString();

    try {
      setSubmitting(true);
      await libraryAPI("post", "/loans", {
        book_id: form.book_id,
        member_id: form.member_id,
        return_date: returnDateIso,
      });
      setSuccessMsg("Préstamo creado correctamente.");
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.detail ||
          err?.message ||
          "Error al crear el préstamo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-center">Nuevo Préstamo</h1>

        {listsError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
            {listsError}
          </div>
        )}

        {errorMsg && !listsError && (
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
            <label className="block text-sm text-slate-600 mb-1">Libro</label>
            <select
              name="book_id"
              value={form.book_id}
              onChange={onChange}
              disabled={loadingLists || !!listsError}
              className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            >
              <option value="">Seleccioná un libro...</option>
              {books.map((b) => (
                <option
                  key={b.id}
                  value={b.id}
                  title={`${b.title} - ${b.author}`} // Si el texto no entra completo en el ancho del renglo, se pued ever mantniendo el cursor sobre el
                >
                  {b.title} - {b.author}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Miembro</label>
            <select
              name="member_id"
              value={form.member_id}
              onChange={onChange}
              disabled={loadingLists || !!listsError}
              className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            >
              <option value="">Seleccioná un miembro...</option>
              {members.map((m) => (
                <option
                  key={m.id}
                  value={m.id}
                  title={`${m.name} ${m.last_name}`}
                >
                  {m.name} {m.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Fecha de devolución
            </label>
            <input
              type="date"
              name="return_date"
              value={form.return_date}
              onChange={onChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min={new Date().toISOString().slice(0, 10)} // No permite que se elija una fecha anterior a hoy
            />
            {/* Se enviará como ISO: 2025-01-01T00:00:00.000Z */}
          </div>

          <button
            type="submit"
            disabled={submitting || loadingLists || !!listsError}
            className="w-full rounded-md bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {submitting ? "Guardando..." : "Crear Préstamo"}
          </button>
        </form>

        <GoBackButton />
      </div>
    </main>
  );
}

export default LoansCreate;
