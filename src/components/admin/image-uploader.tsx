"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { uploadImagesAction } from "@/lib/admin/actions";
import { inputClass, labelClass } from "@/components/admin/ui";

type Selected = { file: File; url: string };

function UploadButton({ count }: { count: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || count === 0}
      className="rounded-md bg-arcilla-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-arcilla-600 disabled:opacity-50"
    >
      {pending
        ? "Subiendo…"
        : count > 0
          ? `Subir y publicar ${count} en Supabase`
          : "Subir y publicar en Supabase"}
    </button>
  );
}

/**
 * Drag/drop or file-picker upload zone. Selected files preview locally (object
 * URLs) before they are sent — as multipart FormData — to the uploadImagesAction
 * server action, which validates, stores them in Supabase Storage with the
 * service role, and inserts the rows. The hidden file input is the submission
 * source of truth; drops are mirrored onto it so the native form submit carries
 * the files. The editor's unsaved-changes guard sees the change/submit events.
 */
export function ImageUploader({
  roomId,
  slug,
  categories,
}: {
  roomId: string;
  slug: string;
  categories: string[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Selected[]>([]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => () => selected.forEach((s) => URL.revokeObjectURL(s.url)), [selected]);

  const setFromFiles = (list: FileList | null) => {
    const files = Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));
    setSelected(files.map((file) => ({ file, url: URL.createObjectURL(file) })));
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (inputRef.current && event.dataTransfer.files.length > 0) {
      inputRef.current.files = event.dataTransfer.files;
      setFromFiles(event.dataTransfer.files);
    }
  };

  return (
    <form
      action={uploadImagesAction}
      className="mb-5 space-y-3 rounded-lg border border-sillar-200 bg-sillar-50/40 p-4"
    >
      <input type="hidden" name="room_id" value={roomId} />
      <input type="hidden" name="slug" value={slug} />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragging ? "border-arcilla-400 bg-arcilla-50" : "border-sillar-300 bg-white"
        }`}
      >
        <p className="text-sm font-medium text-tinta-700">Arrastra imágenes aquí</p>
        <p className="text-xs text-tinta-500">JPG, PNG, WEBP o AVIF · hasta 10 MB cada una</p>
        <label className="mt-1 cursor-pointer rounded-md border border-sillar-300 bg-white px-3 py-1.5 text-xs font-semibold text-tinta-700 transition-colors hover:border-arcilla-400 hover:text-arcilla-600">
          Elegir archivos
          <input
            ref={inputRef}
            type="file"
            name="files"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={(event) => setFromFiles(event.target.files)}
          />
        </label>
      </div>

      {selected.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-tinta-500">{selected.length} imagen(es) seleccionada(s):</p>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {selected.map((s, i) => (
              <li key={i} className="overflow-hidden rounded border border-sillar-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.url} alt={s.file.name} className="aspect-square w-full object-cover" />
                <p className="truncate px-1 py-0.5 text-[10px] text-tinta-500" title={s.file.name}>
                  {s.file.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className={labelClass}>Categoría</label>
          <select name="default_category" defaultValue="Habitación" className={inputClass}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-48 flex-1">
          <label className={labelClass}>Texto alternativo (opcional)</label>
          <input name="default_alt" placeholder="Describe las fotos" className={inputClass} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <UploadButton count={selected.length} />
        <p className="text-xs text-tinta-500">
          Se suben a Supabase Storage y aparecen en la galería. La portada y el orden se ajustan
          después.
        </p>
      </div>
    </form>
  );
}
