import { ActivityDetailPage } from "@/components/portal/ActivityDetailPage";

export default async function Page({
  params: paramsPromise,
}: {
  params: Promise<{ identifier: string }>;
}) {
  const params = await paramsPromise;
  return <ActivityDetailPage identifier={params.identifier} />;
}
