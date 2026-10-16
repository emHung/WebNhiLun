"use client";
import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
const rules = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "a",
  ],
  ALLOWED_ATTR: ["href", "rel"],
};
function clean(value: string) {
  return DOMPurify.sanitize(value, rules);
}
export { descriptionText } from "@/lib/rich-text";
export function ActivityDescription({ value }: { value: string }) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    setHtml(/<[^>]+>/.test(value) ? clean(value) : null);
  }, [value]);
  return html === null ? (
    <div className="activity-description" style={{ whiteSpace: "pre-line" }}>
      {value}
    </div>
  ) : (
    <div
      className="activity-description"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
export function ActivityEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = editor.current;
    if (!el || document.activeElement === el) return;
    if (/<[^>]+>/.test(value)) el.innerHTML = clean(value);
    else el.textContent = value;
  }, [value]);
  function format(tag: string) {
    const el = editor.current;
    if (!el) return;
    const selection = window.getSelection();
    const selected =
      selection && selection.rangeCount ? selection.getRangeAt(0) : null;
    const range =
      selected && el.contains(selected.commonAncestorContainer)
        ? selected
        : document.createRange();
    if (range !== selected) {
      range.selectNodeContents(el);
      range.collapse(false);
    }
    const wrapper = document.createElement(tag);
    if (tag === "a") {
      const url = window.prompt("Địa chỉ liên kết (https://...)");
      if (!url) return;
      try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) return;
        wrapper.setAttribute("href", parsed.href);
        wrapper.setAttribute("rel", "noopener noreferrer");
      } catch {
        return;
      }
    }
    const contents = range.extractContents();
    if (tag === "ul" || tag === "ol") {
      const item = document.createElement("li");
      item.append(
        contents.hasChildNodes()
          ? contents
          : document.createTextNode("Nội dung danh sách"),
      );
      wrapper.append(item);
    } else
      wrapper.append(
        contents.hasChildNodes()
          ? contents
          : document.createTextNode(tag === "a" ? "Liên kết" : "Nội dung"),
      );
    range.insertNode(wrapper);
    range.selectNodeContents(wrapper);
    selection?.removeAllRanges();
    selection?.addRange(range);
    onChange(clean(el.innerHTML));
    el.focus();
  }
  return (
    <div className="activity-editor">
      <div
        className="activity-editor-toolbar"
        role="toolbar"
        aria-label="Định dạng nội dung"
      >
        {[
          ["strong", "Đậm", "B"],
          ["em", "Nghiêng", "I"],
          ["u", "Gạch chân", "U"],
          ["ul", "Danh sách dấu đầu dòng", "•"],
          ["ol", "Danh sách đánh số", "1."],
          ["h3", "Tiêu đề", "H3"],
          ["a", "Chèn liên kết", "↗"],
        ].map(([tag, label, symbol]) => (
          <button
            key={tag}
            type="button"
            aria-label={label}
            title={label}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => format(tag)}
          >
            {symbol}
          </button>
        ))}
      </div>
      <div
        ref={editor}
        className="activity-editor-content"
        role="textbox"
        aria-label="Nội dung chi tiết"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange(clean(event.currentTarget.innerHTML))}
        onPaste={(event) => {
          event.preventDefault();
          const text = event.clipboardData.getData("text/plain");
          const selection = window.getSelection();
          if (!selection?.rangeCount) return;
          const range = selection.getRangeAt(0);
          if (!editor.current?.contains(range.commonAncestorContainer)) return;
          range.deleteContents();
          const node = document.createTextNode(text);
          range.insertNode(node);
          range.setStartAfter(node);
          range.collapse(true);
          onChange(clean(editor.current.innerHTML));
        }}
      />
      <small>{value.length.toLocaleString("vi-VN")} / 20.000 ký tự</small>
    </div>
  );
}
