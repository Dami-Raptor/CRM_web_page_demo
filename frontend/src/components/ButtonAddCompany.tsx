interface ButtonAddCompanyProps {
  onClick: () => void;
}

export default function ButtonAddCompany({ onClick }: ButtonAddCompanyProps) {
  return (
    <button 
      onClick={onClick} 
      className="py-2 px-6 bg-emerald-500/10 border border-emerald-500/50 hover:bg-emerald-500 hover:text-white text-emerald-500 font-semibold rounded-full transition-all duration-200"
    >
      + Empresa
    </button>
  );
}