// Pagina para editar o actualizar un miembro

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GoBackButton from "../../components/GoBackButton";
import { libraryAPI } from "../../services/libraryAPI";

type MemberUpdate = {
  name: string;
  last_name: string;
  email: string;
  phone: string;
};

type Member = MemberUpdate & {
  id: number;
  is_active?: boolean;
};

function MembersUpdate() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [original, setOriginal] = useState<MemberUpdate | null>(null);
  const [form, setForm] = useState<MemberUpdate>({
    name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setErrorMsg("ID inexistente.");
        setLoading(false);
        return;
      }
      try {
        const data = await libraryAPI<Member>("get", `/members/${id}`);
        const current: MemberUpdate = {
          name: data.name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
        };
        setOriginal(current);
        setForm(current);
      } catch (err: any) {
        setErrorMsg(
          err?.response?.data?.detail ||
            err?.message ||
            "Error al cargar el miembro."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!id || !original) return;

    const payload: Partial<MemberUpdate> = {};
    if (form.name !== original.name) payload.name = form.name;
    if (form.last_name !== original.last_name)
      payload.last_name = form.last_name;
    if (form.email !== original.email) payload.email = form.email;
    if (form.phone !== original.phone) payload.phone = form.phone;

    if (Object.keys(payload).length === 0) {
      setErrorMsg("No hay cambios para guardar.");
      return;
    }

    try {
      setSaving(true);
      const updated = await libraryAPI<Member>(
        "patch",
        `/members/${id}`,
        payload
      );
      if (updated) {
        const synced: MemberUpdate = {
          name: updated.name,
          last_name: updated.last_name,
          email: updated.email,
          phone: updated.phone,
        };
        setOriginal(synced);
        setForm(synced);
      } else {
        setOriginal((prev) =>
          prev ? ({ ...prev, ...payload } as MemberUpdate) : prev
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
        <h1 className="text-3xl font-bold text-center">Editar Miembro</h1>

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
                  Nombre
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nombre"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Apellido
                </label>
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={onChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Apellido"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Teléfono
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Teléfono"
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

export default MembersUpdate;
