# Policy 系统 - 使用指南

Policy 系统提供了一种集中管理用户权益、表单限制和按钮状态的方式，适用于所有页面。

## 快速开始：添加新页面

### 步骤 1：添加产品配置

编辑 `lib/policy/products.ts` 并添加您的产品配置：

```typescript
export const productPolicies: Record<string, ProductPolicy> = {
  'seedance-1-pro': {
    // ... existing config
  },
  
  // 在这里添加您的新产品
  'your-new-product-id': {
    productId: 'your-new-product-id',
    voucherConstraints: {
      resolution: ['480p'], // 可选：限制优惠券可用的分辨率
      duration: [5],         // 可选：限制优惠券可用的时长
      // aspectRatio 和 mode 是可选的
    },
    creditPricing: (form: FormContext) => {
      // 您的积分计算逻辑
      // 示例：
      const is1080p = form.resolution === '1080p';
      const is720p = form.resolution === '720p';
      const is10s = form.duration === 10;
      
      if (is1080p && is10s) return 100;
      if (is1080p && is5s) return 50;
      // ... 更多规则
      
      return 10; // 默认值
    },
  },
};
```

### 步骤 2：导入所需的 Hooks 和函数

在您的页面组件中（例如 `components/your-product/Hero.tsx`）：

```typescript
import { useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserInfo } from '@/lib/providers';
import { useAuthModal } from '@/components/auth/auth-modal-provider';
import { useUpgradeModal } from '@/components/upgrade/upgrade-modal-provider';
import { evaluatePolicy } from '@/lib/policy/evaluate';
import { InsufficientCreditsModal } from '@/components/ui/insufficient-credits-modal';
```

### 步骤 3：添加 Policy 评估

在您的组件中，添加 policy 评估逻辑：

```typescript
export default function YourProductHero() {
  const { isSignedIn } = useUser();
  const { userInfo } = useUserInfo();
  const { openAuthModal } = useAuthModal();
  const { openUpgradeModal } = useUpgradeModal();
  
  // 您的表单状态
  const [formData, setFormData] = useState({
    resolution: '480p',
    duration: 5,
    aspectRatio: '16:9',
    // ... 其他字段
  });
  
  // 评估 policy
  const policyDecision = useMemo(() => {
    if (!userInfo) {
      return {
        voucherEligible: false,
        voucherRestricted: false,
        allowed: false,
        primaryAction: 'signin' as const,
        buttonText: 'GENERATE',
        costBadge: 0,
        requiredCredits: 0,
      };
    }

    return evaluatePolicy({
      productId: 'your-new-product-id', // 使用您的产品 ID
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
        // 添加任何影响定价/限制的其他表单字段
      },
    });
  }, [isSignedIn, userInfo, formData.resolution, formData.duration, formData.aspectRatio, formData.uploadedImage]);
  
  // ... 组件的其余部分
}
```

### 步骤 4：将 Policy 应用到表单字段

表单字段应该始终可编辑，允许用户自由切换选项。当用户选择不符合优惠券限制的选项时，显示提示信息：

```typescript
<Select 
  value={formData.resolution}
  onValueChange={(val) => setFormData(prev => ({ ...prev, resolution: val }))}
>
  <SelectTrigger className="w-full h-8 text-xs bg-card">
    <SelectValue placeholder="Select resolution" />
  </SelectTrigger>
  <SelectContent>
    {resolutions.map(r => <SelectItem key={r.value} value={r.value} className="text-xs">{r.label}</SelectItem>)}
  </SelectContent>
</Select>

{policyDecision.voucherEligible && policyDecision.voucherRestricted && formData.resolution !== '480p' && (
  <p className="text-[10px] text-muted-foreground/70 mt-1">
    Free voucher only supports 480p
  </p>
)}
```

**注意**：不要禁用表单字段。用户应该能够自由切换选项，即使选择不符合优惠券限制的选项，按钮也会显示 "Upgrade Plan" 来引导用户升级。

### 步骤 5：更新生成按钮

使用 policy 决策来控制按钮状态和行为：

```typescript
<Button 
  onClick={() => {
    if (policyDecision.primaryAction === 'signin') {
      openAuthModal('signin');
    } else if (policyDecision.primaryAction === 'upgrade') {
      openUpgradeModal({
        source: 'your-new-product-id',
        productId: 'your-new-product-id',
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
    <>Generating...</>
  ) : (
    <>
      {policyDecision.buttonText}{' '}
      <span className="ml-2 px-1.5 py-0.5 bg-background/20 rounded text-[10px]">
        {policyDecision.costBadge === 'free' ? 'free' : policyDecision.costBadge}
      </span>
    </>
  )}
</Button>
```

