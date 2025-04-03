import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt } from "react-icons/fa";

export default function PageLink({
  href,
  name,
  Icon = FaTachometerAlt,
}: {
  href: string;
  name: string;
  Icon?: React.ElementType;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 ${
        pathname === href ? "text-teal-300" : "text-gray-300"
      } hover:text-teal-400 transition-colors duration-200`}
    >
      {Icon && <Icon />} {name}
    </Link>
  );
}
