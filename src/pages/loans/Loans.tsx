// Pagina de administración de préstamos

import MenuCard from "../../components/MenuCard";
import GoBackButton from "../../components/GoBackButton";

function Loans() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-bold text-center mb-4">Préstamos</h1>
        <h2 className="text-lg  mb-4 text-gray-400">
          Opciones de administración:
        </h2>

        {/* Menu */}
        <div className="space-y-4">
          <MenuCard to="/loans/new" title="Nuevo Préstamo" />
          <MenuCard to="/loans/manage" title="Gestionar Préstamos" />
          <GoBackButton />
        </div>
      </div>
    </main>
  );
}

export default Loans;
