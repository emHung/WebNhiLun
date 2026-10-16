"use client";
import { forwardRef, memo } from "react";
/** Preserve React portal children when unrelated API state changes. */
export const LegacyMarkup = memo(
  forwardRef<HTMLElement, { html: string; className: string }>(
    function LegacyMarkup({ html, className }, ref) {
      return (
        <main
          ref={ref}
          className={className}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    },
  ),
);
