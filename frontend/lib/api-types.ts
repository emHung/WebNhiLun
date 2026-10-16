import type { Activity } from "./models";
export type ActivityList = {
  items: Activity[];
  total: number;
  page: number;
  limit: number;
};
export type HomeMetrics = {
  activities: number;
  volunteers: number;
  locations: number;
};
