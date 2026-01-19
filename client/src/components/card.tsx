export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border rounded-md w-sm px-6 py-12 bg-background/10 backdrop-blur-xl shadow-xl ${className}`}>{children}</div>
  );
}
