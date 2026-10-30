import type { TimeframeOption, KpiDashboardData } from "./types";

export function safeRate(numerator: number | null | undefined, denominator: number | null | undefined): number;
export function safeDelta(
  current: number | null | undefined,
  previous: number | null | undefined
): { value: number; isPositive: boolean };
export function safeCurrency(cents: number | null | undefined): string;
export function formatHours(hours: number | null | undefined): string;
export function getEmptyKpiData(timeframe?: TimeframeOption): KpiDashboardData;
