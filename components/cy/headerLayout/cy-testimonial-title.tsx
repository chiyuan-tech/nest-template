"use client";

import type { ReactNode } from "react";
import type {
  TestimonialGridCase1Data,
  TestimonialGridCase2Data,
  TestimonialGridCase3Data,
} from "@/components/cy/UsersSay/types";
import type { CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";
import { HeaderVertical } from "@/components/cy/headerLayout/common/headerVertical";
import { HomeSplitHeader } from "@/components/cy/headerLayout/common/homeSplitHeader";

type Case1TitleFields =
  | Pick<TestimonialGridCase1Data, "decorIndex" | "kicker" | "sectionTitle" | "subtitle">
  | Pick<TestimonialGridCase3Data, "decorIndex" | "kicker" | "sectionTitle" | "subtitle">;

/** 新增 catalog 中的 id 时，在此补一行即可 */
const testimonialCase1TitleByLayoutId: Record<CyTitleLayoutId, (data: Case1TitleFields) => ReactNode> = {
  headerVertical: (data) => (
    <HeaderVertical sectionTitle={data.sectionTitle} subtitle={data.subtitle} />
  ),
  homeSplitHeader: (data) => (
    <HomeSplitHeader
      decorIndex={data.decorIndex}
      kicker={data.kicker}
      title={data.sectionTitle}
      description={<p>{data.subtitle}</p>}
    />
  ),
};

export function CyTestimonialTitleCase1({
  layoutId,
  data,
}: {
  layoutId: CyTitleLayoutId;
  data: Case1TitleFields;
}) {
  return testimonialCase1TitleByLayoutId[layoutId](data);
}

type Case2TitleFields = Pick<TestimonialGridCase2Data, "decorIndex" | "kicker" | "title" | "description">;

const testimonialCase2TitleByLayoutId: Record<CyTitleLayoutId, (data: Case2TitleFields) => ReactNode> = {
  headerVertical: (data) => <HeaderVertical sectionTitle={data.title} subtitle={data.description} />,
  homeSplitHeader: (data) => (
    <HomeSplitHeader
      kicker={data.kicker}
      decorIndex={data.decorIndex}
      title={data.title}
      description={<p>{data.description}</p>}
    />
  ),
};

export function CyTestimonialTitleCase2({
  layoutId,
  data,
}: {
  layoutId: CyTitleLayoutId;
  data: Case2TitleFields;
}) {
  return testimonialCase2TitleByLayoutId[layoutId](data);
}
