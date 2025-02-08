import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "flex items-center justify-center px-4 py-2 rounded-xl transition-colors font-medium";
  const variantStyles = {
    default: "bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50",
    outline: "border border-white/10 hover:bg-white/10 text-white",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
