import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import type {
  KeyFeatureCase2Card,
  KeyFeatureCase2CardVideo,
  KeyFeatureItem,
  KeyFeatureItemVideo,
} from "@/components/cy/KeyFeature/types";

export type CyModulesConfig = typeof cyModulesConfig;

export interface CopyCyModuleConfigOptions {
  /**
   * 写入剪贴板 JSON 内的 `__cyComponentPath`（仅作粘贴说明；`cy:generate` 生成页面前会剔除所有 `__` 前缀字段）。
   */
  sourceFilePath?: string;
  /**
   * 标题区所用组件路径，写入 `__cyTitleComponentPath`（同上，生成前剔除）。
   */
  titleComponentPath?: string;
  /**
   * 标题区布局 id（如 `cy-title-layouts` 的 id），写入 `__cyTitleComponentId`（同上，生成前剔除）。
   */
  titleComponentId?: string;
  /**
   * 合并进剪贴板 JSON 的对象根级（如 `titleLayout`），会随配置一起粘贴，非 `__` 字段。
   */
  mergeRoot?: Record<string, unknown>;
}

/**
 * 生成可粘贴进 `cy_templeate.json` / `cy-modules.config.json` 的片段：`"someKey": { ... }`（无最外层根对象）。
 */
export function formatCyModuleConfigEntry(
  key: keyof CyModulesConfig | (string & {}),
  config: CyModulesConfig = cyModulesConfig,
  options?: CopyCyModuleConfigOptions
): string {
  const raw = config[key as keyof CyModulesConfig];
  let payload: unknown = raw;
  if (raw !== null && typeof raw === "object" && !Array.isArray(raw)) {
    const merged: Record<string, unknown> = {
      ...(raw as Record<string, unknown>),
      ...(options?.mergeRoot ?? {}),
    };
    const extra: Record<string, string> = {};
    if (options?.sourceFilePath) extra.__cyComponentPath = options.sourceFilePath;
    if (options?.titleComponentPath) extra.__cyTitleComponentPath = options.titleComponentPath;
    if (options?.titleComponentId) extra.__cyTitleComponentId = options.titleComponentId;
    if (Object.keys(extra).length > 0) {
      payload = { ...merged, ...extra };
    } else if (options?.mergeRoot && Object.keys(options.mergeRoot).length > 0) {
      payload = merged;
    } else {
      payload = raw;
    }
  } else if (
    options?.sourceFilePath ||
    options?.titleComponentPath ||
    options?.titleComponentId ||
    (options?.mergeRoot && Object.keys(options.mergeRoot).length > 0)
  ) {
    const wrap: Record<string, unknown> = { value: raw };
    if (options?.sourceFilePath) wrap.__cyComponentPath = options.sourceFilePath;
    if (options?.titleComponentPath) wrap.__cyTitleComponentPath = options.titleComponentPath;
    if (options?.titleComponentId) wrap.__cyTitleComponentId = options.titleComponentId;
    payload = wrap;
  }
  return `${JSON.stringify(key)}: ${JSON.stringify(payload, null, 2)}`;
}

/**
 * 将上述片段写入剪贴板。需在浏览器环境（如 Client Component）中调用。
 * @returns 是否复制成功
 */
export async function copyCyModuleConfigJson(
  key: keyof CyModulesConfig | (string & {}),
  config: CyModulesConfig = cyModulesConfig,
  options?: CopyCyModuleConfigOptions
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(formatCyModuleConfigEntry(key, config, options));
    return true;
  } catch {
    return false;
  }
}

/** 同时存在非空 `video` + `videoPoster` 时按视频处理；否则按图片（需 `image`）。 */
export function isKeyFeatureVideoItem(item: KeyFeatureItem): item is KeyFeatureItemVideo {
  const v = item as KeyFeatureItemVideo;
  return (
    typeof v.video === "string" &&
    v.video.trim().length > 0 &&
    typeof v.videoPoster === "string" &&
    v.videoPoster.trim().length > 0
  );
}

export function isKeyFeatureCase2VideoCard(item: KeyFeatureCase2Card): item is KeyFeatureCase2CardVideo {
  const v = item as KeyFeatureCase2CardVideo;
  return (
    typeof v.video === "string" &&
    v.video.trim().length > 0 &&
    typeof v.videoPoster === "string" &&
    v.videoPoster.trim().length > 0
  );
}
