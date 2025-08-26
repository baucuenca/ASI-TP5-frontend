// Pagina de administración de miembros

import MenuCard from "../../components/MenuCard";
import GoBackButton from "../../components/GoBackButton";

function Members() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-bold text-center mb-4">Miembros</h1>
        <h2 className="text-lg  mb-4 text-gray-400">
          Opciones de administración:
        </h2>

        {/* Menu */}
        <div className="space-y-4">
          <MenuCard to="/members/create" title="Nuevo Miembro" />
          <MenuCard to="/members/manage" title="Gestionar Miembros" />
          <GoBackButton />
        </div>
      </div>
    </main>
  );
}

export default Members;
