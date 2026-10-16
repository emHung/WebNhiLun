"use client";
import type { ImgHTMLAttributes } from "react";
import { imageRecord, imageUrl } from "@/lib/media";
export function MediaImage({
  src,
  alt = "",
  loading = "lazy",
  decoding = "async",
  sizes,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const record = typeof src === "string" ? imageRecord(src) : undefined;
  const largest = record?.variants[record.variants.length - 1];
  const avatar = props.className?.includes("avatar");
  return (
    <img
      {...props}
      alt={alt}
      src={typeof src === "string" ? imageUrl(src) : src}
      loading={loading}
      decoding={decoding}
      width={props.width ?? largest?.width}
      height={props.height ?? largest?.height}
      srcSet={
        props.srcSet ??
        record?.variants.map((item) => `${item.src} ${item.width}w`).join(",")
      }
      sizes={
        sizes ??
        (record
          ? avatar
            ? "112px"
            : "(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
          : undefined)
      }
    />
  );
}
