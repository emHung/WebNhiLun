"use client";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import DOMPurify from "dompurify";
import { apiRequest } from "@/lib/api";
import { optimizeHtmlImages } from "@/lib/media";
import { useDebouncedValue } from "@/hooks/use-api-query";
import { PortalShell, useLoad, StatusMessage, formatDate } from "./shared";
import { Pagination, type PageResult } from "./Pagination";
import { Modal } from "./Modal";
import { LegacyMarkup } from "./LegacyMarkup";
import { StoryCard, type Story } from "./StoryCard";

const categoryLabels: Record<string, string> = {
  all: "Tất cả",
  article: "Bài viết",
  image: "Hình ảnh",
  video: "Video",
  inspire: "Truyền cảm hứng",
};

type MarketingPage = "about" | "stories";
export function LegacyMarketingPage({ page }: { page: MarketingPage }) {
  const rootRef = useRef<HTMLElement>(null);
  const { data, error } = useLoad<{ html: string }>(
    `/site-content/${page === "about" ? "aboutContent" : "storiesContent"}`,
  );
  const { data: me } = useLoad<{ id: string }>("/auth/me");
  const [currentPage, setCurrentPage] = useState(1),
    [filter, setFilter] = useState("all"),
    [query, setQuery] = useState("");
  const search = useDebouncedValue(query);
  const params = new URLSearchParams({
    page: String(currentPage),
    limit: "6",
    category: filter,
    search,
  });
  const {
    data: storyPage,
    error: storiesError,
    loading,
    refresh,
  } = useLoad<PageResult<Story>>(
    page === "stories" ? `/stories?${params}` : null,
  );
  const { data: likes } = useLoad<string[]>(
    page === "stories" && me ? "/me/story-likes" : null,
  );
  const [content, setContent] = useState(""),
    [templates, setTemplates] = useState<Record<string, string>>({}),
    [target, setTarget] = useState<Element | null>(null),
    [message, setMessage] = useState("");
  const [modal, setModal] = useState<"share" | "video" | "detail" | null>(null),
    [selected, setSelected] = useState<Story | null>(null),
    [video, setVideo] = useState("");
  const [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [category, setCategory] = useState("article"),
    [thumbnailUrl, setThumbnailUrl] = useState(""),
    [busy, setBusy] = useState(false);
  const close = useCallback(() => setModal(null), []);
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);
  useEffect(() => {
    const html = optimizeHtmlImages(
      DOMPurify.sanitize(data?.html || "", {
        FORBID_TAGS: ["script", "style"],
      }),
    );
    const doc = new DOMParser().parseFromString(html, "text/html"),
      cards: Record<string, string> = {};
    if (page === "stories")
      doc
        .querySelectorAll<HTMLElement>(".story-card-item")
        .forEach((card, index) => {
          cards[card.dataset.storyId || `legacy-story-${index + 1}`] =
            card.innerHTML;
          card.remove();
        });
    setTemplates(cards);
    setContent(doc.body.innerHTML);
  }, [data, page]);
  useEffect(() => {
    const root = rootRef.current;
    if (page !== "stories" || !root) return;
    setTarget(root.querySelector(".stories-cards-grid"));
    const click = (event: Event) => {
      const element = event.target instanceof Element ? event.target : null;
      const pill = element?.closest<HTMLElement>(".story-pill-btn");
      if (pill) {
        root
          .querySelectorAll(".story-pill-btn")
          .forEach((item) => item.classList.toggle("active", item === pill));
        setFilter(pill.dataset.storyFilter || "all");
        return;
      }
      const action = element?.closest<HTMLElement>("[data-story-action]")
        ?.dataset.storyAction;
      if (action === "share") {
        event.preventDefault();
        if (!me) {
          setMessage("Hãy đăng nhập để chia sẻ câu chuyện.");
          return;
        }
        setModal("share");
      }
      if (action === "video") {
        event.preventDefault();
        const url =
          root.querySelector<HTMLElement>("[data-video-url]")?.dataset.videoUrl;
        if (url?.startsWith("https://www.youtube-nocookie.com/embed/")) {
          setVideo(url);
          setModal("video");
        }
      }
    };
    const input = (event: Event) => {
      if (
        event.target instanceof HTMLInputElement &&
        event.target.closest(".stories-search-input-box")
      )
        setQuery(event.target.value);
    };
    root.addEventListener("click", click);
    root.addEventListener("input", input);
    return () => {
      root.removeEventListener("click", click);
      root.removeEventListener("input", input);
    };
  }, [content, page, me]);
  async function like(story: Story) {
    if (!me) {
      setMessage("Hãy đăng nhập để thích câu chuyện.");
      return;
    }
    try {
      await apiRequest(
        `/stories/${encodeURIComponent(story.id)}/like?liked=${!likes?.includes(story.id)}`,
        { method: "PUT" },
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không lưu được lượt thích.",
      );
    }
  }
  async function share(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await apiRequest("/stories", {
        method: "POST",
        body: JSON.stringify({
          title,
          body,
          category,
          thumbnail_url: thumbnailUrl.trim() || undefined,
        }),
      });
      close();
      setTitle("");
      setBody("");
      setThumbnailUrl("");
      setCurrentPage(1);
      setMessage("Đã chia sẻ câu chuyện thành công.");
      refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không chia sẻ được câu chuyện.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <PortalShell>
      {message && (
        <p className="container portal-message" role="status">
          {message}
        </p>
      )}
      {error ? (
        <main className="container">
          <p role="alert">{error}</p>
        </main>
      ) : (
        <LegacyMarkup
          ref={rootRef}
          className={
            page === "about" ? "about-page-wrapper" : "stories-page-wrapper"
          }
          html={`<div class="${page}-container">${content}</div>`}
        />
      )}
      {target &&
        createPortal(
          <>
            <StatusMessage error={storiesError} loading={loading} />
            {storyPage?.items.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                template={templates[story.id]}
                liked={Boolean(likes?.includes(story.id))}
                onLike={() => {
                  void like(story);
                }}
                onOpen={() => {
                  setSelected(story);
                  setModal("detail");
                }}
              />
            ))}
            {!loading && !storyPage?.items.length && (
              <p>Không có câu chuyện phù hợp.</p>
            )}
            <div className="stories-pagination">
              <Pagination
                page={currentPage}
                total={storyPage?.total || 0}
                limit={6}
                onChange={setCurrentPage}
                loading={loading}
              />
            </div>
          </>,
          target,
        )}
      {modal && (
        <Modal label="Câu chuyện cộng đồng" onClose={close}>
          {modal === "share" ? (
            <form className="portal-form" onSubmit={share} style={{ gap: "16px" }}>
              <div style={{ marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: "rgba(16, 185, 129, 0.12)",
                      color: "#10b981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                    }}
                  >
                    <i className="ri-quill-pen-line" />
                  </div>
                  <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>
                    Chia sẻ câu chuyện
                  </h2>
                </div>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary, #64748b)", lineHeight: 1.5 }}>
                  Lan tỏa những khoảnh khắc đẹp, câu chuyện ý nghĩa và tinh thần thiện nguyện đến với cộng đồng.
                </p>
              </div>

              <label style={{ display: "grid", gap: "6px", fontWeight: 600, color: "var(--text-primary, #1e293b)", fontSize: "0.88rem" }}>
                <span>Tiêu đề câu chuyện <span style={{ color: "#ef4444" }}>*</span></span>
                <input
                  autoFocus
                  required
                  minLength={3}
                  maxLength={200}
                  placeholder="Ví dụ: Một ngày làm tình nguyện viên vùng cao..."
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-default, #cbd5e1)",
                    fontSize: "0.92rem",
                  }}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                <label style={{ display: "grid", gap: "6px", fontWeight: 600, color: "var(--text-primary, #1e293b)", fontSize: "0.88rem" }}>
                  <span>Loại câu chuyện</span>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--border-default, #cbd5e1)",
                      fontSize: "0.92rem",
                      background: "#fff",
                    }}
                  >
                    <option value="article">Bài viết</option>
                    <option value="inspire">Truyền cảm hứng</option>
                    <option value="image">Hình ảnh</option>
                    <option value="video">Video</option>
                  </select>
                </label>

                <label style={{ display: "grid", gap: "6px", fontWeight: 600, color: "var(--text-primary, #1e293b)", fontSize: "0.88rem" }}>
                  <span>Link ảnh minh họa <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: "0.8rem" }}>(tùy chọn)</span></span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={thumbnailUrl}
                    onChange={(event) => setThumbnailUrl(event.target.value)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--border-default, #cbd5e1)",
                      fontSize: "0.92rem",
                    }}
                  />
                </label>
              </div>

              <label style={{ display: "grid", gap: "6px", fontWeight: 600, color: "var(--text-primary, #1e293b)", fontSize: "0.88rem" }}>
                <span>Nội dung câu chuyện <span style={{ color: "#ef4444" }}>*</span></span>
                <textarea
                  required
                  minLength={10}
                  maxLength={10000}
                  rows={5}
                  placeholder="Kể câu chuyện, cảm xúc và trải nghiệm đáng nhớ của bạn..."
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-default, #cbd5e1)",
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                    minHeight: "130px",
                    resize: "vertical",
                  }}
                />
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={close}
                  disabled={busy}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={busy}
                  style={{ minWidth: "120px" }}
                >
                  {busy ? (
                    <>
                      <i className="ri-loader-4-line ri-spin" /> Đang gửi…
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-fill" /> Chia sẻ
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : modal === "video" ? (
            <iframe
              className="story-video-player"
              src={video}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Video cộng đồng"
            />
          ) : (
            <article style={{ position: "relative" }}>
              {selected?.thumbnail_url && (
                <div
                  style={{
                    position: "relative",
                    width: "calc(100% + 56px)",
                    margin: "-28px -28px 20px -28px",
                    height: "220px",
                    overflow: "hidden",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                    background: "#0f172a",
                  }}
                >
                  <img
                    src={selected.thumbnail_url}
                    alt={selected.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                    }}
                  />
                  <div style={{ position: "absolute", bottom: "16px", left: "24px" }}>
                    <span
                      style={{
                        padding: "5px 14px",
                        borderRadius: "999px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        background: "rgba(255,255,255,0.95)",
                        color: "#0f172a",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        backdropFilter: "blur(4px)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {categoryLabels[selected.category] || selected.category}
                    </span>
                  </div>
                </div>
              )}

              {!selected?.thumbnail_url && (
                <div style={{ marginBottom: "12px" }}>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      background: "#ecfdf5",
                      color: "#059669",
                      display: "inline-block",
                    }}
                  >
                    {categoryLabels[selected?.category || ""] || selected?.category}
                  </span>
                </div>
              )}

              <h2
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  lineHeight: 1.4,
                  color: "var(--text-primary, #0f172a)",
                  margin: "0 0 16px 0",
                }}
              >
                {selected?.title}
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                  paddingBottom: "16px",
                  marginBottom: "20px",
                  borderBottom: "1px solid var(--border-default, #e2e8f0)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={selected?.author_avatar || "/legacy/images/profile-avatar.jpg"}
                    alt={selected?.author_name || selected?.author || "Tác giả"}
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #fff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary, #0f172a)" }}>
                      {selected?.author_name || selected?.author || "Tình nguyện viên"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary, #64748b)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <i className="ri-calendar-line" />
                      <span>{selected?.created_at ? formatDate(selected.created_at) : "Gần đây"}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (selected) {
                      void like(selected);
                      const isLiked = Boolean(likes?.includes(selected.id));
                      setSelected({
                        ...selected,
                        likes: isLiked ? Math.max(0, (selected.likes || 1) - 1) : (selected.likes || 0) + 1,
                      });
                    }
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 16px",
                    borderRadius: "999px",
                    border: Boolean(likes?.includes(selected?.id || "")) ? "1px solid #fecaca" : "1px solid #e2e8f0",
                    background: Boolean(likes?.includes(selected?.id || "")) ? "#fef2f2" : "#f8fafc",
                    color: Boolean(likes?.includes(selected?.id || "")) ? "#ef4444" : "#64748b",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <i className={Boolean(likes?.includes(selected?.id || "")) ? "ri-heart-fill" : "ri-heart-line"} style={{ color: "#ef4444", fontSize: "1rem" }} />
                  <span>{selected?.likes || 0} lượt thích</span>
                </button>
              </div>

              <div
                style={{
                  fontSize: "0.98rem",
                  lineHeight: 1.85,
                  color: "var(--text-primary, #334155)",
                  whiteSpace: "pre-line",
                  maxHeight: "380px",
                  overflowY: "auto",
                  paddingRight: "6px",
                }}
              >
                {selected?.body}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "24px",
                  paddingTop: "14px",
                  borderTop: "1px solid var(--border-default, #f1f5f9)",
                }}
              >
                <button type="button" className="btn btn-outline" onClick={close}>
                  Đóng
                </button>
              </div>
            </article>
          )}
        </Modal>
      )}
    </PortalShell>
  );
}
