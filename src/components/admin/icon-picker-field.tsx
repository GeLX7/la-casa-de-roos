"use client";

import { useState } from "react";
import { AmenityIcon } from "@/components/icons";
import { inputClass, labelClass } from "@/components/admin/ui";

/**
 * Icon-key `<select>` with a live preview of the chosen amenity icon. Unknown
 * keys render a fallback icon (AmenityIcon already falls back to a check mark)
 * and are flagged visually + kept selectable so existing data is never lost.
 */
export function IconPickerField({
  name,
  defaultValue,
  options,
}: {
  name: string;
  defaultValue: string;
  options: readonly string[];
}) {
  const [icon, setIcon] = useState(defaultValue || "check");
  const known = options.includes(icon);

  return (
    <div className="flex items-end gap-2">
      <span
        title={
          known
            ? `Icono: ${icon}`
            : `Clave "${icon}" desconocida — se mostrará un icono por defecto`
        }
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${
          known
            ? "border-sillar-300 bg-sillar-50 text-arcilla-500"
            : "border-arcilla-400 bg-arcilla-50 text-arcilla-600"
        }`}
      >
        <AmenityIcon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <label className={labelClass}>Icono</label>
        <select
          name={name}
          value={icon}
          onChange={(event) => setIcon(event.target.value)}
          className={inputClass}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          {!known && <option value={icon}>{icon} (desconocido)</option>}
        </select>
      </div>
    </div>
  );
}
