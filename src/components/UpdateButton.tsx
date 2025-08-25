import { Link } from "react-router-dom";

type UpdateButtonProps = {
  to: string;
};

function UpdateButton({ to }: UpdateButtonProps) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Editar"
    >
      Editar
    </Link>
  );
}

export default UpdateButton;
