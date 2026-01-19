'use client';

import { useState, useRef, useMemo } from 'react';
import { Upload, X, Play, Download, Sparkles, Zap, Cpu, Grid3x3, ChevronDown, Trash2, Copy, History as HistoryIcon, Maximize2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useUserInfo } from '@/lib/providers';
import { useToast } from '@/components/ui/toast-provider';
import { api } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { shareToSocial } from '@/lib/share-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { InsufficientCreditsModal } from "@/components/ui/insufficient-credits-modal";
import { useAuthModal } from '@/components/auth/auth-modal-provider';
import { useUpgradeModal } from '@/components/upgrade/upgrade-modal-provider';
import { evaluatePolicy } from '@/lib/policy/evaluate';

interface FormData {
  // mode is now derived from uploadedImage
  prompt: string;
  aspectRatio: string;
  resolution: string;
  duration: number;
  uploadedImage: File | null;
  uploadedImageUrl: string;
  lastImage: File | null;
  lastImageUrl: string;
  audio: boolean;
  camerafixed: boolean;
}

interface HistoryItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  mode: 'text-to-video' | 'image-to-video';
  isGenerating?: boolean;
  progress?: number;
}

export default function Hero() {
  const { isSignedIn } = useUser();
  const { userInfo } = useUserInfo();
  const { openAuthModal } = useAuthModal();
  const { openUpgradeModal } = useUpgradeModal();
  const { success: showSuccess, error: showError, info: showInfo } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [formData, setFormData] = useState<FormData>({
    prompt: '',
    aspectRatio: '16:9',
    resolution: '480p',
    duration: 5,
    uploadedImage: null,
    uploadedImageUrl: '',
    lastImage: null,
    lastImageUrl: '',
    audio: true,
    camerafixed: false
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedTaskId, setGeneratedTaskId] = useState<string | null>(null);
  const [isEndFrameEnabled, setIsEndFrameEnabled] = useState(false);
  const [videoDisplayState, setVideoDisplayState] = useState<'demo' | 'loading' | 'result'>('demo');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isInsufficientCreditsModalOpen, setIsInsufficientCreditsModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastImageInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const demoVideoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentGeneratingIdRef = useRef<string | null>(null);

  const DEFAULT_VIDEO_URL = 'https://cfsource.seedancepro.com/source/video/tops.mp4';

  const aspectRatios = [
    { label: '16:9', value: '16:9' },
    { label: '9:16', value: '9:16' },
    { label: '4:3', value: '4:3' },
    { label: '3:4', value: '3:4' },
    { label: '1:1', value: '1:1' },
    { label: '21:9', value: '21:9' },
  ];

  const resolutions = [
    { label: '480p', value: '480p' },
    { label: '720p', value: '720p' },
    { label: '1080p', value: '1080p' },
  ];

  const durations = [
    { label: '5s', value: 5 },
    { label: '10s', value: 10 }
  ];

  // 使用 Policy 系统评估当前状态
  const policyDecision = useMemo(() => {
    if (!userInfo) {
      // 用户信息未加载，返回默认值
      return {
        voucherEligible: false,
        voucherRestricted: false,
        allowed: false,
        primaryAction: 'signin' as const,
        buttonText: 'GENERATE',
        costBadge: 'free',
        requiredCredits: 0,
      };
    }

    return evaluatePolicy({
      productId: 'seedance-1-5-pro',
      user: {
        isSignedIn: isSignedIn ?? false,
        level: userInfo.level,
        total_credits: userInfo.total_credits,
        free_times: userInfo.free_times,
      },
      form: {
        resolution: formData.resolution,
        duration: formData.duration,
        aspectRatio: formData.aspectRatio,
        mode: formData.uploadedImage ? 'image-to-video' : 'text-to-video',
        audio: formData.audio,
        camerafixed: formData.camerafixed,
      },
    });
  }, [isSignedIn, userInfo, formData.resolution, formData.duration, formData.aspectRatio, formData.uploadedImage, formData.audio, formData.camerafixed]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isLastImage = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        [isLastImage ? 'lastImage' : 'uploadedImage']: file,
        [isLastImage ? 'lastImageUrl' : 'uploadedImageUrl']: imageUrl
      }));
    }
  };

  // 下载视频函数
  const handleDownload = async () => {
    if (generatedVideoUrl) {
      setIsDownloading(true);
      try {
        const response = await fetch(generatedVideoUrl, { mode: 'cors' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = `seedance-pro-video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
        showSuccess('Video downloaded successfully!');
      } catch (error: any) {
        console.error('Download failed:', error);
        showError(`Download failed: ${error.message}`);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const removeImage = (isLastImage = false) => {
    const urlKey = isLastImage ? 'lastImageUrl' : 'uploadedImageUrl';
    if (formData[urlKey]) {
      URL.revokeObjectURL(formData[urlKey]);
    }
    setFormData(prev => ({
      ...prev,
      [isLastImage ? 'lastImage' : 'uploadedImage']: null,
      [urlKey]: ''
    }));
    if (isLastImage && lastImageInputRef.current) lastImageInputRef.current.value = '';
    if (!isLastImage && fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (isGenerating) return;

    if (!isSignedIn) {
      openAuthModal('signin');
      return;
    }

    if (!formData.prompt.trim()) {
      showError('Please enter a prompt');
      return;
    }

    const mode = formData.uploadedImage ? 'image-to-video' : 'text-to-video';

    if (mode === 'image-to-video' && !formData.uploadedImage) {
      showError('Please upload an image');
      return;
    }

    // Check user info is loaded
    if (!userInfo) {
      showError('Loading user information, please wait...');
      return;
    }

    // 使用 Policy 决策
    if (!policyDecision.allowed) {
      if (policyDecision.primaryAction === 'signin') {
        openAuthModal('signin');
        return;
      } else if (policyDecision.primaryAction === 'upgrade') {
        openUpgradeModal({
          source: 'seedance-1-5-pro',
          productId: 'seedance-1-5-pro',
          reason: policyDecision.message,
        });
        return;
      } else if (policyDecision.primaryAction === 'buyCredits') {
        setIsInsufficientCreditsModalOpen(true);
        return;
      }
      // 其他情况显示错误
      showError(policyDecision.message || '无法生成视频');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedVideoUrl(null);
    setGeneratedTaskId(null);
    setVideoDisplayState('loading');

    // Add generating placeholder to history
    const generatingPlaceholderId = `generating-${Date.now()}`;
    currentGeneratingIdRef.current = generatingPlaceholderId;
    const generatingPlaceholder: HistoryItem = {
      id: generatingPlaceholderId,
      url: '',
      prompt: formData.prompt,
      timestamp: Date.now(),
      mode: (formData.uploadedImage ? 'image-to-video' : 'text-to-video') as any,
      isGenerating: true,
      progress: 0
    };
    setHistory(prev => [generatingPlaceholder, ...prev]);

    // Fake progress - update both state and history
    const progressInterval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 90) return prev;
            const newProgress = prev + 1;
            // Update progress in history
            setHistory(prevHistory => prevHistory.map(item => 
              item.id === generatingPlaceholderId 
                ? { ...item, progress: newProgress }
                : item
            ));
            return newProgress;
        });
    }, 500);
    progressIntervalRef.current = progressInterval;

    try {
      let result;
      const mode = formData.uploadedImage ? 'image-to-video' : 'text-to-video';

      if (mode === 'text-to-video') {
        result = await api.video.seedance15TextToVideo({
          prompt: formData.prompt,
          resolution: formData.resolution,
          duration: formData.duration,
          camerafixed: formData.camerafixed,
          audio: formData.audio,
        });
      } else {
        result = await api.video.seedance15ImageToVideo({
          prompt: formData.prompt,
          resolution: formData.resolution,
          duration: formData.duration,
          image_file: formData.uploadedImage!,
          image_tail_file: formData.lastImage || undefined,
          camerafixed: formData.camerafixed,
          audio: formData.audio,
        });
      }

      if (result.code === 200 && result.data?.task_id) {
        const taskId = result.data.task_id;
        const taskResult = await api.video.pollTaskStatus(
          taskId,
          (p, statusMsg) => {
             // console.log(`Progress: ${p}, Status: ${statusMsg}`);
          }
        );
        
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setProgress(100);
        // Update final progress in history
        setHistory(prevHistory => prevHistory.map(item => 
          item.id === generatingPlaceholderId 
            ? { ...item, progress: 100 }
            : item
        ));
        setTimeout(() => {
          setGeneratedVideoUrl(taskResult.video_url);
          setGeneratedTaskId(taskId);
          setIsGenerating(false);
          setProgress(0);
          setVideoDisplayState('result');
          currentGeneratingIdRef.current = null;
          
          // Replace generating placeholder with actual video item
          const newItem: HistoryItem = {
              id: taskId,
              url: taskResult.video_url,
              prompt: formData.prompt,
              timestamp: Date.now(),
              mode: mode as any
          };
          setHistory(prev => prev.map(item => 
            item.id === generatingPlaceholderId ? newItem : item
          ));
          
          showSuccess('Video generated successfully!');
        }, 500);
      } else {
        throw new Error(result.msg || 'Generation failed');
      }
    } catch (error: any) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setIsGenerating(false);
        setProgress(0);
        setVideoDisplayState('demo');
        setGeneratedVideoUrl(null);
        setGeneratedTaskId(null);
        currentGeneratingIdRef.current = null;
        // Remove generating placeholder on error
        setHistory(prev => prev.filter(item => item.id !== generatingPlaceholderId));
        console.error(error);
        showError(error.message || 'Failed to generate video');
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content: 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-muted/30 rounded-xl border border-border/50 p-4 lg:p-6">
            
            {/* Left Column: Controls (4 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-3 overflow-y-auto pr-1 xmk-scrollbar">
                <div className="space-y-4">
                    {/* Prompt Area */}
                    <div className="space-y-1.5">
                        <Label className="text-sm text-muted-foreground">
                            Prompt <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            {!isSignedIn ? (
                                <div 
                                    onClick={() => openAuthModal('signin')}
                                    className="cursor-pointer"
                                >
                                    <Textarea 
                                        placeholder="Please enter a prompt..."
                                        className="min-h-[140px] resize-none text-sm bg-black border-border/50 cursor-pointer"
                                        value=""
                                        readOnly
                                    />
                                </div>
                            ) : (
                                <>
                                    <Textarea 
                                        placeholder="Please enter a prompt..."
                                        className="min-h-[140px] resize-none text-sm bg-black border-border/50"
                                        value={formData.prompt}
                                        onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                                        maxLength={2000}
                                    />
                                    <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground">
                                        {formData.prompt.length}/2000
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                         {!formData.uploadedImageUrl ? (
                             <>
                                 <div className="flex items-center justify-between mb-1">
                                     <Label className="text-sm font-semibold text-muted-foreground">Image Upload (Optional)</Label>
                                 </div>
                                 {!isSignedIn ? (
                                     <div 
                                         onClick={() => openAuthModal('signin')}
                                         className="border border-dashed border-border rounded-lg p-3 text-center hover:bg-black/60 transition-colors cursor-pointer bg-black/80 min-h-24 flex items-center justify-center flex-col"
                                     >
                                         <Upload className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                                         <p className="text-xs text-muted-foreground">Click to upload</p>
                                     </div>
                                 ) : (
                                     <div 
                                         onClick={() => fileInputRef.current?.click()}
                                         className="border border-dashed border-border rounded-lg p-3 text-center hover:bg-black/60 transition-colors cursor-pointer bg-black/80 min-h-24 flex items-center justify-center flex-col"
                                     >
                                         <Upload className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                                         <p className="text-xs text-muted-foreground">Click to upload</p>
                                     </div>
                                 )}
                             </>
                         ) : (
                             <div className="flex items-start gap-2">
                                 {/* First Image Preview */}
                                 <div className="flex-1 flex flex-col gap-1">
                                     <Label className="text-xs text-muted-foreground truncate whitespace-nowrap">Image Upload (Optional)</Label>
                                     <div className="relative rounded-lg overflow-hidden min-h-24 max-h-24 group border border-border bg-black/80 flex items-center justify-center p-2">
                                         <img src={formData.uploadedImageUrl} alt="Upload" className="max-w-full max-h-24 w-auto h-auto object-contain" />
                                         <button 
                                             onClick={() => removeImage()}
                                             className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                         >
                                             <X className="h-3 w-3" />
                                         </button>
                                     </div>
                                 </div>
                                 
                                 {/* End Frame Upload - Only show when first image is uploaded */}
                                 <div className="flex-1 flex flex-col gap-1">
                                     <Label className="text-xs text-muted-foreground truncate whitespace-nowrap">End Frame (Optional)</Label>
                                    {!formData.lastImageUrl ? (
                                        <div 
                                            onClick={() => lastImageInputRef.current?.click()}
                                            className="border border-dashed border-border rounded-lg p-3 text-center hover:bg-black/60 transition-colors cursor-pointer bg-black/80 min-h-24 flex items-center justify-center flex-col"
                                        >
                                            <Upload className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                                            <p className="text-xs text-muted-foreground">Click to upload</p>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-lg overflow-hidden min-h-24 max-h-24 group border border-border bg-black/80 flex items-center justify-center p-2">
                                            <img src={formData.lastImageUrl} alt="End Frame" className="max-w-full max-h-24 w-auto h-auto object-contain" />
                                            <button 
                                                onClick={() => removeImage(true)}
                                                className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e)} />
                        <input ref={lastImageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, true)} />
                    </div>

                    <div className="space-y-3 pt-2 border-t border-border/50">
                        <div className="space-y-1.5">
                            <Label className="text-sm text-muted-foreground">Video Version (Resolution)</Label>
                            <Select 
                                value={formData.resolution}
                                onValueChange={(val: string) => setFormData(prev => ({ ...prev, resolution: val }))}
                            >
                                <SelectTrigger className="w-full h-8 text-xs bg-card">
                                    <SelectValue placeholder="Select resolution" />
                                </SelectTrigger>
                                <SelectContent>
                                    {resolutions.map(r => <SelectItem key={r.value} value={r.value} className="text-xs">{r.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {policyDecision.voucherEligible && policyDecision.voucherRestricted && formData.resolution !== '480p' && (
                                <p className="text-[10px] text-muted-foreground/70 mt-1">Free voucher only supports 480p</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm text-muted-foreground">Video Duration</Label>
                            <Select
                                value={String(formData.duration)}
                                onValueChange={(val: string) => setFormData(prev => ({ ...prev, duration: Number(val) }))}
                            >
                                <SelectTrigger className="w-full h-8 text-xs bg-card">
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {durations.map(r => <SelectItem key={r.value} value={String(r.value)} className="text-xs">{r.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {policyDecision.voucherEligible && policyDecision.voucherRestricted && formData.duration !== 5 && (
                                <p className="text-[10px] text-muted-foreground/70 mt-1">Free voucher only supports 5s</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm text-muted-foreground">Aspect Ratio</Label>
                            <Select
                                value={formData.aspectRatio}
                                onValueChange={(val: string) => setFormData(prev => ({ ...prev, aspectRatio: val }))}
                            >
                                <SelectTrigger className="w-full h-8 text-xs bg-card">
                                    <SelectValue placeholder="Select ratio" />
                                </SelectTrigger>
                                <SelectContent>
                                    {aspectRatios.map(r => <SelectItem key={r.value} value={r.value} className="text-xs">{r.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="pt-2 border-t border-border/50">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 flex-1">
                                    <Label className="text-sm text-muted-foreground">Audio</Label>
                                    <Switch
                                        checked={formData.audio}
                                        onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, audio: checked }))}
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-1">
                                    <Label className="text-sm text-muted-foreground">Camera Fixed</Label>
                                    <Switch
                                        checked={formData.camerafixed}
                                        onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, camerafixed: checked }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-4 sticky bottom-0 backdrop-blur py-2">
                    <Button 
                        className={cn(
                            "w-full h-10 text-sm font-semibold transition-all",
                            policyDecision.primaryAction === 'upgrade'
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500"
                                : "bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
                        )}
                        onClick={() => {
                            if (policyDecision.primaryAction === 'signin') {
                                openAuthModal('signin');
                            } else if (policyDecision.primaryAction === 'upgrade') {
                                openUpgradeModal({
                                    source: 'seedance-1-5-pro',
                                    productId: 'seedance-1-5-pro',
                                    reason: policyDecision.message,
                                });
                            } else if (policyDecision.primaryAction === 'buyCredits') {
                                setIsInsufficientCreditsModalOpen(true);
                            } else if (policyDecision.primaryAction === 'generate') {
                                handleGenerate();
                            }
                        }}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                {policyDecision.buttonText} <span className="ml-2 px-1.5 py-0.5 bg-background/20 rounded text-[10px]">
                                    {policyDecision.costBadge === 'free' ? 'free' : policyDecision.costBadge}
                                </span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Middle Column: Preview (7 cols) */}
            <div className="lg:col-span-7 bg-black rounded-xl overflow-hidden relative border border-border/20 shadow-xl flex flex-col h-full aspect-square lg:aspect-auto">
                <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
                    {/* Demo State - Default */}
                    {videoDisplayState === 'demo' && (
                        <div className="relative w-full h-full flex flex-col">
                            {/* Video Container */}
                            <div className="relative flex-1 min-h-0">
                                <video
                                    ref={demoVideoRef}
                                    className="w-full h-full object-cover"
                                    loop
                                    muted
                                    controls
                                    playsInline
                                    preload="metadata"
                                    poster='https://cysource.xmk.com/static/xmk15.png'
                                >
                                    <source src='https://cysource.xmk.com/static/xmk15.mp4' type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            {/* Demo Title - Bottom */}
                            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 mx-4 mb-4 flex-shrink-0">
                                <div className="text-white text-sm font-bold text-center">Seedance 1.5 Pro introduces breakthrough narrative understanding and cinematic generation capability. With physics-accurate motion, consistent subjects, and multi-shot storytelling.</div>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {videoDisplayState === 'loading' && (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center text-gray-200">
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 border-4 border-purple-200 rounded-full mx-auto"></div>
                                    <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                                </div>
                                <p className="text-xl font-medium mb-6 text-gray-100">Generating your video...</p>
                                <div className="w-80 bg-gray-600 rounded-full h-3 mx-auto shadow-inner">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-primary h-3 rounded-full transition-all duration-300 shadow-lg"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm mt-4 text-gray-300 font-medium">{Math.round(progress)}% complete</p>
                                <div className="mt-6 flex justify-center space-x-2">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Result State */}
                    {videoDisplayState === 'result' && generatedVideoUrl && (
                        <div className="relative w-full h-full flex flex-col">
                            <div className="relative w-full flex-1 min-h-0 overflow-hidden">
                                <video
                                    key={generatedVideoUrl}
                                    ref={videoRef}
                                    className="w-full h-full object-contain"
                                    loop
                                    controls
                                    preload="metadata"
                                >
                                    <source src={generatedVideoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            {/* Download and Share Buttons */}
                            <div className="flex gap-2 justify-center items-center p-4 bg-gradient-to-t from-gray-900/90 to-gray-900/50 backdrop-blur-sm flex-shrink-0">
                                {/* Download Button */}
                                <Button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDownloading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Downloading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4" />
                                            <span>Download</span>
                                        </>
                                    )}
                                </Button>

                                {/* Share Buttons */}
                                {generatedTaskId && (
                                    <>
                                        {/* Twitter */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => shareToSocial(generatedTaskId, 'twitter')}
                                            title="Share to Twitter"
                                            className="p-2 text-white/70 hover:text-white hover:bg-[#1DA1F2] rounded-full"
                                        >
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                            </svg>
                                        </Button>

                                        {/* Facebook */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => shareToSocial(generatedTaskId, 'facebook')}
                                            title="Share to Facebook"
                                            className="p-2 text-white/70 hover:text-white hover:bg-[#1877F2] rounded-full"
                                        >
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                        </Button>

                                        {/* WhatsApp */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => shareToSocial(generatedTaskId, 'whatsapp')}
                                            title="Share to WhatsApp"
                                            className="p-2 text-white/70 hover:text-white hover:bg-[#25D366] rounded-full"
                                        >
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                            </svg>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: History (2 cols) */}
            <div className="lg:col-span-2 flex flex-col h-full overflow-hidden border-l-0 lg:border-l border-border/40 pl-0 lg:pl-2">
                <div className="mb-4 px-2">
                    <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                        <HistoryIcon className="h-4 w-4" /> Video History
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto lg:overflow-y-auto overflow-x-auto lg:overflow-x-visible flex flex-row lg:flex-col space-x-3 lg:space-x-0 space-y-0 lg:space-y-3 pr-2 xmk-scrollbar">
                    {history.length === 0 ? (
                         <div className="text-center py-10 text-muted-foreground/50 min-w-full lg:min-w-0">
                             <p className="text-xs">No history yet</p>
                         </div>
                    ) : (
                        history.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => {
                                    if (item.isGenerating) {
                                        // Restore progress from history
                                        const savedProgress = item.progress || 0;
                                        setProgress(savedProgress);
                                        setVideoDisplayState('loading');
                                        
                                        // If this is the currently generating item, continue the progress
                                        if (item.id === currentGeneratingIdRef.current && !progressIntervalRef.current) {
                                            const progressInterval = setInterval(() => {
                                                setProgress(prev => {
                                                    if (prev >= 90) return prev;
                                                    const newProgress = prev + 1;
                                                    // Update progress in history
                                                    setHistory(prevHistory => prevHistory.map(historyItem => 
                                                      historyItem.id === item.id 
                                                        ? { ...historyItem, progress: newProgress }
                                                        : historyItem
                                                    ));
                                                    return newProgress;
                                                });
                                            }, 500);
                                            progressIntervalRef.current = progressInterval;
                                        }
                                    } else {
                                        // Clear any existing progress when switching to a completed video
                                        if (progressIntervalRef.current) {
                                            clearInterval(progressIntervalRef.current);
                                            progressIntervalRef.current = null;
                                        }
                                        setProgress(0);
                                        setGeneratedVideoUrl(item.url);
                                        setGeneratedTaskId(item.id);
                                        setVideoDisplayState('result');
                                    }
                                }}
                                className={cn(
                                    "group cursor-pointer rounded-lg border border-border/40 overflow-hidden hover:border-primary/50 transition-all bg-card shadow-sm flex-shrink-0 w-[200px] lg:w-auto",
                                    item.isGenerating && videoDisplayState === 'loading' ? "ring-2 ring-primary border-primary" : 
                                    generatedVideoUrl === item.url && videoDisplayState === 'result' ? "ring-2 ring-primary border-primary" : ""
                                )}
                            >
                                <div className="aspect-video relative bg-black/5">
                                    {item.isGenerating ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800">
                                            <div className="text-center">
                                                <div className="relative mb-3">
                                                    <div className="w-12 h-12 border-4 border-primary/30 rounded-full mx-auto"></div>
                                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                                                </div>
                                                <p className="text-xs text-primary font-medium">Generating...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <video src={item.url} className="w-full h-full object-cover pointer-events-none" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <Play className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md fill-white/20" />
                                            </div>
                                            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">
                                                {item.mode === 'text-to-video' ? 'T2V' : 'I2V'}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="p-2">
                                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                                        {item.prompt}
                                    </p>
                                    <p className="text-[9px] text-muted-foreground/40 mt-1">
                                        {item.isGenerating ? 'Generating...' : new Date(item.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
      </div>

      {/* Insufficient Credits Modal */}
      <InsufficientCreditsModal
        isOpen={isInsufficientCreditsModalOpen}
        onClose={() => setIsInsufficientCreditsModalOpen(false)}
        requiredCredits={policyDecision.requiredCredits || 0}
        currentCredits={userInfo?.total_credits || 0}
      />
    </div>
  );
}

