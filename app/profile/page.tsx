'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Footer } from '../../components/Footer';
import Image from 'next/image';
import { Progress } from '../../components/ui/progress';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from 'next/link';
import { DownloadIcon, ReloadIcon } from '@radix-ui/react-icons';
import { api } from '@/lib/api';

// 友情链接数据类型定义
interface FriendLink {
  id: number;
  name: string;
  url: string;
  is_bright: number;
  desc: string;
  image: string;
  web_type: number;
  sort: number;
  appid: string;
  created_time: number;
}

// 定义从API获取的用户信息类型
interface UserApiInfo {
  uuid: string;
  email: string;
  from_login: string;
  nickname: string;
  avatar?: string;
  free_limit: number;
  remaining_limit: number;
  total_limit: number;
  use_limit: number;
  vip_last_time: number;
  level: number;
  created_at: number;
  updated_at: number;
  status: number;
  id: number;
}

// 定义图片历史记录项的类型
interface GenerationHistoryItem {
  id: number;
  user_id: number;
  task_id: string;
  origin_image: string;
  size_image: string;
  other_image: string;
  generate_image: string;
  quality_image: string;
  status: number;
  status_msg: string;
  generation_time: number;
  prompt: string;
  created_at: number;
  updated_at: number;
}

// 定义图片历史记录 API 返回的数据结构
interface GenerationHistoryResponse {
  count: number;
  list: GenerationHistoryItem[];
  total_page: number;
}

// 定义积分记录项的类型
interface TimesLogItem {
  id: number;
  user_id: number;
  change_type: string;
  use_limit: number;
  created_at: number;
  updated_at: number;
}

// 定义积分记录 API 返回的数据结构
interface TimesLogResponse {
  count: number;
  list: TimesLogItem[];
  total_page: number;
}

// 定义用户生成图片的接口
interface GeneratedImage {
  id: string;
  imageUrl: string;
  createdAt: string;
}

