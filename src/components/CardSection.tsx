export default function CardSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-gray-800 p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {children}
    </div>
  );
}
