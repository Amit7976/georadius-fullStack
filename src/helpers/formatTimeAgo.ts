export const formatTimeAgo = (publish_time: string) => {
  // console.log("====================================");
  // console.log("triggered formatTimeAgo with publish_time:", publish_time);
  // console.log("====================================");
  const time = new Date(publish_time);
  const now = new Date();
  const diff = Math.floor((now.getTime() - time.getTime()) / 1000); // Difference in seconds

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  if (diff < 60) return `${diff} sec ago`;
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  return `${Math.floor(months / 12)} years ago`;
};
