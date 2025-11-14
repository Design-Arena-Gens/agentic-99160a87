"use client";

import { useMemo, useState } from "react";
import { addonOptions } from "@/data/options";
import { ShirtConfiguration } from "@/lib/designer";
import {
  GeneratedPreset,
  generatePreset,
  pickRandomVibe,
} from "@/lib/generatePreset";
import clsx from "clsx";

interface AiPresetPanelProps {
  config: ShirtConfiguration;
  onApply: (settings: ShirtConfiguration) => void;
}

const vibeLabels: Record<string, string> = {
  streetLuxe: "Street Luxe",
  performance: "Performance Motion",
  avantGarde: "Avant Garde",
  minimalStudio: "Minimal Studio",
  ecoEase: "Eco Ease",
};

export function AiPresetPanel({ config, onApply }: AiPresetPanelProps) {
  const [pending, setPending] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState<string>("streetLuxe");
  const [suggestion, setSuggestion] = useState<GeneratedPreset | null>(null);
  const [history, setHistory] = useState<GeneratedPreset[]>([]);

  const handleGenerate = () => {
    setPending(true);
    const preset = generatePreset(config, selectedVibe as any);
    setSuggestion(preset);
    setHistory((prev) => [preset, ...prev].slice(0, 3));
    // Simulate AI streaming delay
    setTimeout(() => setPending(false), 250);
  };

  const applySuggestion = (preset: GeneratedPreset) => {
    onApply({
      ...config,
      ...preset.configuration,
    });
  };

  const vibeButtons = useMemo(
    () =>
      Object.entries(vibeLabels).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => setSelectedVibe(value)}
          className={clsx(
            "rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] transition-colors",
            selectedVibe === value
              ? "border-transparent bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "border-zinc-200/60 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400",
          )}
        >
          {label}
        </button>
      )),
    [selectedVibe],
  );

  return (
    <section className="flex h-full flex-col gap-5 rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-lg shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-950/60">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.45em] text-emerald-500">
          AI Pattern Curator
        </p>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Generate couture-ready baselines
        </h2>
        <p className="text-sm text-zinc-500">
          Semantic blends evaluate fit architecture, fabric selections, and
          modular feature density to craft direction sets. Tap to apply,
          iterate, or remix.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">{vibeButtons}</div>

      <button
        type="button"
        disabled={pending}
        onClick={handleGenerate}
        className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/70"
      >
        {pending ? "Synthesizing..." : "Generate Design Pulse"}
      </button>

      {suggestion ? (
        <article className="relative overflow-hidden rounded-[24px] border border-emerald-500/50 bg-emerald-500/5 p-5">
          <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-500">
              Latest Synth
            </span>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {suggestion.configuration.title}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {suggestion.narrative}
            </p>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
              {Object.entries(suggestion.configuration.addons ?? {})
                .filter(([, addon]) => addon.enabled)
                .map(([id, addon]) => {
                  const label =
                    addonOptions.find((option) => option.id === id)?.label ?? id;
                  return (
                    <span
                      key={id}
                      className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600 dark:text-emerald-400"
                    >
                      {label}
                    </span>
                  );
                })}
            </div>
            <div className="rounded-2xl bg-white/60 p-3 text-xs text-zinc-500 shadow-sm dark:bg-zinc-900/60">
              <p>{suggestion.promptSuggestion}</p>
            </div>
            <button
              type="button"
              onClick={() => applySuggestion(suggestion)}
              className="inline-flex items-center justify-center rounded-full border border-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600 transition hover:bg-emerald-500 hover:text-white"
            >
              Apply & Remix
            </button>
          </div>
        </article>
      ) : (
        <div className="rounded-3xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-400">
          Run the curator to stage an AI-crafted garment baseline you can tweak.
        </div>
      )}

      {history.length > 1 && (
        <div className="grid gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Previous Blends
          </p>
          <div className="grid gap-3">
            {history.slice(1).map((preset, index) => (
              <button
                key={`${preset.configuration.title}-${index}`}
                type="button"
                onClick={() => applySuggestion(preset)}
                className="flex flex-col gap-1 rounded-2xl border border-zinc-200/70 px-4 py-3 text-left transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {preset.configuration.title}
                </span>
                <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                  {preset.narrative.slice(0, 64)}…
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
