import manifest from "./optimized-images.json";
type ImageRecord = {
  original: string;
  variants: { src: string; width: number; height: number }[];
};
const records = Object.values(manifest) as ImageRecord[];
const lookup = new Map<string, ImageRecord>();
records.forEach((record) => {
  lookup.set(record.original, record);
  record.variants.forEach((variant) => lookup.set(variant.src, record));
});
function normalize(value: string) {
  return /^(https?:)?\/\//i.test(value) ||
    value.startsWith("/") ||
    /^data:image\/(?:png|jpeg|webp);base64,/i.test(value) ||
    value.startsWith("blob:")
    ? value
    : `/legacy/${value.replace(/^\.\//, "")}`;
}
export function imageRecord(value?: string | null) {
  if (!value) return;
  const url = normalize(value);
  return lookup.get(url);
}
export function imageUrl(value?: string | null) {
  const record = imageRecord(value);
  return (
    record?.variants[record.variants.length - 1]?.src ||
    normalize(value || "/legacy/images/profile-avatar.jpg")
  );
}

export function optimizeHtmlImages(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html");
  document.querySelectorAll("img").forEach((image) => {
    const record = imageRecord(image.getAttribute("src"));
    if (!record) return;
    const largest = record.variants[record.variants.length - 1];
    image.src = largest.src;
    image.srcset = record.variants
      .map((item) => `${item.src} ${item.width}w`)
      .join(",");
    image.sizes = image.className.includes("avatar")
      ? "48px"
      : "(max-width: 640px) 100vw, 50vw";
    image.loading = "lazy";
    image.decoding = "async";
    image.width = largest.width;
    image.height = largest.height;
  });
  return document.body.innerHTML;
}
