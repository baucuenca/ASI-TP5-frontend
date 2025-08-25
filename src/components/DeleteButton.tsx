type DeleteButtonProps = {
  onClick?: () => void;
};

function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      aria-label="Eliminar"
    >
      Eliminar
    </button>
  );
}

export default DeleteButton;
