// import { Navbar } from '../components/Navbar'; // Navbar is now in root layout

import PricingSection from '../components/PricingSection';
import { Footer } from '../components/Footer';
import { serverCmsApi, FriendLink } from '../lib/server-api';
import { GoogleOneTapAuth } from '../components/auth';
// 启用ISR，每小时重新验证数据



export default function Home() {


  return (
    <div className="min-h-screen flex flex-col">
      {/* Google One Tap 组件 - 只在用户未登录时显示 */}
      {/* <GoogleOneTapAuth
        cancelOnTapOutside={true}
        signInForceRedirectUrl="/"
        signUpForceRedirectUrl="/"
      /> */}
      <main className="flex-grow">
      
      </main>
      <Footer />
    </div>
  );
}
