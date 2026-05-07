import { redirect } from "next/navigation";
import { getDefaultCyRoute } from "@/components/cy/registry";

export default function CyIndexPage() {
  redirect(getDefaultCyRoute());
}
