// src/app/loading.tsx
import LoadingSpinner from "@/components/LoadingSpinner";

const GlobalLoading: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] text-white flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
};

export default GlobalLoading;
