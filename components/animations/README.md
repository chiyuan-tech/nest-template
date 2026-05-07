# React 动效组件库

本目录包含符合 React-Bits 风格的 React 动效组件，遵循以下设计原则：

## 设计原则

1. **TypeScript + 函数组件 + hooks**：使用现代 React 技术栈
2. **纯视觉/动效组件**：不包含业务逻辑
3. **props 参数驱动**：通过 duration/delay/easing/intensity/stagger/trigger 等参数控制动效
4. **样式支持**：支持 className 和 style
5. **Next.js SSR 安全**：window/document 只能在 useEffect 中使用
6. **可访问性**：支持 prefers-reduced-motion 降级
7. **性能优化**：避免每帧 setState，raf 要在 unmount 清理

## 可用组件

### FadeIn
淡入动画组件

**Props**：
- `children`: React.ReactNode - 子元素
- `duration`: number - 动画持续时间（毫秒），默认 500
- `delay`: number - 动画延迟（毫秒），默认 0
- `easing`: string - 缓动函数，默认 'ease-out'
- `intensity`: number - 动画强度（0-1），默认 1
- `trigger`: 'mount' | 'scroll' - 触发方式，默认 'mount'
- `threshold`: number - 滚动触发阈值（0-1），默认 0.1
- `className`: string - 自定义类名
- `style`: React.CSSProperties - 自定义样式

**使用示例**：
```tsx
import { FadeIn } from '@/components/animations';

// 基础用法
<FadeIn>
  <div>淡入内容</div>
</FadeIn>

// 自定义参数
<FadeIn duration={1000} delay={200} intensity={0.5}>
  <div>自定义淡入内容</div>
</FadeIn>

// 滚动触发
<FadeIn trigger="scroll" threshold={0.5}>
  <div>滚动触发淡入内容</div>
</FadeIn>
```

### SlideIn
滑入动画组件

**Props**：
- `children`: React.ReactNode - 子元素
- `duration`: number - 动画持续时间（毫秒），默认 500
- `delay`: number - 动画延迟（毫秒），默认 0
- `easing`: string - 缓动函数，默认 'ease-out'
- `intensity`: number - 动画强度（0-1），默认 1
- `direction`: 'left' | 'right' | 'up' | 'down' - 滑动方向，默认 'left'
- `trigger`: 'mount' | 'scroll' - 触发方式，默认 'mount'
- `threshold`: number - 滚动触发阈值（0-1），默认 0.1
- `className`: string - 自定义类名
- `style`: React.CSSProperties - 自定义样式

**使用示例**：
```tsx
import { SlideIn } from '@/components/animations';

// 从左侧滑入
<SlideIn direction="left">
  <div>左侧滑入内容</div>
</SlideIn>

// 从右侧滑入
<SlideIn direction="right" delay={200}>
  <div>右侧滑入内容</div>
</SlideIn>

// 滚动触发
<SlideIn direction="up" trigger="scroll" threshold={0.5}>
  <div>滚动触发滑入内容</div>
</SlideIn>
```

## 最佳实践

1. **合理使用动画**：只在需要吸引注意力或提供视觉反馈的地方使用动画
2. **控制动画时长**：一般来说，动画时长应在 200-800 毫秒之间
3. **使用合适的缓动函数**：
   - `ease-out`：适合大多数进入动画
   - `ease-in`：适合退出动画
   - `ease-in-out`：适合需要强调的动画
4. **考虑可访问性**：始终支持 prefers-reduced-motion
5. **性能优化**：
   - 对于多个元素的动画，考虑使用 stagger 效果
   - 对于滚动触发的动画，合理设置 threshold
   - 避免在动画过程中修改布局属性

## 扩展指南

要创建新的动效组件，请遵循以下步骤：

1. 创建新的组件文件，例如 `ZoomIn.tsx`
2. 遵循现有的组件结构和命名约定
3. 实现必要的 props 和动画逻辑
4. 添加最小示例和 props 简表
5. 在 `index.ts` 中导出新组件

## 性能注意事项

- 使用 `transform` 和 `opacity` 进行动画，这些属性不会触发重排
- 对于滚动触发的动画，使用 IntersectionObserver 而不是 scroll 事件
- 确保在组件卸载时清理所有定时器和监听器
- 对于复杂的动画，考虑使用 CSS 动画或 Framer Motion 等库
