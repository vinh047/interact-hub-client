export function formatRelativeTime(dateString: string): string {
  const safeDateString = dateString.endsWith("Z")
    ? dateString
    : `${dateString}Z`;
  const now = new Date();
  const past = new Date(safeDateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày`;

  return past.toLocaleDateString("vi-VN"); // Trả về ngày cụ thể nếu quá lâu
}
