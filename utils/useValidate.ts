import StatsModel from "../models/stats";

const validateWithAdaptiveThreshold = (
  newValue: number,
  recentValues: number[],
  threshold = 4
): number => {
  if (recentValues.length < 3) return newValue;

  const avg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
  const maxDeviation = avg * threshold;

  if (Math.abs(newValue - avg) > maxDeviation) {
    return avg;
  }

  return newValue;
};

const getValidatedCount = async (
  subreddit_name: string,
  newValue: number
): Promise<number> => {
  const results = await StatsModel.find({
    subreddit_name,
    count: { $ne: 0 },
  })
    .sort({ timestamp: -1 })
    .limit(3);

  const oldValues = results.map((item) => item.count);
  const validated = validateWithAdaptiveThreshold(newValue, oldValues);
  return validated >= 0 ? validated : 0;
};

export default getValidatedCount;
