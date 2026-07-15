import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export default function ImageUpload({ onChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  function handleFile(file) {
    if (!file) return;
    onChange(file);
    setPreview(URL.createObjectURL(file));
  }

  function clear() {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-lg border border-base-600">
          <img src={preview} alt="Selected upload preview" className="h-48 w-full object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-base-600 bg-base-800/50 py-8 text-gray-500 transition hover:border-base-500 hover:text-gray-300"
        >
          <ImagePlus className="h-6 w-6" />
          <span className="text-sm">Tap to add a photo (optional)</span>
        </button>
      )}
    </div>
  );
}
