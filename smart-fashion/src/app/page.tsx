"use client";

import { useMemo, useState } from "react";
import { AiPresetPanel } from "@/components/AiPresetPanel";
import { ControlPanel } from "@/components/ControlPanel";
import { PreviewCanvas } from "@/components/PreviewCanvas";
import { defaultConfiguration, ShirtConfiguration } from "@/lib/designer";

const analyticsDescriptors = [
  { key: "opacity", label: "Opacity", suffix: "%" },
  { key: "stretch", label: "Stretch", suffix: "%" },
  { key: "structure", label: "Structure", suffix: "%" },
] as const satisfies ReadonlyArray<{
  key: "opacity" | "stretch" | "structure";
  label: string;
  suffix?: string;
}>;

export default function Home() {
  const [configuration, setConfiguration] = useState<ShirtConfiguration>(
    defaultConfiguration,
  );

  const activeAddons = useMemo(
    () =>
      Object.values(configuration.addons).filter((addon) => addon.enabled)
        .length,
    [configuration.addons],
  );

  const structuralSummary = useMemo(
    () =>
      analyticsDescriptors.map(({ key, label, suffix }) => ({
        label,
        value: configuration[key],
        suffix: suffix ?? "",
      })),
    [configuration],
  );

  const applyConfiguration = (incoming: ShirtConfiguration) => {
    setConfiguration(incoming);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-zinc-200 pb-16 pt-12 text-zinc-900 dark:from-black dark:via-zinc-950 dark:to-black">
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 md:px-10">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-zinc-500">
                Parametric Fashion Lab
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-4xl">
                Build couture-level tees with modular controls & guided AI
                direction.
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-emerald-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
                Live Fabric Simulation
              </div>
              <div className="rounded-full bg-zinc-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white dark:bg-zinc-50 dark:text-zinc-950">
                Tee Focused
              </div>
            </div>
          </div>
          <p className="max-w-3xl text-sm text-zinc-500 md:text-base">
            Tweak silhouette architecture, material finish, and modular add-ons
            with tactile sliders. Or let the AI curator spin up directional
            presets tuned for specific vibes, ready for your refinements.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)_minmax(0,340px)] xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)_minmax(0,360px)]">
          <ControlPanel config={configuration} onChange={setConfiguration} />

          <div className="flex flex-col gap-5">
            <div className="rounded-[32px] border border-zinc-200/80 bg-white/70 p-6 shadow-lg shadow-zinc-900/10 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.45em] text-zinc-400">
                    3D Fit Preview
                  </p>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {configuration.title}
                  </h2>
                </div>
                <div className="text-right text-xs uppercase tracking-[0.35em] text-zinc-400">
                  <p>{configuration.fabric}</p>
                  <p>Layering: {configuration.layering}</p>
                </div>
              </div>
              <div className="mt-5 rounded-[24px] bg-zinc-100/70 p-6 shadow-inner dark:bg-zinc-950/50">
                <PreviewCanvas config={configuration} />
              </div>
            </div>

            <div className="grid gap-4 rounded-[28px] border border-zinc-200/80 bg-white/70 p-6 shadow-lg shadow-zinc-900/5 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
                  Build Metrics
                </span>
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {activeAddons} Active Add-ons
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {structuralSummary.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-3 text-sm shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/80"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                      {item.value}
                      {item.suffix}
                    </p>
                  </div>
                ))}
              </div>

              {configuration.notes && (
                <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/80 p-4 text-sm text-zinc-500 shadow-inner dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
                    Construction Notes
                  </p>
                  <p className="mt-2 leading-relaxed">{configuration.notes}</p>
                </div>
              )}
            </div>
          </div>

          <AiPresetPanel config={configuration} onApply={applyConfiguration} />
        </section>
      </main>
    </div>
  );
}
