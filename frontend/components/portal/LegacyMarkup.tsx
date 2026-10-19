"use client";
import { forwardRef, memo } from "react";

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
