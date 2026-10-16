import { ApplyPage } from "@/components/portal/ApplyPage";

export default async function Page({
  params: paramsPromise,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const params = await paramsPromise;
  return <ApplyPage activityId={params.activityId} />;
}
