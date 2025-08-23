// Pagina de inicio

import MenuCard from "../components/MenuCard";

function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-bold text-center mb-4">Biblioteca</h1>
        <h2 className="text-lg  mb-4 text-gray-400">Opciones de gestión:</h2>

        {/* Menu */}
        <div className="space-y-4">
          <MenuCard to="/loans" title="Préstamos" />
          <MenuCard to="/members" title="Miembros" />
          <MenuCard to="/books" title="Libros" />
        </div>
      </div>
    </main>
  );
}

export default Home;
