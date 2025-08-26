// Pagina para gestionar los miembros

import { useEffect, useMemo, useState } from "react";
import { libraryAPI } from "../../services/libraryAPI";
import GoBackButton from "../../components/GoBackButton";
import UpdateButton from "../../components/UpdateButton";
import DeleteButton from "../../components/DeleteButton";
import ReadButton from "../../components/ReadButton";

type Member = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  is_active?: boolean;
};

function MembersManage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modal "Ver"
  const [selected, setSelected] = useState<Member | null>(null);
  const closeReadModal = () => setSelected(null);

  // Modal de confirmación de eliminación
  const [confirm, setConfirm] = useState<Member | null>(null);
  const [delLoading, setDelLoading] = useState(false);
  const [delError, setDelError] = useState<string | null>(null);

  // Reabrir "Ver" si se cancela la eliminación
  const cancel_delete_and_reopen_read_modal = () => {
    if (delLoading) return;
    if (confirm) setSelected(confirm);
    setConfirm(null);
    setDelError(null);
  };

  // Limpiar error cuando cambia el miembro a confirmar
  useEffect(() => {
    if (confirm) setDelError(null);
  }, [confirm]);

  // Cargar miembros
  useEffect(() => {
    const load = async () => {
      try {
        const data = await libraryAPI<Member[]>("get", "/members");
        setMembers(data);
      } catch (err: any) {
        setErrorMsg(
          err?.response?.data?.detail ||
            err?.message ||
            "Error al obtener miembros."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filtro por nombre y apellido
  const filtered = useMemo(() => {
    const normalize = (s: string) =>
      s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const q = normalize(search.trim());
    if (!q) return members;

    return members.filter((m) => {
      const full = normalize(`${m.name} ${m.last_name}`);
      return full.includes(q);
    });
  }, [members, search]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-3xl font-bold text-center">Gestionar Miembros</h1>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre y apellido..."
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
          <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            <div className="max-h-90 overflow-y-auto pr-1">
              <ul className="space-y-3">
                {filtered.length === 0 ? (
                  <li className="rounded-md border border-slate-200 bg-white p-4 text-slate-600 shadow-sm">
                    No hay resultados.
                  </li>
                ) : (
                  filtered.map((m) => (
                    <li
                      key={m.id}
                      className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div>
                        <p className="text-slate-900 font-medium">
                          {m.name} {m.last_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {m.email} |{" "}
                          {m.phone ? (
                            m.phone
                          ) : (
                            <span className="italic">
                              Sin número de teléfono
                            </span>
                          )}
                        </p>
                      </div>

                      <ReadButton onClick={() => setSelected(m)} />
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}

        <GoBackButton />
      </div>

      {/* Modal "Ver" */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeReadModal}
          />
          <div className="relative z-10 w-full max-w-lg mx-4 rounded-lg bg-white shadow-lg border border-slate-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Detalle del Miembro
              </h2>
              <button
                type="button"
                onClick={closeReadModal}
                className="text-2xl font-bold text-slate-500 hover:text-slate-700"
                aria-label="Cerrar"
                title="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-4 space-y-2">
              <p>
                <span className="font-medium text-slate-700">Nombre:</span>{" "}
                {selected.name}
              </p>
              <p>
                <span className="font-medium text-slate-700">Apellido:</span>{" "}
                {selected.last_name}
              </p>
              <p>
                <span className="font-medium text-slate-700">Email:</span>{" "}
                {selected.email}
              </p>
              <p>
                <span className="font-medium text-slate-700">Teléfono:</span>{" "}
                {selected.phone}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-200">
              <UpdateButton to={`/members/update/${selected.id}`} />
              <DeleteButton
                onClick={() => {
                  setDelError(null);
                  setConfirm(selected);
                  setSelected(null);
                }}
              />
              <button
                type="button"
                onClick={closeReadModal}
                className="ml-auto px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmación eliminación */}
      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              if (delLoading) return;
              cancel_delete_and_reopen_read_modal();
            }}
          />
          <div className="relative z-10 w-full max-w-lg mx-4 rounded-lg bg-white shadow-lg border border-slate-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Confirmar eliminación
              </h2>
              <button
                type="button"
                onClick={cancel_delete_and_reopen_read_modal}
                disabled={delLoading}
                className="text-2xl font-bold text-slate-500 hover:text-slate-700 disabled:opacity-50"
                aria-label="Cerrar"
                title="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              <p className="text-slate-800">
                ¿Desea eliminar al miembro{" "}
                <span className="font-semibold text-red-600">
                  {confirm.name} {confirm.last_name}
                </span>
                ?
              </p>
              {delError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
                  {delError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-200">
              <button
                type="button"
                onClick={cancel_delete_and_reopen_read_modal}
                disabled={delLoading}
                className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={delLoading}
                onClick={async () => {
                  if (!confirm) return;
                  setDelError(null);
                  setDelLoading(true);
                  try {
                    await libraryAPI("delete", `/members/${confirm.id}`);
                    setMembers((prev) =>
                      prev.filter((m) => m.id !== confirm.id)
                    );
                    setConfirm(null);
                  } catch (err: any) {
                    setDelError(
                      err?.response?.data?.detail ||
                        err?.message ||
                        "Error al eliminar el miembro."
                    );
                  } finally {
                    setDelLoading(false);
                  }
                }}
                className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-60"
              >
                {delLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default MembersManage;
