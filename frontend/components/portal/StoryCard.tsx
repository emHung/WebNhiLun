"use client";
import { useEffect, useRef } from "react";
export type Story = {
  id: string;
  title: string;
  body: string;
  category: string;
  likes: number;
  author?: string;
};
export function StoryCard({
  story,
  template,
  liked,
  onLike,
  onOpen,
}: {
  story: Story;
  template?: string;
  liked: boolean;
  onLike: () => void;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    const title = card.querySelector(".story-card-title"),
      body = card.querySelector(".story-card-desc"),
      count = card.querySelector(".story-like-btn span"),
      button = card.querySelector(".story-like-btn");
    if (title) title.textContent = story.title;
    if (body) body.textContent = story.body;
    if (count) count.textContent = String(story.likes);
    button?.classList.toggle("liked", liked);
    button?.setAttribute("aria-pressed", String(liked));
    button?.setAttribute("role", "button");
    button?.setAttribute("tabindex", "0");
    button?.setAttribute("aria-label", "Thích câu chuyện");
  }, [story, liked, template]);
  function click(event: React.MouseEvent) {
    if ((event.target as Element).closest(".story-like-btn")) {
      event.preventDefault();
      onLike();
    } else onOpen();
  }
  // Legacy card markup is sanitized once by the parent; preserve its image/author layout.
  return template ? (
    <article
      ref={ref}
      className="story-card-item"
      onClick={click}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" &&
          (event.target as Element).closest(".story-like-btn")
        )
          onLike();
      }}
      dangerouslySetInnerHTML={{ __html: template }}
    />
  ) : (
    <article className="story-card-item" onClick={onOpen}>
      <div className="story-card-body">
        <h3 className="story-card-title">{story.title}</h3>
        <p className="story-card-desc">{story.body}</p>
        <div className="story-card-author-row">
          <span>{story.author || "Cộng đồng"}</span>
          <button
            className={`story-like-btn${liked ? " liked" : ""}`}
            type="button"
            aria-label="Thích câu chuyện"
            aria-pressed={liked}
            onClick={(event) => {
              event.stopPropagation();
              onLike();
            }}
          >
            <i className="ri-heart-line" />
            <span>{story.likes}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
