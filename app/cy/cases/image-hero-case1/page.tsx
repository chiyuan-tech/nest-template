/** Legacy case route — see cy_templeate + npm run cy. Data key: imageHero_case1 */
import { ImageHeroCase1 } from "@/components/cy/HeroSection/image/imageHero_case1";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import type { ImageHeroData } from "@/components/cy/HeroSection/image/types";

export default function Page() {
  const data = cyModulesConfig.imageHero_case1 as ImageHeroData;
  return <ImageHeroCase1 data={data} />;
}
