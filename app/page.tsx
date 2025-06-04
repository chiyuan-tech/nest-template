// import { Navbar } from '../components/Navbar'; // Navbar is now in root layout

import PricingSection from '../components/PricingSection';
import { Footer } from '../components/Footer';
import { serverCmsApi, FriendLink } from '../lib/server-api';

// 启用ISR，每60秒重新验证数据
export const revalidate = 60;

// 默认友情链接数据（当API失败或返回空数据时使用）
const defaultFriendLinks: FriendLink[] = [
  { id: 1, url: 'https://www.framepola.com', name: 'AI Polaroid', is_bright: 1, desc: '', image: '', web_type: 1, sort: 1, appid: 'ai_video', created_time: Date.now() },
  { id: 2, url: 'https://www.ghiblimagicmaker.com', name: 'GhibliImage', is_bright: 1, desc: '', image: '', web_type: 1, sort: 2, appid: 'ai_video', created_time: Date.now() },
  { id: 3, url: 'https://www.imagefusionai.com', name: 'AI Image Fusion', is_bright: 1, desc: '', image: '', web_type: 1, sort: 3, appid: 'ai_video', created_time: Date.now() },
  { id: 4, url: 'https://www.ghiblitattoo.com', name: 'GhibliTattoo', is_bright: 1, desc: '', image: '', web_type: 1, sort: 4, appid: 'ai_video', created_time: Date.now() },
  { id: 5, url: 'https://www.aioutfitgen.com', name: 'OutfitAI', is_bright: 1, desc: '', image: '', web_type: 1, sort: 5, appid: 'ai_video', created_time: Date.now() },
  { id: 6, url: 'https://www.girlaniai.com', name: 'Girl Cool Anime Wallpaper', is_bright: 1, desc: '', image: '', web_type: 1, sort: 6, appid: 'ai_video', created_time: Date.now() },
  { id: 7, url: 'https://www.4oimagex.com', name: '4o lmage X', is_bright: 1, desc: '', image: '', web_type: 1, sort: 7, appid: 'ai_video', created_time: Date.now() },
  { id: 8, url: 'https://www.invictgen.com', name: 'Invincible Title Card Generator', is_bright: 1, desc: '', image: '', web_type: 1, sort: 8, appid: 'ai_video', created_time: Date.now() },
  { id: 9, url: 'https://www.aibabytalk.com', name: 'ai baby podcast', is_bright: 1, desc: '', image: '', web_type: 1, sort: 9, appid: 'ai_video', created_time: Date.now() },
  { id: 10, url: 'https://www.pencilartai.com', name: 'PencilArtMagic', is_bright: 1, desc: '', image: '', web_type: 1, sort: 10, appid: 'ai_video', created_time: Date.now() },
  { id: 11, url: 'https://www.quickmedcert.com', name: 'QuickMedCert', is_bright: 1, desc: '', image: '', web_type: 1, sort: 11, appid: 'ai_video', created_time: Date.now() },
  { id: 12, url: 'https://www.imginpaint.com', name: 'AiInpainting', is_bright: 1, desc: '', image: '', web_type: 1, sort: 12, appid: 'ai_video', created_time: Date.now() },
  { id: 13, url: 'https://www.xbgremove.com', name: 'EraseBG', is_bright: 1, desc: '', image: '', web_type: 1, sort: 13, appid: 'ai_video', created_time: Date.now() },
  { id: 14, url: 'https://www.aithumbgen.com', name: 'AiThumbGen', is_bright: 1, desc: '', image: '', web_type: 1, sort: 14, appid: 'ai_video', created_time: Date.now() },
  { id: 15, url: 'https://www.genbabyname.com', name: 'NamiGenie', is_bright: 1, desc: '', image: '', web_type: 1, sort: 15, appid: 'ai_video', created_time: Date.now() },
];

export default async function Home() {
  // 获取友情链接数据，如果为空则使用默认数据
  let friendlyLinks = await serverCmsApi.getFriendLinkList();
  
  // 如果API返回空数据或失败，使用默认数据
  if (!friendlyLinks || friendlyLinks.length === 0) {
    console.log('Using default friend links as fallback');
    friendlyLinks = defaultFriendLinks;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <PricingSection />
      </main>
      <Footer friendlyLinks={friendlyLinks} />
    </div>
  );
}