### 步骤 6：更新生成处理函数

在您的生成处理函数中检查 policy：

```typescript
const handleGenerate = async () => {
  if (isGenerating) return;

  if (!isSignedIn) {
    openAuthModal('signin');
    return;
  }

  // 使用 policy 决策而不是手动检查
  if (!policyDecision.allowed) {
    if (policyDecision.primaryAction === 'signin') {
      openAuthModal('signin');
      return;
    } else if (policyDecision.primaryAction === 'upgrade') {
      openUpgradeModal({
        source: 'your-new-product-id',
        productId: 'your-new-product-id',
        reason: policyDecision.message,
      });
      return;
    } else if (policyDecision.primaryAction === 'buyCredits') {
      setIsInsufficientCreditsModalOpen(true);
      return;
    }
    showError(policyDecision.message || '无法生成');
    return;
  }

  // 继续生成...
};
```

### 步骤 7：添加积分不足弹窗

在组件末尾添加弹窗：

```typescript
return (
  <div>
    {/* Your component JSX */}
    
    <InsufficientCreditsModal
      isOpen={isInsufficientCreditsModalOpen}
      onClose={() => setIsInsufficientCreditsModalOpen(false)}
      requiredCredits={policyDecision.requiredCredits || 0}
      currentCredits={userInfo?.total_credits || 0}
    />
  </div>
);
```

## Policy 决策属性

`policyDecision` 对象包含：

- **`voucherEligible`**: `boolean` - 用户是否处于优惠券可用状态 (level <= 0 && free_times > 0)
- **`voucherRestricted`**: `boolean` - 优惠券限制是否阻止生成（当用户选择了不符合优惠券限制的选项时）
- **`allowed`**: `boolean` - 是否允许生成
- **`primaryAction`**: `'signin' | 'generate' | 'upgrade' | 'buyCredits'` - 按钮应该执行的操作
- **`buttonText`**: `string` - 按钮标签 ('GENERATE', 'Upgrade Plan' 等)
- **`costBadge`**: `string | number` - 显示的成本 ('free' 或积分数字)
- **`message`**: `string` - 可选的消息，显示给用户
- **`requiredCredits`**: `number` - 需要的积分（如果使用积分）

**注意**：`disabledFields` 属性已不再使用。表单字段应该始终可编辑，允许用户自由切换选项。

## 示例

### 示例 1：简单产品（无优惠券限制）

```typescript
'your-simple-product': {
  productId: 'your-simple-product',
  creditPricing: (form) => {
    // 简单定价：每次生成 10 积分
    return 10;
  },
}
```

### 示例 2：带优惠券限制的产品

```typescript
'your-restricted-product': {
  productId: 'your-restricted-product',
  voucherConstraints: {
    resolution: ['480p'],
    duration: [5],
    aspectRatio: ['16:9'], // 优惠券仅允许 16:9
  },
  creditPricing: (form) => {
    // 复杂的定价逻辑
    if (form.resolution === '1080p') return 100;
    if (form.resolution === '720p') return 60;
    return 20;
  },
}
```

## 最佳实践

1. **始终在评估 policy 前检查 `userInfo`** 以避免错误
2. **使用 `useMemo`** 进行 policy 评估，避免不必要的重新计算
3. **在 policy 输入中包含所有相关的表单字段** 以确保评估准确
4. **不要禁用表单字段** - 允许用户自由切换选项，即使选择不符合优惠券限制的选项
5. **按钮的 disabled 只应该检查 `isGenerating`** - 按钮应该始终可点击（用于打开登录/升级/购买积分弹窗）
6. **当用户选择不符合优惠券限制的选项时显示提示信息** - 使用 `voucherRestricted` 和实际选择的值来判断
7. **保持产品 ID 一致** - 使用 kebab-case（例如 `seedance-1-pro`）

## 故障排除

**Policy 不工作？**
- 检查产品 ID 在 `products.ts` 和您的组件中是否匹配
- 确认在评估前 `userInfo` 已加载
- 检查浏览器控制台是否有错误

**按钮显示错误状态？**
- 确保所有影响定价的表单字段都包含在 policy 输入中
- 检查 `useMemo` 的依赖项是否包含所有相关的表单字段

**优惠券限制未生效？**
- 验证产品配置中的 `voucherConstraints`
- 检查是否满足 `level <= 0 && free_times > 0` 条件
- 确认提示信息基于 `voucherRestricted` 和实际选择的值来显示

