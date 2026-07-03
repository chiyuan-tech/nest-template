'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { Footer } from '../../components/Footer';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
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
import { ReloadIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { api } from '@/lib/api';
import { 
  PayLogDialog, 
  PointsLogDialog, 
  SubscriptionsDialog, 
  InvoiceDialog, 
  VideoDetailDialog 
} from '@/components/profile';
import { 
  FriendLink, 
  UserApiInfo, 
  GenerationHistoryItem 
} from '@/components/profile/types';
import { 
  groupHistoryByDate, 
  getPaginationItems, 
  formatTimestamp,
  isVideoFile,
  isImageFile
} from '@/components/profile/utils';

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { userId } = useAuth();

  // API 鏁版嵁鐘舵€?(鐢ㄦ埛淇℃伅)
  const [userApiInfo, setUserApiInfo] = useState<UserApiInfo | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);
  const [userInfoError, setUserInfoError] = useState<string | null>(null);

  // 鍥剧墖鍘嗗彶璁板綍鐘舵€?
  const [historyList, setHistoryList] = useState<GenerationHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalHistoryCount, setTotalHistoryCount] = useState(0);
  const historyPageSize = 16;
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);

  // 鍙嬫儏閾炬帴鐘舵€?
  const [friendlyLinks, setFriendlyLinks] = useState<FriendLink[]>([]);

  // 瀵硅瘽妗嗙姸鎬?
  const [isPayLogDialogOpen, setIsPayLogDialogOpen] = useState(false);
  const [isTimesLogDialogOpen, setIsTimesLogDialogOpen] = useState(false);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [selectedPayLogId, setSelectedPayLogId] = useState<number | null>(null);
  const [payLogList, setPayLogList] = useState<any[]>([]);

  // 瑙嗛璇︽儏寮圭獥鐘舵€?
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedVideoDetail, setSelectedVideoDetail] = useState<GenerationHistoryItem | null>(null);

  // 鎵撳紑鍙戠エ寮圭獥
  const handleOpenInvoiceDialog = (payLogId: number) => {
    setSelectedPayLogId(payLogId);
    setIsInvoiceDialogOpen(true);
  };

  // 鑾峰彇鏀粯璁板綍锛堢敤浜庡彂绁ㄥ璇濇锛?
  const fetchPayLogForInvoice = async () => {
    if (!isLoaded || !userId) return;
    try {
      const result = await api.user.getPayLog(1, 100); // 鑾峰彇瓒冲鐨勬暟鎹敤浜庡彂绁?
      if (result.code === 200 && result.data) {
        setPayLogList(result.data.list || []);
      }
    } catch (error) {
      console.error('Failed to fetch pay log for invoice:', error);
    }
  };

  // 淇敼useEffect锛屾坊鍔爑serId浣滀负渚濊禆椤逛互纭繚鐧诲綍鏃惰Е鍙?
  useEffect(() => {
    // 鍒犻櫎淇敼document.title鐨勪唬鐮侊紝淇濇寔缃戠珯鍘熸湁鏍囬涓嶅彉
  }, [isLoaded, user]);

  // 鑾峰彇鍙嬫儏閾炬帴鏁版嵁
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
  }, []); // 鍙湪缁勪欢鎸傝浇鏃舵墽琛屼竴娆?

  // API 璋冪敤 Effect (鑾峰彇鐢ㄦ埛淇℃伅) - 娣诲姞userId鐩戝惉
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isLoaded || !userId) {
        // 杩樻湭鍔犺浇瀹屾垚鎴栫敤鎴锋湭鐧诲綍
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

  // 淇敼鑾峰彇浣滃搧鍘嗗彶璁板綍鐨剈seEffect锛岀Щ闄ゅ畾鏃跺櫒
  useEffect(() => {
    const fetchGenerationHistory = async (page: number) => {
      if (!isLoaded || !userId) {
        // 杩樻湭鍔犺浇瀹屾垚鎴栫敤鎴锋湭鐧诲綍
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

    // 棣栨鍔犺浇鏁版嵁
    fetchGenerationHistory(currentPage);
  }, [isLoaded, userId, currentPage]); // 浣跨敤userId鏇挎崲user浣滀负渚濊禆椤?

  // Auto-refresh effect - 姣?0绉掕嚜鍔ㄥ埛鏂颁竴娆?
  useEffect(() => {
    if (!isLoaded || !userId) return;

    const startAutoRefresh = () => {
      if (autoRefreshRef.current) return; // 宸插瓨鍦ㄥ垯涓嶉噸澶嶅垱寤?
      autoRefreshRef.current = setInterval(() => {
        // 闈欓粯鍒锋柊锛屼笉鏄剧ずloading鐘舵€?
        const fetchGenerationHistory = async (page: number) => {
          try {
            const result = await api.user.getUserOpusList(page, historyPageSize);
            if (result.code === 200 && result.data) {
              setHistoryList(result.data.list || []);
              setTotalPages(result.data.total_page || 0);
              setTotalHistoryCount(result.data.count || 0);
            }
          } catch (error) {
            console.error("Auto-refresh failed:", error);
          }
        };
        fetchGenerationHistory(currentPage);
      }, 30000); // 30绉?
    };

    const stopAutoRefresh = () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
        autoRefreshRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoRefresh();
      } else {
        startAutoRefresh();
      }
    };

    startAutoRefresh();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 娓呯悊锛氶〉闈㈠嵏杞芥垨璺敱鍙樻洿鏃跺仠姝㈣疆璇㈠苟绉婚櫎鐩戝惉
    return () => {
      stopAutoRefresh();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLoaded, userId, currentPage]);

  // 澶勭悊鍒嗛〉鍙樺寲
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      const historySection = document.getElementById('generation-history-section');
      if (historySection) {
        historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };


  // 鎵撳紑瑙嗛璇︽儏寮圭獥
  const handleOpenDetailDialog = (item: GenerationHistoryItem) => {
    setSelectedVideoDetail(item);
    setIsDetailDialogOpen(true);
  };

  // 鍒锋柊鍘嗗彶璁板綍
  const refreshHistory = () => {
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
            <div className="rounded border border-border bg-card p-8 text-center shadow-custom">
              <h1 className="text-2xl font-bold mb-4 text-card-foreground">Profile</h1>
              <p className="mb-6 text-muted-foreground">Please sign in to view your profile</p>
              <Link href="/sign-in">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
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

  // 鏍规嵁 API 鏁版嵁璁＄畻浣跨敤鐜?
  const usagePercentage = userApiInfo?.total_limit && userApiInfo.total_limit > 0
    ? (userApiInfo.use_limit / userApiInfo.total_limit) * 100
    : 0;

  // 鑾峰彇鐢ㄦ埛绛夌骇鍚嶇О
  const getUserLevelName = (level: number | undefined) => {
    switch (level) {
      case 0: return 'Free';
      case 1: return 'Starter';
      case 2: return 'Pro';
      case 3: return 'Ultimate';
      case 4: return 'Enterprise';
      default: return 'Free';
    }
  };
  const userLevelName = getUserLevelName(userApiInfo?.level);

  // Pagination items calculation
  const paginationItems = getPaginationItems(currentPage, totalPages);

  // Grouped history by date
  const groupedHistory = groupHistoryByDate(historyList);

  // 鐢ㄦ埛淇℃伅鍗＄墖缁熻椤?
  const stats = [
    {
      label: 'Membership Level',
      value: userLevelName,
      key: 'level',
      custom: (
        <span className="px-3 py-1 rounded-lg bg-[#232b3e] text-primary font-bold text-sm">
          {userLevelName}
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
        {/* 椤堕儴鐢ㄦ埛淇℃伅鍗＄墖 */}
        <div className="container mx-auto mt-8 mb-8">
          <div className="flex flex-col items-center gap-8 rounded bg-card px-10 py-8 shadow-sm md:flex-row md:items-start">
            {/* 澶村儚 */}
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
            {/* 鐢ㄦ埛淇℃伅鍜岀粺璁?*/}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <span className="text-2xl font-bold text-card-foreground">{user.fullName || user.username}</span>
                <span className="text-muted-foreground text-base">{user.primaryEmailAddress?.emailAddress}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                {/* 浼氬憳绛夌骇/绉垎/鐢熸垚鏁?API璋冪敤鏁?*/}
                <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground">
                  <span>Membership Level</span>
                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 font-bold text-primary">
                    {userLevelName}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground">
                  <span>Points Remaining</span>
                  <span className="font-bold ml-2 text-card-foreground">{(userApiInfo?.remaining_limit || 0) + (userApiInfo?.free_limit || 0)}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground">
                  <span>Points Used</span>
                  <span className="font-bold ml-2 text-card-foreground">{userApiInfo?.use_limit || 0}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground">
                  <span>Total Points</span>
                  <span className="font-bold ml-2 text-card-foreground">{(userApiInfo?.total_limit || 0) + (userApiInfo?.free_limit || 0)}</span>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Dialog open={isPayLogDialogOpen} onOpenChange={setIsPayLogDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 rounded-full border-border bg-card/50 hover:bg-card/80 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md px-4 py-2"
                      onClick={() => {
                        setIsPayLogDialogOpen(true);
                        fetchPayLogForInvoice();
                      }}
                    >
                      <span className="text-card-foreground">Pay Log</span>
                    </Button>
                  </DialogTrigger>
                  <PayLogDialog
                    open={isPayLogDialogOpen}
                    onOpenChange={setIsPayLogDialogOpen}
                    onOpenInvoiceDialog={handleOpenInvoiceDialog}
                  />
                </Dialog>
                <Dialog open={isTimesLogDialogOpen} onOpenChange={setIsTimesLogDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 rounded-full border-border bg-card/50 hover:bg-card/80 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md px-4 py-2"
                      onClick={() => setIsTimesLogDialogOpen(true)}
                    >
                      <span className="text-card-foreground">Points Log</span>
                    </Button>
                  </DialogTrigger>
                  <PointsLogDialog
                    open={isTimesLogDialogOpen}
                    onOpenChange={setIsTimesLogDialogOpen}
                  />
                </Dialog>
                <Dialog open={isSubscriptionDialogOpen} onOpenChange={setIsSubscriptionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 rounded-full border-border bg-card/50 hover:bg-card/80 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md px-4 py-2"
                      onClick={() => setIsSubscriptionDialogOpen(true)}
                    >
                      <span className="text-card-foreground">Subscriptions</span>
                    </Button>
                  </DialogTrigger>
                  <SubscriptionsDialog
                    open={isSubscriptionDialogOpen}
                    onOpenChange={setIsSubscriptionDialogOpen}
                  />
                </Dialog>

              </div>
            </div>
          </div>
        </div>

        {/* Generation History 鏍囬 - 娣诲姞鍒锋柊鎸夐挳 */}
        <div className="container mx-auto mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-primary text-2xl font-bold mb-4">Video Generation History</h2>
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
          <p className="text-muted-foreground text-sm mt-2">
            Works are retained for 6 months. Please download and save promptly.
          </p>
        </div>

        {/* 瑙嗛鍘嗗彶鍖哄煙锛堟寜鏃ユ湡鍒嗙粍锛?*/}
        <div className="container mx-auto pb-16">
          {historyList.length > 0 ? (
            <div className="space-y-8">
              {groupedHistory.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-4">
                  {/* 鏃ユ湡鏍囬 */}
                  <h3 className="text-xl font-semibold text-card-foreground border-b border-border pb-2">
                    {group.date}
                  </h3>
                  {/* 鍒嗙粍鍐呯綉鏍?*/}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {group.items
                      .filter(item => item.status === 0 || item.status === 1 || (item.status === -1 && item.generate_image === ''))
                      .map((item) => {
                        const isFailed = item.status === -1 && item.generate_image === '';
                        const isGenerating = item.status === 0 && item.generate_image === '';
                        const getModelName = (sizeImage: string) => {
                          const modelMatch = sizeImage.match(/Model:\s*([^;]+)/);
                          return modelMatch ? modelMatch[1].trim() : null;
                        };
                        const getResolution = (sizeImage: string) => {
                          // 鍖归厤 resolution: 鍚庨潰鐨勫唴瀹癸紝鐩村埌閬囧埌涓嬩竴涓瓧娈垫垨瀛楃涓茬粨鏉?
                          const resolutionMatch = sizeImage.match(/resolution:\s*([^\s;]+)/i);
                          return resolutionMatch ? resolutionMatch[1].trim() : null;
                        };
                        const modelName = item.size_image ? getModelName(item.size_image) : null;
                        const resolution = item.size_image ? getResolution(item.size_image) : null;
                        return (
                          <div 
                            key={item.id} 
                            className={`relative flex flex-col overflow-hidden rounded border border-border bg-card shadow-sm transition-all duration-200 ${!isFailed && !isGenerating ? 'cursor-pointer hover:border-primary/50 hover:shadow-xl' : ''}`}
                            onClick={() => {
                              if (!isFailed && !isGenerating) {
                                handleOpenDetailDialog(item);
                              }
                            }}
                          >
                            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                              {modelName && (
                                <div className="bg-primary/90 hover:bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold shadow-lg backdrop-blur-sm">
                                  Model: {modelName}
                                </div>
                              )}
                              {resolution && (
                                <div className="bg-emerald-500/90 hover:bg-emerald-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg backdrop-blur-sm">
                                  Resolution: {resolution}
                                </div>
                              )}
                            </div>
                            {!isFailed && !isGenerating && (
                              <button
                                className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-primary p-2 rounded-full text-white transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDetailDialog(item);
                                }}
                                title="View Details"
                              >
                                <EyeOpenIcon className="h-4 w-4" />
                              </button>
                            )}
                            <div className="relative w-full aspect-video overflow-hidden">
                              {isFailed ? (
                                <div className="w-full h-full bg-gradient-to-br from-red-500/10 to-red-600/20 flex flex-col items-center justify-center border-2 border-dashed border-red-300/50">
                                  <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                      <span className="text-red-400 text-2xl">鈿狅笍</span>
                                    </div>
                                    <p className="text-red-400 font-semibold text-sm mb-1">Generation Failed</p>
                                    <p className="text-red-300/70 text-xs">Please try again</p>
                                  </div>
                                </div>
                              ) : isGenerating ? (
                                  <div className="flex h-full w-full flex-col items-center justify-center border-2 border-dashed border-primary/50 bg-muted/40">
                                  <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                      <ReloadIcon className="h-6 w-6 text-primary animate-spin" />
                                    </div>
                                    <p className="text-primary font-semibold text-sm mb-1">Generating...</p>
                                    <p className="text-primary/70 text-xs">Please wait</p>
                                  </div>
                                </div>
                              ) : isVideoFile(item.generate_image) ? (
                                <video
                                  src={item.generate_image}
                                  muted
                                  preload="metadata"
                                  className="w-full h-full pointer-events-none object-cover"
                                  playsInline
                                  disablePictureInPicture
                                >
                                  Your browser does not support the video tag.
                                </video>
                              ) : isImageFile(item.generate_image) ? (
                                <Image
                                  src={item.generate_image}
                                  alt={`Generated content ${item.id}`}
                                  fill
                                  className="object-cover pointer-events-none"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <p className="text-muted-foreground text-sm">Unsupported media type</p>
                                </div>
                              )}
                            </div>
                            <div className="px-3 py-1.5 text-xs text-muted-foreground bg-muted">
                              {formatTimestamp(item.created_at)}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">No videos yet.</div>
          )}

          {/* 鍒嗛〉缁勪欢 */}
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {paginationItems.map((item, index) => (
                  <PaginationItem key={index}>
                    {item === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(item as number);
                        }}
                        isActive={item === currentPage}
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
                      handlePageChange(currentPage + 1);
                    }}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>


        {/* 鍙戠エ瀵硅瘽妗?*/}
        <InvoiceDialog
          open={isInvoiceDialogOpen}
          onOpenChange={setIsInvoiceDialogOpen}
          payLogId={selectedPayLogId}
          payLogList={payLogList}
        />

        {/* 瑙嗛璇︽儏瀵硅瘽妗?*/}
        <VideoDetailDialog
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          videoDetail={selectedVideoDetail}
          onDeleteSuccess={refreshHistory}
        />
      </main>
      <Footer friendlyLinks={friendlyLinks} />
    </div>
  );
} 
