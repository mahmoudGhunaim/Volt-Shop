"use client";

import { Slider } from "radix-ui";
import { useI18n } from "@/i18n/provider";

export function RangeSlider({
  value,
  onValueChange,
  onValueCommit,
  min,
  max,
  labels,
}: {
  value: [number, number];
  onValueChange: (v: [number, number]) => void;
  onValueCommit?: (v: [number, number]) => void;
  min: number;
  max: number;
  labels: [string, string];
}) {
  const { dir } = useI18n();
  return (
    <Slider.Root
      className="relative flex h-6 w-full touch-none select-none items-center"
      value={value}
      min={min}
      max={max}
      step={1}
      minStepsBetweenThumbs={10}
      dir={dir}
      onValueChange={(v) => onValueChange([v[0] ?? min, v[1] ?? max])}
      onValueCommit={(v) => onValueCommit?.([v[0] ?? min, v[1] ?? max])}
    >
      <Slider.Track className="relative h-1 grow overflow-hidden rounded-full bg-border">
        <Slider.Range className="absolute h-full rounded-full bg-fg" />
      </Slider.Track>
      {labels.map((label) => (
        <Slider.Thumb
          key={label}
          aria-label={label}
          className="block size-5 rounded-full border-2 border-fg bg-bg shadow-[0_2px_8px_rgb(0_0_0/0.3)] transition-[transform,box-shadow] duration-150 hover:scale-110 focus-visible:shadow-[0_0_0_5px_var(--glow-violet)] focus-visible:outline-none active:scale-95"
        />
      ))}
    </Slider.Root>
  );
}
