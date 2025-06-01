<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          插件商店
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          选择适合您服务器的专业插件，享受安全可靠的授权服务
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <UButton
          icon="i-lucide-filter"
          color="neutral"
          variant="ghost"
          @click="showFilters = !showFilters"
        />
      </div>
    </div>

    <!-- 筛选器 -->
    <UCard v-if="showFilters" class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">筛选器</h3>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="closeFilters"
          />
        </div>
      </template>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            分类
          </label>
          <USelect
            v-model="selectedCategory"
            :items="categories"
            placeholder="选择分类"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            价格范围
          </label>
          <USelect
            v-model="selectedPriceRange"
            :items="priceRanges"
            placeholder="选择价格范围"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            排序方式
          </label>
          <USelect
            v-model="sortBy"
            :items="sortOptions"
            placeholder="选择排序方式"
          />
        </div>
      </div>
    </UCard>

    <!-- 产品卡片区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="plugin in filteredPlugins"
        :key="plugin.id"
        class="relative overflow-hidden hover:shadow-lg transition-shadow duration-200"
      >
        <template #header>
          <div class="text-center py-6">
            <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4" :class="plugin.categoryClass">
              {{ plugin.category }}
            </div>
            <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <UIcon :name="plugin.icon" class="w-12 h-12" :class="plugin.iconColor" />
            </div>
          </div>
        </template>

        <div class="px-6 pb-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ plugin.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ plugin.description }}
          </p>

          <div class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tag in plugin.tags"
              :key="tag"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            >
              {{ tag }}
            </span>
          </div>

          <div class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {{ plugin.price }}
          </div>

          <ul class="space-y-3 mb-8">
            <li v-for="feature in plugin.features" :key="feature" class="flex items-start">
              <UIcon name="i-lucide-check" class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ feature }}</span>
            </li>
          </ul>

          <div class="space-y-3">
            <UButton
              label="立即购买"
              color="primary"
              variant="solid"
              size="md"
              block
              leading-icon="i-lucide-credit-card"
              @click="buyNow(plugin)"
            />
            <UButton
              label="查看详情"
              color="neutral"
              variant="outline"
              size="md"
              block
              leading-icon="i-lucide-info"
              @click="viewDetails(plugin.id)"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- 购买须知 -->
    <UCard class="mt-12">
      <template #header>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          购买须知
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          在购买前，请仔细阅读以下重要信息
        </p>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div class="flex items-center mb-4">
            <UIcon name="i-lucide-shield" class="w-6 h-6 text-primary-500 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              授权说明
            </h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>• 每个授权仅限单个服务器使用</li>
            <li>• 授权永久有效，包含免费更新</li>
            <li>• 支持技术支持和问题解答</li>
            <li>• 不支持退款，请谨慎购买</li>
          </ul>
        </div>

        <div>
          <div class="flex items-center mb-4">
            <UIcon name="i-lucide-headphones" class="w-6 h-6 text-primary-500 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              技术支持
            </h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>• 7x24小时在线客服支持</li>
            <li>• 专业技术团队远程协助</li>
            <li>• 详细的安装和配置文档</li>
            <li>• 社区论坛交流学习</li>
          </ul>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  title: '插件商店',
  description: '选择适合您服务器的专业插件，享受安全可靠的授权服务',
  layout: 'dashboard',
  middleware: 'auth'
})

// 类型定义
interface Plugin {
  id: string
  title: string
  description: string
  category: string
  categoryClass: string
  price: string
  priceValue: number
  icon: string
  iconColor: string
  tags: string[]
  features: string[]
}

interface SelectOption {
  label: string
  value: string
}

// 响应式数据
const showFilters = ref(false)
const selectedCategory = ref('all')
const selectedPriceRange = ref('all')
const sortBy = ref('name')

// 插件数据
const plugins = ref<Plugin[]>([
  {
    id: 'optimizer-pro',
    title: 'Optimizer Pro',
    description: '提升您网站的性能和SEO排名，使用我们先进的优化工具。',
    category: 'Performance',
    categoryClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    price: '$49.99',
    priceValue: 49.99,
    icon: 'i-lucide-zap',
    iconColor: 'text-blue-600 dark:text-blue-400',
    tags: ['seo', 'speed', 'optimization'],
    features: ['图像优化', '代码压缩', '更多功能...']
  },
  {
    id: 'form-builder-x',
    title: 'Form Builder X',
    description: '使用我们的拖拽式表单构建器创建精美、响应式的表单。',
    category: 'Utility',
    categoryClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    price: '$39.00',
    priceValue: 39.00,
    icon: 'i-lucide-layout-template',
    iconColor: 'text-green-600 dark:text-green-400',
    tags: ['forms', 'contact', 'survey'],
    features: ['拖拽界面', '条件逻辑', '更多功能...']
  },
  {
    id: 'security-suite',
    title: 'Security Suite Ultimate',
    description: '全面的安全解决方案，保护您的网站免受威胁和漏洞攻击。',
    category: 'Security',
    categoryClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    price: '$79.50',
    priceValue: 79.50,
    icon: 'i-lucide-shield-check',
    iconColor: 'text-red-600 dark:text-red-400',
    tags: ['security', 'firewall', 'malware'],
    features: ['防火墙保护', '恶意软件扫描', '更多功能...']
  }
])

// 筛选选项
const categories: SelectOption[] = [
  { label: '全部分类', value: 'all' },
  { label: 'Performance', value: 'Performance' },
  { label: 'Utility', value: 'Utility' },
  { label: 'Security', value: 'Security' }
]

const priceRanges: SelectOption[] = [
  { label: '全部价格', value: 'all' },
  { label: '$0 - $30', value: '0-30' },
  { label: '$30 - $60', value: '30-60' },
  { label: '$60+', value: '60+' }
]

const sortOptions: SelectOption[] = [
  { label: '按名称排序', value: 'name' },
  { label: '价格从低到高', value: 'price-asc' },
  { label: '价格从高到低', value: 'price-desc' }
]

// 计算属性
const filteredPlugins = computed(() => {
  let filtered = [...plugins.value]

  // 按分类筛选
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    filtered = filtered.filter(plugin => plugin.category === selectedCategory.value)
  }

  // 按价格范围筛选
  if (selectedPriceRange.value && selectedPriceRange.value !== 'all') {
    const [min, max] = selectedPriceRange.value.split('-').map(Number)
    filtered = filtered.filter(plugin => {
      if (max) {
        return plugin.priceValue >= min && plugin.priceValue <= max
      } else {
        return plugin.priceValue >= min
      }
    })
  }

  // 排序
  if (sortBy.value === 'price-asc') {
    filtered.sort((a, b) => a.priceValue - b.priceValue)
  } else if (sortBy.value === 'price-desc') {
    filtered.sort((a, b) => b.priceValue - a.priceValue)
  } else {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  }

  return filtered
})

// 方法
const viewDetails = (pluginId: string) => {
  navigateTo(`/dashboard/plugins/${pluginId}`)
}

const buyNow = (plugin: Plugin) => {
  const toast = useToast()
  toast.add({
    title: '跳转中',
    description: `正在跳转到 ${plugin.title} 的支付页面...`,
    color: 'info'
  })
  // 这里可以添加跳转到支付页面的逻辑
}

const closeFilters = () => {
  showFilters.value = false
}
</script> 