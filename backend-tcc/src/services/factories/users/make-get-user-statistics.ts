import { GetUserStatisticsService } from "../../users/get-user-statistics-service.ts";

export function makeGetUserStatisticsService() {
  const service = new GetUserStatisticsService();
  return service;
}