"use client";

export default function LegacyFrame({ source }: { source: string }) {
  return <iframe className="legacy-frame" src={source} title="VolunteerHub" />;
}
