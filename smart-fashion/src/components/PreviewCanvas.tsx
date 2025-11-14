"use client";

import { useMemo } from "react";
import { ShirtConfiguration } from "@/lib/designer";

interface PreviewCanvasProps {
  config: ShirtConfiguration;
}

const sleeveLengths: Record<string, number> = {
  cap: 6,
  classicShort: 14,
  extendedDrop: 20,
  elbow: 26,
  detachable: 18,
};

const shirtHeights: Record<string, number> = {
  microCrop: 52,
  midCrop: 60,
  classic: 72,
  longline: 84,
  tunic: 96,
};

const hemRadius: Record<string, number> = {
  straight: 12,
  rounded: 28,
  split: 10,
  highLow: 18,
  raw: 4,
};

const necklineDepth: Record<string, number> = {
  crew: 18,
  sculptedV: 26,
  mock: 12,
  offShoulder: 38,
  asymmetric: 30,
};

const patternBackground: Record<string, string> = {
  solid: "none",
  gradient: "linear-gradient(160deg, rgba(255,255,255,0.25), rgba(0,0,0,0.35))",
  colorblock:
    "linear-gradient(90deg, rgba(0,0,0,0.35) 0 40%, rgba(255,255,255,0.15) 40% 100%)",
  microPattern:
    "radial-gradient(circle at 0 0, rgba(255,255,255,0.45) 1px, transparent 1px), radial-gradient(circle at 8px 8px, rgba(0,0,0,0.12) 1px, transparent 1px)",
  artPrint:
    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.65), transparent 40%), radial-gradient(circle at 70% 20%, rgba(0,0,0,0.45), transparent 35%), radial-gradient(circle at 50% 70%, rgba(0,0,0,0.25), transparent 45%)",
};

