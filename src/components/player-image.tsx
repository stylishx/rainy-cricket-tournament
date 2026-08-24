"use client";

import Image from "next/image";
import { useState } from "react";
import { UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

type PlayerImageProps = {
  src: string;
  name: string;
  /** Responsive `sizes` hint passed straight to next/image. */
  sizes: string;
  /** Set on the Live Search card so the photo is fetched immediately. */
  priority?: boolean;
  className?: string;
};

/**
 * Renders a player photo at a FIXED frame size, whatever the source file's
 * dimensions are. The parent supplies the frame (a fixed aspect-ratio box);
 * `object-contain` scales the whole photo to fit inside it, so nothing is
 * ever cropped — portrait, landscape and square sources all work.
 *
 * `contain` leaves empty bars whenever the photo's ratio differs from the
 * frame's, so a heavily blurred, low-res copy of the same photo is painted
 * behind it to fill them.
 *
 * Falls back to a placeholder if the file is not in /public/players/ yet.
 */
export function PlayerImage({
  src,
  name,
  sizes,
  priority = false,
  className,
}: PlayerImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-800 text-slate-500",
          className
        )}
      >
        <UserRound className="size-10" aria-hidden />
        <span className="px-3 text-center text-xs font-medium">{name}</span>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop: ~32px wide, blurred past recognition. Decorative only. */}
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes="32px"
        quality={20}
        className="scale-110 object-cover opacity-35 blur-2xl"
      />
      {/* The actual photo — always complete, never cropped. */}
      <Image
        src={src}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className={cn("object-contain", className)}
      />
    </>
  );
}
