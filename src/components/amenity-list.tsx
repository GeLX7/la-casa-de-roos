import { AmenityIcon } from "@/components/icons";

export function AmenityList({
  items,
}: {
  items: { icon: string; label: string }[];
}) {
  return (
    <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map((a) => (
        <li key={a.label} className="flex items-start gap-3 text-sm text-tinta-700">
          <AmenityIcon name={a.icon} className="mt-0.5 h-5 w-5 shrink-0 text-arcilla-500" />
          {a.label}
        </li>
      ))}
    </ul>
  );
}
