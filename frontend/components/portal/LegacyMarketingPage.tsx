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
import { PortalShell, useLoad, StatusMessage } from "./shared";
import { Pagination, type PageResult } from "./Pagination";
import { Modal } from "./Modal";
import { LegacyMarkup } from "./LegacyMarkup";
import { StoryCard, type Story } from "./StoryCard";
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
        body: JSON.stringify({ title, body, category }),
      });
      close();
      setTitle("");
      setBody("");
      setCurrentPage(1);
      setMessage("Đã chia sẻ câu chuyện.");
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
            <form className="portal-form" onSubmit={share}>
              <h2>Chia sẻ câu chuyện</h2>
              <label>
                Tiêu đề
                <input
                  autoFocus
                  required
                  minLength={3}
                  maxLength={200}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
              <label>
                Loại câu chuyện
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="article">Bài viết</option>
                  <option value="inspire">Truyền cảm hứng</option>
                </select>
              </label>
              <label>
                Nội dung
                <textarea
                  required
                  minLength={10}
                  maxLength={10000}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                />
              </label>
              <button className="btn btn-primary" disabled={busy}>
                {busy ? "Đang chia sẻ…" : "Chia sẻ"}
              </button>
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
            <article>
              <h2>{selected?.title}</h2>
              <p className="story-detail-body">{selected?.body}</p>
            </article>
          )}
        </Modal>
      )}
    </PortalShell>
  );
}
