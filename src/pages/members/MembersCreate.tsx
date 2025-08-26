// Pagina para crear un nuevo miembro

import { useState } from "react";
import { libraryAPI } from "../../services/libraryAPI";
import GoBackButton from "../../components/GoBackButton";

type MemberCreate = {
  name: string;
  last_name: string;
  email: string;
  phone: string;
};

function MembersCreate() {
  const [memberCreate, setMemberCreate] = useState<MemberCreate>({
    name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMemberCreate((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (
      !memberCreate.name ||
      !memberCreate.last_name ||
      !memberCreate.email ||
      !memberCreate.phone
    ) {
      setErrorMsg("Completá nombre, apellido, email y teléfono.");
      return;
    }
    const email_ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberCreate.email); // Verifica que el email sea valido
    if (!email_ok) {
      setErrorMsg("Ingresá un email válido.");
      return;
    }

    try {
      setLoading(true);
      await libraryAPI("post", "/members", memberCreate);
      setSuccessMsg("Miembro creado correctamente.");
    } catch (err: any) {
      const api_error =
        err?.response?.data?.detail ||
        err?.message ||
        "Error al crear el miembro.";
      setErrorMsg(String(api_error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-center">Nuevo Miembro</h1>

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
            <label className="block text-sm text-slate-600 mb-1">Nombre</label>
            <input
              name="name"
              value={memberCreate.name}
              onChange={onChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Juan"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Apellido
            </label>
            <input
              name="last_name"
              value={memberCreate.last_name}
              onChange={onChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Pérez"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input
              // type="email" // Se verifica en el onSubmit
              name="email"
              value={memberCreate.email}
              onChange={onChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: juan@mail.com"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Teléfono
            </label>
            <input
              name="phone"
              value={memberCreate.phone}
              onChange={onChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: +54 9 11 1234-5678"
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

export default MembersCreate;
