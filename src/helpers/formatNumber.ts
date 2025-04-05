export const formatNumber = (num: number) => {
  if (num >= 10000000) return `${parseFloat((num / 10000000).toFixed(1))}Cr`; // 1Cr+
  if (num >= 100000) return `${parseFloat((num / 100000).toFixed(1))}L`; // 1L+
  if (num >= 1000) return `${parseFloat((num / 1000).toFixed(1))}K`; // 1K+
  return num;
};