export function PreviewCanvas({ config }: PreviewCanvasProps) {
  const sleeveLength = sleeveLengths[config.sleeve] ?? 14;
  const shirtHeight = shirtHeights[config.length] ?? 72;
  const radius = hemRadius[config.hem] ?? 12;
  const depth = necklineDepth[config.neckline] ?? 18;

  const patternStyle = useMemo(() => {
    const pattern = patternBackground[config.pattern] ?? "none";
    if (config.pattern === "microPattern") {
      return {
        backgroundImage: `${pattern}`,
        backgroundSize: "16px 16px",
        mixBlendMode: "overlay" as const,
      };
    }
    if (config.pattern === "gradient" || config.pattern === "colorblock") {
      return { backgroundImage: pattern };
    }
    if (config.pattern === "artPrint") {
      return { backgroundImage: pattern, mixBlendMode: "hard-light" as const };
    }
    return {};
  }, [config.pattern]);

  const fabricOverlay = useMemo(() => {
    if (config.materialFinish === "gloss") {
      return "linear-gradient(120deg, rgba(255,255,255,0.6) 0%, transparent 45%, rgba(0,0,0,0.25) 100%)";
    }
    if (config.materialFinish === "sheen") {
      return "linear-gradient(90deg, rgba(255,255,255,0.28) 0%, transparent 65%)";
    }
    if (config.materialFinish === "brushed") {
      return "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 4px)";
    }
    if (config.materialFinish === "tech") {
      return "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35), transparent 40%), repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 8px)";
    }
    return "none";
  }, [config.materialFinish]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative flex h-[420px] w-[260px] flex-col items-center justify-start transition-transform duration-300">
        <div
          className="relative w-full"
          style={{
            height: `${shirtHeight}px`,
            backgroundColor: config.baseColor,
            borderRadius: `${Math.max(18 - depth / 4, 6)}px ${Math.max(
              18 - depth / 4,
              6,
            )}px ${radius}px ${radius}px`,
            border: `2px solid rgba(0,0,0,${config.structure / 150})`,
            boxShadow:
              config.structure > 65
                ? "0 22px 40px rgba(17,17,19,0.25)"
                : "0 12px 24px rgba(17,17,19,0.18)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: config.opacity / 100,
              ...patternStyle,
            }}
          />
          {fabricOverlay !== "none" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: fabricOverlay,
                opacity:
                  config.materialFinish === "gloss"
                    ? 0.55
                    : config.materialFinish === "sheen"
                      ? 0.4
                      : 0.25,
                pointerEvents: "none",
              }}
            />
          )}

          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-full"
            style={{
              width: config.neckline === "offShoulder" ? "82%" : "55%",
              height: `${depth}px`,
              backgroundColor:
                config.neckline === "mock"
                  ? config.baseColor
                  : "transparent",
              borderBottomLeftRadius:
                config.neckline === "sculptedV" ? "10px" : "48px",
              borderBottomRightRadius:
                config.neckline === "sculptedV" ? "10px" : "48px",
              borderBottom:
                config.neckline === "mock"
                  ? undefined
                  : `6px solid ${config.accentColor}`,
              transform:
                config.neckline === "asymmetric"
                  ? "translateX(-50%) rotate(-4deg)"
                  : "translateX(-50%)",
            }}
          />

          {config.layering !== "single" && (
            <div
              className="absolute inset-2 rounded-[18px]"
              style={{
                border: `1.5px dashed rgba(17,17,19,${
                  config.layering === "double" ? 0.28 : 0.18
                })`,
                opacity: config.layering === "perforated" ? 0.65 : 0.4,
                backgroundImage:
                  config.layering === "perforated"
                    ? "radial-gradient(circle, rgba(0,0,0,0.18) 1px, transparent 1px)"
                    : "none",
                backgroundSize:
                  config.layering === "perforated" ? "12px 12px" : "auto",
              }}
            />
          )}

          <div
            className="absolute inset-x-0 flex justify-between"
            style={{
              height: `${sleeveLength}px`,
              top: 46,
            }}
          >
            <div
              className="w-[62px]"
              style={{
                height: "100%",
                backgroundColor: config.baseColor,
                borderRadius: "18px",
                border: `2px solid rgba(0,0,0,${config.structure / 150})`,
                transform:
                  config.sleeve === "asymmetric"
                    ? "rotate(-4deg)"
                    : "rotate(-2deg)",
              }}
            />
            <div
              className="w-[62px]"
              style={{
                height: "100%",
                backgroundColor: config.baseColor,
                borderRadius: "18px",
                border: `2px solid rgba(0,0,0,${config.structure / 150})`,
                transform:
                  config.sleeve === "detachable"
                    ? "rotate(4deg)"
                    : "rotate(2deg)",
              }}
            />
          </div>

          <div
            className="absolute inset-x-0 bottom-10 h-[12px] rounded-full"
            style={{
              backgroundColor: config.accentColor,
              opacity: config.structure > 50 ? 0.65 : 0.38,
              mixBlendMode: "multiply",
            }}
          />

          {Object.values(config.addons)
            .filter((addon) => addon.enabled)
            .map((addon) => (
              <AddonGlyph key={addon.id} addon={addon} accent={config.accentColor} />
            ))}
        </div>
        <div className="mt-6 flex w-full items-center justify-between text-xs uppercase tracking-wide text-zinc-400">
          <div>{config.fabric.replace(/([A-Z])/g, " $1")}</div>
          <div>{config.fit}</div>
        </div>
      </div>
    </div>
  );
}

interface AddonGlyphProps {
  addon: ShirtConfiguration["addons"][string];
  accent: string;
}

