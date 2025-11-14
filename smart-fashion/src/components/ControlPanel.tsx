"use client";

import {
  addonOptions,
  colorPalette,
  fabricOptions,
  fitOptions,
  hemOptions,
  lengthOptions,
  materialFinishes,
  necklineOptions,
  patternOptions,
  personalizationPlacements,
  sizeOptions,
  sleeveOptions,
  stitchingOptions,
} from "@/data/options";
import { ShirtConfiguration } from "@/lib/designer";
import clsx from "clsx";

interface ControlPanelProps {
  config: ShirtConfiguration;
  onChange: (config: ShirtConfiguration) => void;
}

export function ControlPanel({ config, onChange }: ControlPanelProps) {
  const handlePartialUpdate = <K extends keyof ShirtConfiguration>(
    key: K,
    value: ShirtConfiguration[K],
  ) => {
    onChange({ ...config, [key]: value });
  };

  const updateAddon = (
    id: keyof ShirtConfiguration["addons"],
    update: Partial<ShirtConfiguration["addons"][string]>,
  ) => {
    const current = config.addons[id];
    onChange({
      ...config,
      addons: {
        ...config.addons,
        [id]: { ...current, ...update },
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/5">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Palette
            </h2>
            <p className="text-xs text-zinc-500">
              Base & accent tones drive the garment expression.
            </p>
          </div>
        </header>
        <div className="grid gap-4">
          <ColorSwatchRow
            label="Base Color"
            value={config.baseColor}
            onChange={(value) => handlePartialUpdate("baseColor", value)}
          />
          <ColorSwatchRow
            label="Accent Color"
            value={config.accentColor}
            onChange={(value) => handlePartialUpdate("accentColor", value)}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Architecture
            </h2>
            <p className="text-xs text-zinc-500">
              Fabric structure, silhouette, and engineered flow.
            </p>
          </div>
        </header>
        <div className="grid gap-4">
          <SelectField
            label="Fabric"
            value={config.fabric}
            options={fabricOptions}
            onChange={(value) => handlePartialUpdate("fabric", value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Fit"
              value={config.fit}
              options={fitOptions}
              onChange={(value) => handlePartialUpdate("fit", value)}
            />
            <SelectField
              label="Size"
              value={config.size}
              options={sizeOptions}
              onChange={(value) => handlePartialUpdate("size", value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Neckline"
              value={config.neckline}
              options={necklineOptions}
              onChange={(value) => handlePartialUpdate("neckline", value)}
            />
            <SelectField
              label="Sleeve"
              value={config.sleeve}
              options={sleeveOptions}
              onChange={(value) => handlePartialUpdate("sleeve", value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Length"
              value={config.length}
              options={lengthOptions}
              onChange={(value) => handlePartialUpdate("length", value)}
            />
            <SelectField
              label="Hem"
              value={config.hem}
              options={hemOptions}
              onChange={(value) => handlePartialUpdate("hem", value)}
            />
          </div>
          <SelectField
            label="Pattern Expression"
            value={config.pattern}
            options={patternOptions}
            onChange={(value) => handlePartialUpdate("pattern", value)}
          />
          <SelectField
            label="Material Finish"
            value={config.materialFinish}
            options={materialFinishes}
            onChange={(value) => handlePartialUpdate("materialFinish", value)}
          />
          <SelectField
            label="Stitch Story"
            value={config.stitch}
            options={stitchingOptions}
            onChange={(value) => handlePartialUpdate("stitch", value)}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900">
        <header className="mb-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Material Dynamics
          </h2>
        </header>
        <div className="grid gap-4">
          <SliderField
            label="Opacity"
            value={config.opacity}
            onChange={(value) => handlePartialUpdate("opacity", value)}
            unit="%"
          />
          <SliderField
            label="Stretch"
            value={config.stretch}
            onChange={(value) => handlePartialUpdate("stretch", value)}
            unit="%"
          />
          <SliderField
            label="Structure"
            value={config.structure}
            onChange={(value) => handlePartialUpdate("structure", value)}
            unit="%"
          />

          <div className="grid grid-cols-3 gap-2">
            {(["single", "double", "perforated"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handlePartialUpdate("layering", mode)}
                className={clsx(
                  "rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-widest",
                  config.layering === mode
                    ? "border-transparent bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                    : "border-zinc-200/60 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600",
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900">
        <header className="mb-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Add-on Systems
          </h2>
          <p className="text-xs text-zinc-500">
            Activate modular elements. Sliders tune intensity or density.
          </p>
        </header>
        <div className="grid gap-4">
          {addonOptions.map((addon) => {
            const state = config.addons[addon.id];
            return (
              <div
                key={addon.id}
                className={clsx(
                  "rounded-2xl border p-4 transition-colors",
                  state?.enabled
                    ? "border-zinc-900/60 bg-zinc-50 dark:border-zinc-100/30 dark:bg-zinc-800/60"
                    : "border-zinc-200/60 dark:border-zinc-800",
                )}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {addon.label}
                    </h3>
                    <p className="text-xs text-zinc-500">{addon.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateAddon(addon.id, { enabled: !state?.enabled })
                    }
                    className={clsx(
                      "rounded-full border px-4 py-1 text-[11px] font-semibold uppercase tracking-widest",
                      state?.enabled
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                        : "border-zinc-300 text-zinc-500 hover:border-zinc-400",
                    )}
                  >
                    {state?.enabled ? "Enabled" : "Arm"}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <SliderField
                    label="Intensity"
                    value={state?.intensity ?? 50}
                    onChange={(value) => updateAddon(addon.id, { intensity: value })}
                    unit="%"
                    disabled={!state?.enabled}
                  />
                  <SelectField
                    label="Placement"
                    value={state?.placement ?? "chest"}
                    options={[
                      { label: "Chest", value: "chest" },
                      { label: "Shoulder", value: "shoulder" },
                      { label: "Hem", value: "hem" },
                      { label: "Back", value: "back" },
                      { label: "Sleeve", value: "sleeve" },
                      { label: "Floating", value: "floating" },
                    ]}
                    onChange={(value) => updateAddon(addon.id, { placement: value as any })}
                    disabled={!state?.enabled}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-4">
          <TextField
            label="Personalization"
            placeholder="Add signature text"
            value={config.personalizationText}
            onChange={(value) =>
              handlePartialUpdate("personalizationText", value)
            }
          />
          <SelectField
            label="Placement"
            value={config.personalizationPlacement}
            options={personalizationPlacements}
            onChange={(value) =>
              handlePartialUpdate("personalizationPlacement", value)
            }
          />
          <TextAreaField
            label="Construction Notes"
            placeholder="Specify tailoring notes, seam shaping, mixing instructions..."
            value={config.notes}
            onChange={(value) => handlePartialUpdate("notes", value)}
          />
        </div>
      </section>
    </div>
  );
}

interface ColorSwatchRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorSwatchRow({ label, value, onChange }: ColorSwatchRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        <span>{label}</span>
        <span className="text-[10px] tracking-widest text-zinc-400">
          {value}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {colorPalette.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => {
              if (color.value === "custom") return;
              onChange(color.value);
            }}
            className={clsx(
              "relative h-10 w-10 rounded-full border transition-transform",
              value === color.value ? "scale-110 border-zinc-900" : "border-zinc-200",
              color.value === "custom" ? "bg-white text-[10px]" : "",
            )}
            style={
              color.value === "custom"
                ? undefined
                : ({ backgroundColor: color.value } as React.CSSProperties)
            }
          >
            {color.value === "custom" ? "Custom" : null}
            {value === color.value && color.value !== "custom" && (
              <span className="absolute inset-1 rounded-full border border-[2px] border-white shadow-inner shadow-black/20" />
            )}
          </button>
        ))}
        <label className="flex h-10 w-[120px] items-center justify-between rounded-full border border-dashed border-zinc-300 px-3 text-xs uppercase tracking-widest text-zinc-400">
          Hex
          <input
            type="text"
            defaultValue={value}
            onBlur={(event) => {
              const hex = event.target.value.trim();
              if (/^#[0-9a-fA-F]{3,6}$/.test(hex)) {
                onChange(hex);
              }
            }}
            className="w-16 bg-transparent text-right text-[11px] uppercase text-zinc-500 outline-none"
          />
        </label>
      </div>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

function SelectField({
  label,
  value,
  options,
  onChange,
  disabled,
}: SelectFieldProps) {
  return (
    <label className="block space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
      <span>{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-[12px] font-medium normal-case text-zinc-600 shadow-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  disabled?: boolean;
}

function SliderField({
  label,
  value,
  onChange,
  unit,
  disabled,
}: SliderFieldProps) {
  return (
    <label className="block space-y-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
      <span className="flex items-center justify-between">
        {label}
        <span className="text-[11px] text-zinc-400">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-zinc-900"
      />
    </label>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function TextField({ label, value, placeholder, onChange }: TextFieldProps) {
  return (
    <label className="block space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
      <span>{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-[12px] font-medium normal-case text-zinc-600 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
      />
    </label>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function TextAreaField({
  label,
  value,
  placeholder,
  onChange,
}: TextAreaFieldProps) {
  return (
    <label className="block space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
      <span>{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-[12px] font-medium normal-case text-zinc-600 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
      />
    </label>
  );
}
