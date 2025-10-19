interface StatusTextProps {
  isActive: boolean;
  className?: string;
}

export default function StatusText({ isActive, className = "" }: StatusTextProps) {
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        isActive
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      } ${className}`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
