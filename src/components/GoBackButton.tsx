// Boton de volver hacia la pagina anterior para el menu

import { useNavigate } from "react-router-dom";

function GoBackButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)} /* Volver a la página anterior */
      className="block w-full text-left rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label="Volver"
    >
      <h2 className="text-lg font-semibold text-blue-600">Volver</h2>
    </button>
  );
}

export default GoBackButton;
