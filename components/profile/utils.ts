import { GenerationHistoryItem, GroupedHistoryItem } from './types';

// 按日期分组函数
export const groupHistoryByDate = (items: GenerationHistoryItem[]): GroupedHistoryItem[] => {
  const groups: Record<string, GenerationHistoryItem[]> = {};
  items.forEach((item) => {
    const date = new Date(item.created_at * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });

  return Object.entries(groups)
    .map(([date, itemsForDate]) => ({ date, items: itemsForDate }))
    .sort((a, b) => {
      const aTs = a.items[0]?.created_at ?? 0;
      const bTs = b.items[0]?.created_at ?? 0;
      return bTs - aTs;
    });
};

// 分页辅助函数
export function getPaginationItems(currentPage: number, totalPages: number, siblingCount = 1): (number | '...')[] {
  const totalPageNumbers = siblingCount + 5; // siblings + first + last + current + 2*ellipsis

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, '...', lastPageIndex];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i);
    return [firstPageIndex, '...', ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1); // Fallback
}

// 格式化时间戳
export const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return 'N/A';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(timestamp * 1000));
  } catch (e) {
    console.error("Error formatting date:", e);
    return new Date(timestamp * 1000).toLocaleDateString(); // Fallback
  }
};

// 格式化变更类型
export const formatChangeType = (changeType: string): string => {
  const typeMap: Record<string, string> = {
    'buy_package': 'Buy Package',
    'create_task_free': 'Free Generation',
    'month_free': 'Monthly Free',
    'register_give': 'Registration Gift',
    'invite_reward': 'Invitation Reward',
    'daily_check': 'Daily Check-in',
    'refund': 'Refund',
  };
  return typeMap[changeType] || changeType;
};

// 格式化价格
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};



// 下载媒体文件（带CORS处理）
export async function downloadMediaWithCors(
  mediaUrl: string,
  filename: string,
  setIsDownloading: (id: number | null) => void,
  mediaId: number,
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
) {
  setIsDownloading(mediaId);
  try {
    const response = await fetch(mediaUrl, { mode: 'cors' });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}. Failed to fetch media. Check CORS headers on the server.`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename || `ideavido-media-${mediaId}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(objectUrl);

    console.log('Media download initiated!');
    showToast('Video downloaded successfully!', 'success');

  } catch (error: any) {
    console.error('Download failed:', error);
    const errorMessage = 'Download failed!';
    const genericMessage = `Error: ${error.message}`;

    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      showToast(`${errorMessage} - CORS error. Check server configuration.`, 'error');
    } else {
      showToast(`${errorMessage} ${genericMessage}`, 'error');
    }
  } finally {
    setIsDownloading(null);
  }
}

// 解析媒体URL字符串（用 | 分割）
export const parseMediaUrls = (mediaString: string): string[] => {
  if (!mediaString) return [];
  return mediaString.split('|').filter(url => url.trim());
};

// 判断是否为视频文件
export const isVideoFile = (url: string): boolean => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext));
};

// 判断是否为图片文件
export const isImageFile = (url: string): boolean => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
};

// 判断是否为音频文件
export const isAudioFile = (url: string): boolean => {
  if (!url) return false;
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.wma'];
  const lowerUrl = url.toLowerCase();
  return audioExtensions.some(ext => lowerUrl.includes(ext));
};

// 统一弹窗表格样式
export const dialogTable = {
  wrapper: 'rounded-lg border border-border overflow-x-auto -mx-4 sm:mx-0',
  table: 'w-full table-fixed',
  headCell: 'text-left px-3 sm:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm font-semibold text-muted-foreground',
  cell: 'px-3 sm:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm',
  row: 'border-b border-border hover:bg-muted/50',
  mono: 'text-muted-foreground text-xs sm:text-sm font-mono',
  pillBase: 'inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium',
} as const;

