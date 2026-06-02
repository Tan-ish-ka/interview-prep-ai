export interface RatingPoint {
  label: string;
  rating: number;
}

export function extractRatingTrend(
  ratingHistory: Record<string, unknown>,
  maxPoints = 12,
): RatingPoint[] {
  const result = ratingHistory.result;
  if (!Array.isArray(result)) return [];

  const points: RatingPoint[] = [];

  for (const entry of result) {
    if (typeof entry !== "object" || entry === null) continue;
    const record = entry as Record<string, unknown>;
    const rating = record.newRating;
    if (typeof rating !== "number") continue;
    points.push({ label: "", rating });
  }

  return points.slice(-maxPoints).map((point, index) => ({
    label: `#${index + 1}`,
    rating: point.rating,
  }));
}
