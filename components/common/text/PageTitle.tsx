interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTitle({ children, className = "" }: PageTitleProps) {
  return (
    <h1 className={`text-xl px-4 py-2 text-white bg-blue-900 rounded-lg ${className}`}>
      {children}
    </h1>
  );
}
