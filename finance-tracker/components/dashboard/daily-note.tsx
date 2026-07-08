"use client";

import { useEffect, useState } from "react";

type DailyNoteProps = {
  initialNote?: string;
};

const STORAGE_KEY = "finance-tracker-daily-note";

export function DailyNote({ initialNote = "" }: DailyNoteProps) {
  const [note, setNote] = useState(initialNote);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedNote = window.localStorage.getItem(STORAGE_KEY);
    if (storedNote !== null) {
      setNote(storedNote);
    } else {
      setNote(initialNote);
    }
  }, [initialNote]);

  function handleSave() {
    window.localStorage.setItem(STORAGE_KEY, note);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  function handleClear() {
    setNote("");
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
  }

  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[#fff7f8] p-4">
      <h2 className="text-base font-semibold text-[#342c28]">Quick Reminders</h2>
      <p className="mt-1.5 text-[11px] leading-4 text-[#6f625d]">
        Add a quick reminder, goal, or short note for today.
      </p>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Write a short note..."
        className="mt-3 min-h-[92px] w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[#342c28] outline-none transition focus:border-[#e9aebd]"
      />

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-2xl bg-[#f4c7cf] px-3 py-2 text-xs font-medium text-white transition hover:cursor-pointer hover:bg-[#efb8c3]"
        >
          Save note
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-medium text-[#6f625d] transition hover:cursor-pointer hover:bg-[#fffdfd]"
        >
          Clear
        </button>
        <span className="text-[11px] text-[#8a7a74]">{saved ? "Saved" : " "}</span>
      </div>
    </div>
  );
}
