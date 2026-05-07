import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";

export interface ComparisonTableCase1Data {
  decorIndex: string;
  kicker: string;
  sectionTitle: string;
  subtitle: string;
  titleLayout?: CyTitleLayoutId;
  /** 表头，含首列「功能」与后续各产品列 */
  columnHeaders: string[];
  /** 每行长度须与 `columnHeaders.length` 一致 */
  rows: string[][];
}
