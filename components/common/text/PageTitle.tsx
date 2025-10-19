interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTitle({ children, className = "" }: PageTitleProps) {
  return (
    <h1 className={`flex-1 text-sm font-bold px-4 py-2 text-white bg-sky-950 rounded-md ${className}`}>
      {children}
    </h1>
  );
}
