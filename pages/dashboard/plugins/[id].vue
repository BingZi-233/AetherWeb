<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <UButton
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          @click="$router.back()"
        />
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ productInfo.title }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            {{ productInfo.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- 产品详情内容 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- 产品信息卡片 -->
      <UCard>
        <template #header>
          <div class="text-center">
            <div class="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <UIcon :name="productInfo.icon" class="w-16 h-16" :class="productInfo.iconColor" />
            </div>
            
            <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4" :class="productInfo.categoryClass">
              {{ productInfo.category }}
            </div>
            <div class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {{ productInfo.price }}
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <UButton
            label="立即购买"
            color="primary"
            variant="solid"
            size="lg"
            block
            leading-icon="i-lucide-credit-card"
            @click="buyNow"
          />
        </div>
      </UCard>

      <!-- 功能特性 -->
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            功能特性
          </h2>
          
          <div class="space-y-4">
            <UCard v-for="feature in productInfo.features" :key="feature.title">
              <template #header>
                <div class="flex items-center">
                  <UIcon :name="feature.icon" class="w-6 h-6 text-primary-500 mr-3" />
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ feature.title }}
                  </h3>
                </div>
              </template>
              <p class="text-gray-600 dark:text-gray-300">
                {{ feature.description }}
              </p>
            </UCard>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术规格 -->
    <UCard>
      <template #header>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          技术规格
        </h2>
      </template>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="spec in productInfo.specs" :key="spec.label" class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span class="text-gray-600 dark:text-gray-300 font-medium">{{ spec.label }}</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ spec.value }}</span>
        </div>
      </div>
    </UCard>

    <!-- 相关插件推荐 -->
    <UCard>
      <template #header>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          相关推荐
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          您可能还喜欢这些插件
        </p>
      </template>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="related in relatedPlugins"
          :key="related.id"
          class="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          @click="navigateTo(`/dashboard/plugins/${related.id}`)"
        >
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <UIcon :name="related.icon" class="w-8 h-8" :class="related.iconColor" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ related.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ related.category }}</p>
            <p class="text-lg font-bold text-primary-600 dark:text-primary-400">{{ related.price }}</p>
          </div>
          <UButton
            icon="i-lucide-arrow-right"
            color="neutral"
            variant="ghost"
            size="sm"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  title: '插件详情',
  description: '查看插件的详细信息和功能特性',
  layout: 'dashboard'
})

// 类型定义
interface Feature {
  title: string
  description: string
  icon: string
}

interface Spec {
  label: string
  value: string
}

interface ProductInfo {
  title: string
  description: string
  category: string
  categoryClass: string
  price: string
  icon: string
  iconColor: string
  features: Feature[]
  specs: Spec[]
}

interface RelatedPlugin {
  id: string
  title: string
  category: string
  price: string
  icon: string
  iconColor: string
}

const route = useRoute()
const productId = route.params.id as string

