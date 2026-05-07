/** Legacy case route — see cy_templeate + npm run cy. Data key: faq_case1 */
import { FaqCase1 } from "@/components/cy/FAQ/faq_case1";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import type { FaqCase1Data } from "@/components/cy/FAQ/types";

export default function Page() {
  const data = cyModulesConfig.faq_case1 as FaqCase1Data;
  return <FaqCase1 data={data} />;
}
