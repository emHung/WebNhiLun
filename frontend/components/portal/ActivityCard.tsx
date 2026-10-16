"use client";
import { MediaImage } from "@/components/portal/MediaImage";

import Link from "next/link";
import { imageUrl } from "@/lib/media";

import { descriptionText } from "@/lib/rich-text";

import { Activity, formatDate } from "./shared";

export function ActivityCard({
  activity,
  onFavorite,
}: {
  activity: Activity;
  onFavorite?: (activity: Activity) => void;
}) {
  const percent = Math.min(
    100,
    Math.round((activity.applied / Math.max(1, activity.capacity)) * 100),
  );
  return (
    <article className="portal-card portal-activity-card">
      <Link
        href={`/activities/${activity.slug}`}
        aria-label={`Xem ${activity.title}`}
      >
        {activity.banner_url ? (
          <MediaImage
            className="portal-activity-image"
            src={imageUrl(activity.banner_url)}
            alt=""
          />
        ) : (
          <div className="portal-activity-image" />
        )}
      </Link>
      <div className="portal-meta">
        <span className="badge badge-mint">{activity.category}</span>
        <span>{formatDate(activity.event_date)}</span>
      </div>
      <h3>
        <Link href={`/activities/${activity.slug}`}>{activity.title}</Link>
      </h3>
      <p>{descriptionText(activity.description)}</p>
      <div className="portal-meta">
        <span>
          <i className="ri-map-pin-line" /> {activity.city}
        </span>
        <span>
          <i className="ri-building-line" /> {activity.organizer_name}
        </span>
      </div>
      <div>
        <div className="portal-meta">
          <span>
            {activity.applied}/{activity.capacity} người
          </span>
          <span>{percent}%</span>
        </div>
        <div className="portal-progress">
          <span style={{ width: `${percent}%` }} />
        </div>
      </div>
      <div className="portal-form-actions">
        <Link
          className="btn btn-primary btn-sm"
          href={`/activities/${activity.slug}`}
        >
          Xem chi tiết
        </Link>
        {onFavorite && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onFavorite(activity)}
            aria-label="Lưu hoạt động"
          >
            <i className="ri-heart-line" /> Lưu
          </button>
        )}
      </div>
    </article>
  );
}