function AddonGlyph({ addon, accent }: AddonGlyphProps) {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    color: accent,
  };

  const placementStyles: Record<
    ShirtConfiguration["addons"][string]["placement"],
    React.CSSProperties
  > = {
    chest: { top: "38%", left: "50%", transform: "translate(-50%, -50%)" },
    shoulder: { top: "22%", left: "20%" },
    hem: { bottom: "12%", left: "50%", transform: "translateX(-50%)" },
    back: { top: "30%", right: "14%" },
    sleeve: { top: "45%", right: "6%" },
    floating: { top: "60%", left: "50%", transform: "translate(-50%, -50%)" },
  };

  const intensityScale = addon.intensity / 100;
  const opacity = Math.min(0.85, 0.35 + intensityScale * 0.55);

  if (addon.id === "rhinestones") {
    return (
      <div
        style={{
          ...baseStyle,
          ...placementStyles[addon.placement],
          display: "flex",
          gap: "6px",
          opacity,
        }}
      >
        {Array.from({ length: Math.max(3, Math.round(6 * intensityScale)) }).map(
          (_, index) => (
            <div
              key={index}
              style={{
                width: `${8 + intensityScale * 4}px`,
                height: `${8 + intensityScale * 4}px`,
                borderRadius: "999px",
                background: `radial-gradient(circle at 30% 30%, #fff, ${accent})`,
                boxShadow: `0 0 6px ${accent}`,
                opacity: 0.8,
              }}
            />
          ),
        )}
      </div>
    );
  }

  if (addon.id === "zipper") {
    return (
      <div
        style={{
          ...baseStyle,
          ...placementStyles[addon.placement],
          width: "2px",
          height: `${48 + intensityScale * 36}px`,
          background: `linear-gradient(180deg, ${accent}, rgba(17,17,19,0.75))`,
          boxShadow: `0 0 10px rgba(0,0,0,0.4)`,
          opacity,
        }}
      />
    );
  }

  if (addon.id === "pocket") {
    return (
      <div
        style={{
          ...baseStyle,
          ...placementStyles[addon.placement],
          width: `${50 + intensityScale * 24}px`,
          height: `${44 + intensityScale * 18}px`,
          border: `2px solid ${accent}`,
          borderRadius: "12px",
          background:
            intensityScale > 0.5
              ? `linear-gradient(180deg, rgba(255,255,255,0.25), rgba(0,0,0,0.15))`
              : "transparent",
          opacity,
        }}
      />
    );
  }

  if (addon.id === "embroidery") {
    return (
      <div
        style={{
          ...baseStyle,
          ...placementStyles[addon.placement],
          fontSize: `${16 + intensityScale * 6}px`,
          letterSpacing: "0.3em",
          fontWeight: 600,
          opacity,
        }}
      >
        {Array.from({ length: Math.max(4, Math.round(intensityScale * 8)) })
          .map(() => "×")
          .join(" ")}
      </div>
    );
  }

  if (addon.id === "paneling") {
    return (
      <div
        style={{
          ...baseStyle,
          ...placementStyles[addon.placement],
          width: `${90 + intensityScale * 40}px`,
          height: `${140 + intensityScale * 30}px`,
          borderRadius: "28px",
          border: `1px dashed ${accent}`,
          background:
            intensityScale > 0.4
              ? "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.3))"
              : "transparent",
          boxShadow:
            intensityScale > 0.6
              ? `0 0 20px rgba(17,17,19,0.2)`
              : undefined,
          opacity,
        }}
      />
    );
  }

  if (addon.id === "modular") {
    return (
      <div
        style={{
          ...baseStyle,
          ...placementStyles[addon.placement],
          display: "grid",
          gap: "6px",
          gridTemplateColumns: "repeat(3, 1fr)",
          opacity,
        }}
      >
        {Array.from({ length: 6 + Math.round(intensityScale * 3) }).map(
          (_, index) => (
            <div
              key={index}
              style={{
                width: `${18 + intensityScale * 6}px`,
                height: `${18 + intensityScale * 6}px`,
                borderRadius: "6px",
                border: `1.5px solid ${accent}`,
                background:
                  intensityScale > 0.5
                    ? `linear-gradient(145deg, rgba(255,255,255,0.45), rgba(0,0,0,0.4))`
                    : "transparent",
              }}
            />
          ),
        )}
      </div>
    );
  }

  return null;
}
