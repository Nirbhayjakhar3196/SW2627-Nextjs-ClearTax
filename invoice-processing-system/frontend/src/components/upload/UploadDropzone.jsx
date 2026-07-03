"use client";

import { useRef, useState } from "react";
import { FileUp, FolderUp, Sparkles } from "lucide-react";

const acceptedFormats = ["CSV", "XLSX", "ZIP Batch"];

export default function UploadDropzone() {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState("");

  const handlePick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file ? file.name : "");
  };

  return (
    <section className="rounded-[28px] border border-[rgba(86,67,43,0.14)] bg-white/80 p-6 shadow-[0_18px_40px_rgba(58,40,23,0.08)]">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(199,99,47,0.12)] text-[#9e4b22]">
          <FileUp className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9e4b22]">
            File Intake
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
            Upload invoice batches
          </h2>
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border-2 border-dashed border-[rgba(86,67,43,0.18)] bg-[linear-gradient(180deg,rgba(255,250,243,0.82),rgba(247,238,226,0.58))] p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(199,99,47,0.12)] text-[#9e4b22]">
          <FolderUp className="h-7 w-7" />
        </div>

        <h3 className="mt-5 text-2xl font-semibold text-stone-950">
          Drag files here or choose from your device
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-600">
          We&apos;ll parse the sheet, detect invoice fields, and flag rows that
          need manual review before starting processing.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {acceptedFormats.map((format) => (
            <span
              key={format}
              className="rounded-full border border-[rgba(86,67,43,0.14)] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-stone-600"
            >
              {format}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePick}
            className="rounded-full bg-[#c7632f] px-5 py-3 text-sm font-semibold text-[#fff7f0] transition hover:translate-y-[-1px]"
          >
            Select File
          </button>
          <button
            type="button"
            className="rounded-full border border-[rgba(86,67,43,0.14)] bg-white/60 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:translate-y-[-1px]"
          >
            Use Sample Template
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.zip"
          className="hidden"
          onChange={handleChange}
        />

        <p className="mt-5 text-sm text-stone-500">
          {selectedFile || "No file selected yet."}
        </p>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[rgba(86,67,43,0.12)] bg-[rgba(255,250,243,0.72)] p-4">
        <Sparkles className="mt-0.5 h-5 w-5 text-[#9e4b22]" />
        <p className="text-sm leading-7 text-stone-600">
          Smart column matching is enabled. If headers differ from the expected
          format, we&apos;ll suggest a mapping before import continues.
        </p>
      </div>
    </section>
  );
}
