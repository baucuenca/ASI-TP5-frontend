// Página para actualizar un préstamo

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GoBackButton from "../../components/GoBackButton";
import { libraryAPI } from "../../services/libraryAPI";

type LoanEditableFields = {
  book_id?: number;
  member_id?: number;
  loan_date?: string; // ISO
  return_date?: string; // ISO
  returned?: boolean;
};

type LoanDetails = {
  id: number;
  book_title: string;
  member_email: string;
  loan_date: string;
  return_date: string;
  returned: boolean;
};

type Book = { id: number; title: string; author: string };
type Member = { id: number; name: string; last_name: string; email?: string };

function LoansUpdate() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [original, setOriginal] = useState<LoanDetails | null>(null);

  // Listas para posibles cambios de libro/miembro
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [listsError, setListsError] = useState<string | null>(null);

  // Form local (IDs y fechas editables)
  const [bookId, setBookId] = useState<number | "">("");
  const [memberId, setMemberId] = useState<number | "">("");
  const [loanDate, setLoanDate] = useState<string>(""); // YYYY-MM-DD
  const [returnDate, setReturnDate] = useState<string>(""); // YYYY-MM-DD
  const [returned, setReturned] = useState<boolean>(false);

  // Carga inicial
  useEffect(() => {
    const load = async () => {
      if (!id) {
        setErrorMsg("ID inexistente.");
        setLoading(false);
        return;
      }
      try {
        const [loan, booksData, membersData] = await Promise.all([
          libraryAPI<LoanDetails>("get", `/loans/${id}`),
          libraryAPI<Book[]>("get", "/books"),
          libraryAPI<Member[]>("get", "/members"),
        ]);

        setOriginal(loan);
        // Pre-cargar campos (si backend no da IDs para book/member no se puede cambiar)
        // Quedan vacíos hasta seleccionar si no se proveen IDs en la API.
        setLoanDate(loan.loan_date.slice(0, 10));
        setReturnDate(loan.return_date.slice(0, 10));
        setReturned(loan.returned);

        setBooks(booksData);
        setMembers(membersData);
      } catch (err: any) {
        setErrorMsg(
          err?.response?.data?.detail ||
            err?.message ||
            "Error al cargar el préstamo."
        );
      } finally {
        setLoading(false);
        setListsLoading(false);
      }
    };
    load();
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!id || !original) return;

    const payload: LoanEditableFields = {};

    // Solo agregamos campos cambiados
    if (bookId !== "" /* y diferente de actual si se conoce */) {
      payload.book_id = bookId as number;
    }
    if (memberId !== "" /* idem */) {
      payload.member_id = memberId as number;
    }
    if (loanDate && loanDate !== original.loan_date.slice(0, 10)) {
      payload.loan_date = new Date(loanDate).toISOString();
    }
    if (returnDate && returnDate !== original.return_date.slice(0, 10)) {
      payload.return_date = new Date(returnDate).toISOString();
    }
    if (returned !== original.returned) {
      payload.returned = returned;
    }

    if (Object.keys(payload).length === 0) {
      setErrorMsg("No hay cambios para guardar.");
      return;
    }

    try {
      setSaving(true);
      const updated = await libraryAPI<LoanDetails>(
        "patch",
        `/loans/${id}`,
        payload
      );
      setOriginal(updated);
      // Sincronizar campos (por si backend cambió algo)
      setLoanDate(updated.loan_date.slice(0, 10));
      setReturnDate(updated.return_date.slice(0, 10));
      setReturned(updated.returned);
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
      <div className="w-full max-w-lg space-y-4">
        <h1 className="text-3xl font-bold text-center">Editar Préstamo</h1>

        {loading ? (
          <div className="rounded-md border border-slate-200 bg-white p-4 text-slate-600 shadow-sm">
            Cargando...
          </div>
        ) : errorMsg ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
            {errorMsg}
          </div>
        ) : original ? (
          <>
            {listsError && (
              <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-yellow-700">
                {listsError}
              </div>
            )}
            {successMsg && (
              <div className="rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
                {successMsg}
              </div>
            )}

            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm space-y-1">
              <p className="text-sm text-slate-500">
                Libro actual:{" "}
                <span className="font-medium">{original.book_title}</span>
              </p>
              <p className="text-sm text-slate-500">
                Miembro actual:{" "}
                <span className="font-medium">{original.member_email}</span>
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm space-y-4"
            >
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Nuevo Libro (opcional)
                </label>
                <select
                  value={bookId}
                  onChange={(e) =>
                    setBookId(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  disabled={listsLoading}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                >
                  <option value="">(Sin cambio)</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} - {b.author}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Nuevo Miembro (opcional)
                </label>
                <select
                  value={memberId}
                  onChange={(e) =>
                    setMemberId(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  disabled={listsLoading}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                >
                  <option value="">(Sin cambio)</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    Fecha préstamo
                  </label>
                  <input
                    type="date"
                    value={loanDate}
                    onChange={(e) => setLoanDate(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    Fecha devolución
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="returned"
                  type="checkbox"
                  checked={returned}
                  onChange={(e) => setReturned(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="returned" className="text-sm text-slate-700">
                  Marcado como devuelto
                </label>
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
        ) : null}

        <GoBackButton />
      </div>
    </main>
  );
}

export default LoansUpdate;