// 将辅助函数移到组件外部
function getPaginationItems(currentPage: number, totalPages: number, siblingCount = 1): (number | '...')[] {
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

// --- 将下载逻辑定义为独立函数 --- 
async function downloadImageWithCors(
  imageUrl: string, 
  filename: string, 
  setIsDownloading: (id: number | null) => void, // 用于更新加载状态
  imageId: number // 图片 ID 用于设置加载状态
) {
  setIsDownloading(imageId); // 开始下载，设置加载状态
  try {
    // 1. 发起 fetch 请求
    const response = await fetch(imageUrl, { mode: 'cors' });

    // 检查响应是否成功并且是 CORS 允许的
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}. Failed to fetch image. Check CORS headers on the server.`);
    }

    // 2. 将响应体转换为 Blob 对象
    const blob = await response.blob();

    // 3. 创建一个指向 Blob 的 Object URL
    const objectUrl = URL.createObjectURL(blob);

    // 4. 创建 <a> 标签并触发下载
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename || `polatoons-image-${imageId}.png`; // 使用传入的 filename 或生成一个
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 5. 释放 Object URL 资源
    URL.revokeObjectURL(objectUrl);

    console.log('Image download initiated!');

  } catch (error: any) {
    console.error('Download failed:', error);
    // 使用英文显示错误信息
    const errorMessage = 'Download failed!';
    const corsMessage = `Could not fetch image from ${imageUrl}. This is often due to missing CORS headers (Access-Control-Allow-Origin) on the server. Check the browser console for details.`;
    const genericMessage = `Error: ${error.message}`;

    // 检查是否是网络错误或类型错误（通常与 CORS 相关）
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        alert(`${errorMessage}\n\n${corsMessage}`);
    } else {
        alert(`${errorMessage} ${genericMessage}`);
    }
  } finally {
    setIsDownloading(null); // 结束下载（无论成功或失败），清除加载状态
  }
}

// Function to format timestamp based on locale
const formatTimestamp = (timestamp: number): string => {
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

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { userId, sessionId, getToken } = useAuth();

  // API 数据状态 (用户信息)
  const [userApiInfo, setUserApiInfo] = useState<UserApiInfo | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);
  const [userInfoError, setUserInfoError] = useState<string | null>(null);

  // 图片历史记录状态
  const [historyList, setHistoryList] = useState<GenerationHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalHistoryCount, setTotalHistoryCount] = useState(0);
  const historyPageSize = 30;
  const [isDownloading, setIsDownloading] = useState<number | null>(null); // 跟踪正在下载的图片ID

  // 积分记录状态
  const [timesLogList, setTimesLogList] = useState<TimesLogItem[]>([]);
  const [isLoadingTimesLog, setIsLoadingTimesLog] = useState(false);
  const [timesLogError, setTimesLogError] = useState<string | null>(null);
  const [timesLogCurrentPage, setTimesLogCurrentPage] = useState(1);
  const [timesLogTotalPages, setTimesLogTotalPages] = useState(0);
  const [isTimesLogDialogOpen, setIsTimesLogDialogOpen] = useState(false);
  const timesLogPageSize = 10;

  // New state for generated images
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userImages, setUserImages] = useState<GeneratedImage[]>([]);

  // 友情链接状态
  const [friendlyLinks, setFriendlyLinks] = useState<FriendLink[]>([]);

  // 获取积分记录数据的函数
  const fetchTimesLog = async (page: number) => {
    if (!isLoaded || !userId) return;

    setIsLoadingTimesLog(true);
    setTimesLogError(null);
    try {
      const result = await api.user.getTimesLog(page, timesLogPageSize);

      if (result.code === 200 && result.data) {
        setTimesLogList(result.data.list || []);
        setTimesLogTotalPages(result.data.total_page || 0);
      } else {
        console.error("Failed to fetch times log:", result.msg || 'Unknown API error');
        setTimesLogList([]);
        setTimesLogTotalPages(0);
        setTimesLogError(result.msg || 'Failed to fetch times log');
      }
    } catch (error) {
      console.error("Failed to fetch times log:", error);
      setTimesLogError(error instanceof Error ? error.message : 'An unknown error occurred fetching times log');
      setTimesLogList([]);
      setTimesLogTotalPages(0);
    } finally {
      setIsLoadingTimesLog(false);
    }
  };

  // Format change type
  const formatChangeType = (changeType: string): string => {
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

  // Open points log dialog
  const handleOpenTimesLogDialog = () => {
    setIsTimesLogDialogOpen(true);
    setTimesLogCurrentPage(1);
    fetchTimesLog(1);
  };

  // Handle points log page change
  const handleTimesLogPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= timesLogTotalPages && newPage !== timesLogCurrentPage) {
      setTimesLogCurrentPage(newPage);
      fetchTimesLog(newPage);
    }
  };

  // 修改useEffect，添加userId作为依赖项以确保登录时触发
  useEffect(() => {
    // 删除修改document.title的代码，保持网站原有标题不变
  }, [isLoaded, user]);

  // 获取友情链接数据
  useEffect(() => {
    const fetchFriendlyLinks = async () => {
      try {
        const result = await api.cms.getFriendLinkList();
        if (result.code === 200 && result.success && Array.isArray(result.data)) {
          setFriendlyLinks(result.data);
        } else {
          console.warn('Failed to fetch friend links, using defaults');
          setFriendlyLinks([]);
        }
      } catch (error) {
        console.error('Failed to fetch friend links:', error);
        setFriendlyLinks([]);
      }
    };

    fetchFriendlyLinks();
  }, []); // 只在组件挂载时执行一次

  // API 调用 Effect (获取用户信息) - 添加userId监听
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isLoaded || !userId) {
        // 还未加载完成或用户未登录
        setIsLoadingUserInfo(false);
        setUserApiInfo(null);
        return;
      }

      setIsLoadingUserInfo(true);
      setUserInfoError(null);
      try {
        const result = await api.user.getUserInfo();
        if (result.code === 200 && result.data) {
          setUserApiInfo(result.data);
        } else {
          console.warn("User info API returned success code but no data");
          setUserApiInfo(null);
        }
      } catch (error) {
        console.error("Failed to fetch user API info:", error);
        setUserInfoError(error instanceof Error ? error.message : 'An unknown error occurred fetching user info');
      } finally {
        setIsLoadingUserInfo(false);
      }
    };

    fetchUserInfo();
  }, [isLoaded, userId]);

  // 修改获取作品历史记录的useEffect，移除定时器
  useEffect(() => {
    const fetchGenerationHistory = async (page: number) => {
      if (!isLoaded || !userId) {
        // 还未加载完成或用户未登录
        setIsLoadingHistory(false);
        setHistoryList([]);
        setTotalPages(0);
        setTotalHistoryCount(0);
        return;
      }

      setIsLoadingHistory(true);
      setHistoryError(null);
      try {
        const result = await api.user.getUserOpusList(page, historyPageSize);

        if (result.code === 200 && result.data) {
          setHistoryList(result.data.list || []);
          setTotalPages(result.data.total_page || 0);
          setTotalHistoryCount(result.data.count || 0);
        } else {
          console.error("Failed to fetch history:", result.msg || 'Unknown API error');
          setHistoryList([]);
          setTotalPages(0);
          setTotalHistoryCount(0);
          setHistoryError(result.msg || 'Failed to fetch generation history');
        }
      } catch (error) {
        console.error("Failed to fetch generation history:", error);
        setHistoryError(error instanceof Error ? error.message : 'An unknown error occurred fetching history');
        setHistoryList([]);
        setTotalPages(0);
        setTotalHistoryCount(0);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    // 首次加载数据
    fetchGenerationHistory(currentPage);
  }, [isLoaded, userId, currentPage]); // 使用userId替换user作为依赖项

  // 处理分页变化
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      const historySection = document.getElementById('generation-history-section');
      if (historySection) {
        historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // 添加一个刷新历史记录的函数
  const refreshHistory = () => {
    // 刷新当前页
    const fetchGenerationHistory = async (page: number) => {
      if (!isLoaded || !userId) {
        return;
      }

      setIsLoadingHistory(true);
      setHistoryError(null);
      try {
        const result = await api.user.getUserOpusList(page, historyPageSize);

        if (result.code === 200 && result.data) {
          setHistoryList(result.data.list || []);
          setTotalPages(result.data.total_page || 0);
          setTotalHistoryCount(result.data.count || 0);
        } else {
          console.error("Failed to fetch history:", result.msg || 'Unknown API error');
          setHistoryList([]);
          setTotalPages(0);
          setTotalHistoryCount(0);
          setHistoryError(result.msg || 'Failed to fetch generation history');
        }
      } catch (error) {
        console.error("Failed to fetch generation history:", error);
        setHistoryError(error instanceof Error ? error.message : 'An unknown error occurred fetching history');
        setHistoryList([]);
        setTotalPages(0);
        setTotalHistoryCount(0);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchGenerationHistory(currentPage);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow py-12 px-6">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <ReloadIcon className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
              <p className="text-gray font-inter">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow py-12 px-6">
          <div className="container mx-auto max-w-lg">
            <div className="bg-white rounded-2xl p-8 text-center shadow-custom">
              <h1 className="text-2xl font-bold mb-4 font-space-grotesk">Profile</h1>
              <p className="mb-6 text-gray font-inter">Please sign in to view your profile</p>
              <Link href="/sign-in">
                <Button className="bg-primary hover:bg-primary/90 text-white font-inter">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  // 根据 API 数据计算使用率
  const usagePercentage = userApiInfo?.total_limit && userApiInfo.total_limit > 0
    ? (userApiInfo.use_limit / userApiInfo.total_limit) * 100
    : 0;

  // 获取订阅计划名称
  const getPlanName = (vipLastTime: number | undefined) => {
    return vipLastTime && vipLastTime > 0 ? 'VIP Plan' : 'Free Plan';
  };
  const currentPlanName = getPlanName(userApiInfo?.vip_last_time);

  // Pagination items calculation
  const paginationItems = getPaginationItems(currentPage, totalPages);

  // 用户信息卡片统计项
  const stats = [
    {
      label: 'Membership Level',
      value: userApiInfo?.level && userApiInfo.level > 0 ? 'VIP Plan' : 'Free Plan',
      key: 'level',
      custom: (
        <span className="px-3 py-1 rounded-lg bg-[#232b3e] text-primary font-bold text-sm">
          {userApiInfo?.level && userApiInfo.level > 0 ? 'VIP Plan' : 'Free Plan'}
        </span>
      )
    },
    {
      label: 'Points Remaining',
      value: ((userApiInfo?.remaining_limit || 0) + (userApiInfo?.free_limit || 0)).toString(),
      key: 'points',
    },
    {
      label: 'Points Used',
      value: userApiInfo?.use_limit?.toString() || '0',
      key: 'pointsUsed',
    },
    {
      label: 'Total Points',
      value: userApiInfo?.total_limit?.toString() || '0',
      key: 'pointsTotal',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow pt-20">
        {/* 顶部用户信息卡片 */}
        <div className="container mx-auto mt-8 mb-8">
          <div className="bg-card rounded-2xl px-10 py-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-xl">
            {/* 头像 */}
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-border">
                <div className="relative w-full h-full">
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    fill
                    className="object-cover"
                    priority={false}
                    loading="lazy"
                    draggable="false"
                    unoptimized={true}
                  />
                </div>
              </div>
            </div>
            {/* 用户信息和统计 */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <span className="text-2xl font-bold text-card-foreground font-space-grotesk">{user.fullName || user.username}</span>
                <span className="text-muted-foreground text-base font-inter">{user.primaryEmailAddress?.emailAddress}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                {/* 会员等级/积分/生成数/API调用数 */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-inter">
                  <span>Membership Level</span>
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold ml-2">
                    {userApiInfo?.level && userApiInfo.level > 0 ? 'VIP Plan' : 'Free Plan'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-inter">
                  <span>Points Remaining</span>
                  <span className="font-bold ml-2 text-card-foreground">{(userApiInfo?.remaining_limit || 0) + (userApiInfo?.free_limit || 0)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-inter">
                  <span>Points Used</span>
                  <span className="font-bold ml-2 text-card-foreground">{userApiInfo?.use_limit || 0}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-inter">
                  <span>Total Points</span>
                  <span className="font-bold ml-2 text-card-foreground">{(userApiInfo?.total_limit || 0) + (userApiInfo?.free_limit || 0)}</span>
                </div>
              </div>
              {/* Points Log Button */}
              <div className="mt-4">
                <Dialog open={isTimesLogDialogOpen} onOpenChange={setIsTimesLogDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={handleOpenTimesLogDialog}
                    >
                      <span>Points Log</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Points Log</DialogTitle>
                      <DialogDescription>
                        View your points transaction history
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {isLoadingTimesLog ? (
                        <div className="text-center py-8">
                          <ReloadIcon className="animate-spin h-6 w-6 text-primary mx-auto mb-2" />
                          <p className="text-muted-foreground">Loading...</p>
                        </div>
                      ) : timesLogError ? (
                        <div className="text-center py-8 text-red-500">
                          <p>Failed to load: {timesLogError}</p>
                        </div>
                      ) : timesLogList.length > 0 ? (
                        <>
                                                     {/* Points Log List */}
                          <div className="space-y-2">
                            {timesLogList.map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium text-card-foreground">
                                      {formatChangeType(item.change_type)}
                                    </span>
                                    <span className={`font-bold ${item.use_limit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {item.use_limit > 0 ? '+' : ''}{item.use_limit}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {formatTimestamp(item.created_at)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                                                     {/* Points Log Pagination */}
                          {timesLogTotalPages > 1 && (
                            <div className="flex justify-center mt-6">
                              <Pagination>
                                <PaginationContent>
                                  <PaginationItem>
                                    <PaginationPrevious 
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleTimesLogPageChange(timesLogCurrentPage - 1);
                                      }}
                                      className={timesLogCurrentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                  </PaginationItem>
                                  
                                  {getPaginationItems(timesLogCurrentPage, timesLogTotalPages).map((item, index) => (
                                    <PaginationItem key={index}>
                                      {item === '...' ? (
                                        <PaginationEllipsis />
                                      ) : (
                                        <PaginationLink
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleTimesLogPageChange(item as number);
                                          }}
                                          isActive={item === timesLogCurrentPage}
                                        >
                                          {item}
                                        </PaginationLink>
                                      )}
                                    </PaginationItem>
                                  ))}
                                  
                                  <PaginationItem>
                                    <PaginationNext 
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleTimesLogPageChange(timesLogCurrentPage + 1);
                                      }}
                                      className={timesLogCurrentPage >= timesLogTotalPages ? 'pointer-events-none opacity-50' : ''}
                                    />
                                  </PaginationItem>
                                </PaginationContent>
                              </Pagination>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No points records yet</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Generation History 标题 - 添加刷新按钮 */}
        <div className="container mx-auto mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-primary text-2xl font-bold mb-4 font-space-grotesk">Generation History</h2>
            <Button 
              onClick={refreshHistory} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              disabled={isLoadingHistory}
            >
              {isLoadingHistory ? (
                <>
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <ReloadIcon className="h-4 w-4" />
                  <span>Refresh</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 图片历史区域 */}
        <div className="container mx-auto pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {historyList.length > 0 ? (
              historyList
                .filter(item => item.status !== -1 && item.generate_image) // 过滤掉状态为-1的作品和没有generate_image的记录
                .map((item) => (
                <div key={item.id} className="bg-card rounded-xl overflow-hidden relative flex flex-col shadow-lg border border-border">
                  {/* 下载按钮 - 只在有generate_image时才显示 */}
                  <button 
                    className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-primary p-2 rounded-full text-white transition-colors"
                    onClick={() => downloadImageWithCors(item.generate_image, `certificate-${item.id}.png`, setIsDownloading, item.id)}
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </button>
                  
                  {/* 图片内容 - 修改为完全占满区域 */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <Image
                      src={item.generate_image}
                      alt={`Generated image ${item.id}`}
                      fill
                      className="object-cover w-full h-full"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      priority={false}
                      loading="lazy"
                      draggable="false"
                      unoptimized={true}
                    />
                  </div>
                  
                  {/* 日期 - 减少内边距使其更紧凑 */}
                  <div className="px-3 py-1.5 text-xs text-muted-foreground font-inter bg-muted">
                    {formatTimestamp(item.created_at)}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-12">No images yet.</div>
            )}
          </div>
        </div>
      </main>
      <Footer friendlyLinks={friendlyLinks} />
    </div>
  );
} 