"use client";
import {
  useLoad,
  Profile,
  Activity,
  StatusMessage,
  EmptyState,
  PortalShell,
} from "@/components/portal/shared";
import { ActivityCard } from "@/components/portal/ActivityCard";
import { VolunteerWorkspaceFrame } from "@/components/portal/VolunteerWorkspaceFrame";
import { apiRequest } from "@/lib/api";
import { useState } from "react";
export default function Page() {
  const { data: profile } = useLoad<Profile>("/me/profile");
  const { data, error, loading, refresh } =
    useLoad<Activity[]>("/me/favorites");
  const [message, setMessage] = useState("");
  return (
    <PortalShell>
      <VolunteerWorkspaceFrame active="/favorites" profile={profile}>
        <section className="profile-page-content">
          <h1>Hoạt động yêu thích</h1>
          <StatusMessage loading={loading} error={error} />
          <p role="status">{message}</p>
          <div className="portal-grid">
            {data?.map((item) => (
              <article key={item.id}>
                <ActivityCard activity={item} />
                <button
                  className="btn btn-outline"
                  onClick={async () => {
                    try {
                      await apiRequest(
                        `/me/favorites/${encodeURIComponent(item.id)}`,
                        { method: "DELETE" },
                      );
                      refresh();
                    } catch (error) {
                      setMessage(
                        error instanceof Error
                          ? error.message
                          : "Không bỏ lưu được hoạt động.",
                      );
                    }
                  }}
                >
                  Bỏ lưu
                </button>
              </article>
            ))}
          </div>
          {!loading && !data?.length && (
            <EmptyState>Bạn chưa lưu hoạt động nào.</EmptyState>
          )}
        </section>
      </VolunteerWorkspaceFrame>
    </PortalShell>
  );
}
