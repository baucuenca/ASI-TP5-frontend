type ReadButtonProps = {
  onClick: () => void;
};

function ReadButton({ onClick }: ReadButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="opacity-0 group-hover:opacity-100 transition px-3 py-1.5 rounded-md bg-slate-700 text-white text-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
      aria-label="Ver"
    >
      Ver
    </button>
  );
}

export default ReadButton;
