interface ButtonAddSellerProps {
  onClick: () => void;
}

export default function ButtonAddSeller({ onClick }: ButtonAddSellerProps) {
  return (
    <button 
      onClick={onClick} 
      className="py-2 px-6 bg-blue-500/10 border border-blue-500/50 hover:bg-blue-500 hover:text-white text-blue-500 font-semibold rounded-full transition-all duration-200"
    >
      + Vendedor
    </button>
  );
}