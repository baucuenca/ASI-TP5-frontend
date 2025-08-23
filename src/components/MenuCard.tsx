// Componente de Menu, cada MenuCard es una opcion

import { Link } from "react-router-dom";

type MenuCardProps = {
  to: string;
  title: string;
};

function MenuCard({ to, title }: MenuCardProps) {
  return (
    <Link
      to={to}
      className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
    </Link>
  );
}

export default MenuCard;
