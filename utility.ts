import { Level } from "@prisma/client";

export function message(message: string) {
  return {
    message,
  };
}

type CalculatableLevel = Level & {
  ratings: { value: number }[];
  completions: any[];
};

export function addCalculationsToLevel(level: CalculatableLevel) {
  const totalRatings = level.ratings.length;
  const ratingSum = level.ratings.reduce(
    (accum, item) => item.value + accum,
    0
  );
  const { completions, ratings, ...levelWithoutCompletionsAndRatings } = level;

  return {
    averageRating: totalRatings > 0 ? ratingSum / totalRatings : 0,
    totalRatings,
    totalCompletions: completions.length,
    ...levelWithoutCompletionsAndRatings,
  };
}