// 产品信息映射
const productData: Record<string, ProductInfo> = {
  'optimizer-pro': {
    title: 'Optimizer Pro',
    description: '提升您网站的性能和SEO排名，使用我们先进的优化工具。',
    category: 'Performance',
    categoryClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    price: '$49.99',
    icon: 'i-lucide-zap',
    iconColor: 'text-blue-600 dark:text-blue-400',
    features: [
      {
        title: '图像优化',
        description: '自动压缩和优化图像文件，减少加载时间，支持WebP格式转换',
        icon: 'i-lucide-image'
      },
      {
        title: '代码压缩',
        description: '压缩CSS、JavaScript和HTML代码，提升页面加载性能',
        icon: 'i-lucide-code'
      },
      {
        title: 'SEO优化',
        description: '自动生成SEO友好的元标签和结构化数据，提升搜索排名',
        icon: 'i-lucide-search'
      },
      {
        title: '缓存管理',
        description: '智能缓存策略，自动清理过期缓存，提升页面响应速度',
        icon: 'i-lucide-database'
      }
    ],
    specs: [
      { label: '支持版本', value: 'Minecraft 1.16+' },
      { label: '服务器类型', value: 'Spigot, Paper, Bukkit' },
      { label: '最低内存', value: '512MB' },
      { label: '授权类型', value: '永久授权' },
      { label: '更新频率', value: '每月更新' },
      { label: '技术支持', value: '7x24小时' }
    ]
  },
  'form-builder-x': {
    title: 'Form Builder X',
    description: '使用我们的拖拽式表单构建器创建精美、响应式的表单。',
    category: 'Utility',
    categoryClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    price: '$39.00',
    icon: 'i-lucide-layout-template',
    iconColor: 'text-green-600 dark:text-green-400',
    features: [
      {
        title: '拖拽界面',
        description: '直观的拖拽式表单构建器，无需编程知识即可创建复杂表单',
        icon: 'i-lucide-mouse-pointer'
      },
      {
        title: '条件逻辑',
        description: '根据用户输入动态显示或隐藏表单字段，创建智能表单',
        icon: 'i-lucide-git-branch'
      },
      {
        title: '多种字段类型',
        description: '支持文本、选择、文件上传、日期选择等多种字段类型',
        icon: 'i-lucide-list'
      },
      {
        title: '数据导出',
        description: '支持CSV、Excel、PDF等格式的数据导出和报表生成',
        icon: 'i-lucide-download'
      }
    ],
    specs: [
      { label: '支持版本', value: 'Minecraft 1.17+' },
      { label: '服务器类型', value: 'Spigot, Paper' },
      { label: '最低内存', value: '256MB' },
      { label: '授权类型', value: '永久授权' },
      { label: '表单数量', value: '无限制' },
      { label: '数据存储', value: '本地/云端' }
    ]
  },
  'security-suite': {
    title: 'Security Suite Ultimate',
    description: '全面的安全解决方案，保护您的网站免受威胁和漏洞攻击。',
    category: 'Security',
    categoryClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    price: '$79.50',
    icon: 'i-lucide-shield-check',
    iconColor: 'text-red-600 dark:text-red-400',
    features: [
      {
        title: '防火墙保护',
        description: '实时监控和阻止恶意访问和攻击，支持IP白名单和黑名单',
        icon: 'i-lucide-shield'
      },
      {
        title: '恶意软件扫描',
        description: '定期扫描和清除恶意软件和病毒，保护服务器安全',
        icon: 'i-lucide-scan'
      },
      {
        title: '入侵检测',
        description: '智能检测异常行为和潜在威胁，及时发送安全警报',
        icon: 'i-lucide-eye'
      },
      {
        title: '安全报告',
        description: '详细的安全状态报告和建议，帮助提升整体安全性',
        icon: 'i-lucide-file-text'
      }
    ],
    specs: [
      { label: '支持版本', value: 'Minecraft 1.18+' },
      { label: '服务器类型', value: 'Spigot, Paper, Bukkit' },
      { label: '最低内存', value: '1GB' },
      { label: '授权类型', value: '永久授权' },
      { label: '扫描频率', value: '实时监控' },
      { label: '威胁数据库', value: '每日更新' }
    ]
  }
}

// 获取产品信息
const productInfo = computed(() => {
  return productData[productId] || {
    title: '产品未找到',
    description: '抱歉，找不到该产品信息。',
    category: 'Unknown',
    categoryClass: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    price: '$0.00',
    icon: 'i-lucide-package',
    iconColor: 'text-gray-600 dark:text-gray-400',
    features: [],
    specs: []
  }
})

// 相关插件推荐
const relatedPlugins = computed((): RelatedPlugin[] => {
  const allPlugins = [
    {
      id: 'optimizer-pro',
      title: 'Optimizer Pro',
      category: 'Performance',
      price: '$49.99',
      icon: 'i-lucide-zap',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'form-builder-x',
      title: 'Form Builder X',
      category: 'Utility',
      price: '$39.00',
      icon: 'i-lucide-layout-template',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'security-suite',
      title: 'Security Suite Ultimate',
      category: 'Security',
      price: '$79.50',
      icon: 'i-lucide-shield-check',
      iconColor: 'text-red-600 dark:text-red-400'
    }
  ]
  
  return allPlugins.filter(plugin => plugin.id !== productId).slice(0, 2)
})

// 立即购买
const buyNow = () => {
  const toast = useToast()
  toast.add({
    title: '跳转中',
    description: '正在跳转到支付页面...',
    color: 'info'
  })
  // 这里可以添加跳转到支付页面的逻辑
}
</script> 