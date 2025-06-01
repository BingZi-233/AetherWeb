<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">数据分析</h1>
        <p class="text-gray-600 dark:text-gray-400">深入了解您的业务数据和用户行为</p>
      </div>
      <div class="flex items-center space-x-3">
        <USelectMenu
          v-model="selectedTimeRange"
          :options="timeRangeOptions"
          size="sm"
        />
        <UButton
          icon="i-lucide-download"
          variant="outline"
          label="导出报告"
        />
      </div>
    </div>

    <!-- 关键指标 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard
        v-for="metric in keyMetrics"
        :key="metric.title"
        class="hover:shadow-lg transition-shadow duration-200"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-3 rounded-lg" :class="metric.iconBg">
                <UIcon :name="metric.icon" class="w-6 h-6" :class="metric.iconColor" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ metric.title }}</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metric.value }}</p>
              </div>
            </div>
          </div>
        </template>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <UIcon
              :name="metric.trend === 'up' ? 'i-lucide-trending-up' : metric.trend === 'down' ? 'i-lucide-trending-down' : 'i-lucide-minus'"
              :class="metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'"
              class="w-4 h-4"
            />
            <span
              :class="metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'"
              class="text-sm font-medium"
            >
              {{ metric.change }}
            </span>
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ metric.period }}</span>
        </div>
      </UCard>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 访问量趋势 -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">访问量趋势</h3>
            <div class="flex items-center space-x-2">
              <UButton
                v-for="period in chartPeriods"
                :key="period.value"
                :variant="selectedChartPeriod === period.value ? 'solid' : 'ghost'"
                size="sm"
                :label="period.label"
                @click="selectedChartPeriod = period.value"
              />
            </div>
          </div>
        </template>
        
        <!-- 图表占位符 -->
        <div class="h-80 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <UIcon name="i-lucide-trending-up" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">访问量趋势图表</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">显示过去{{ selectedChartPeriod }}的访问数据</p>
          </div>
        </div>
      </UCard>

      <!-- 用户来源 -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">用户来源</h3>
        </template>
        
        <div class="space-y-4">
          <div
            v-for="source in userSources"
            :key="source.name"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: source.color }"></div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ source.name }}</span>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ source.percentage }}%</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ source.users }} 用户</p>
            </div>
          </div>
        </div>
        
        <!-- 饼图占位符 -->
        <div class="mt-6 h-48 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <UIcon name="i-lucide-pie-chart" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-500 dark:text-gray-400">用户来源分布图</p>
          </div>
        </div>
      </UCard>

      <!-- 设备类型 -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">设备类型</h3>
        </template>
        
        <div class="space-y-4">
          <div
            v-for="device in deviceTypes"
            :key="device.name"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <UIcon :name="device.icon" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ device.name }}</span>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ device.percentage }}%</p>
              <div class="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div
                  class="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: device.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 页面性能和热门内容 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 页面性能 -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">页面性能</h3>
        </template>
        
        <div class="space-y-4">
          <div
            v-for="metric in performanceMetrics"
            :key="metric.name"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-lg" :class="metric.iconBg">
                <UIcon :name="metric.icon" class="w-4 h-4" :class="metric.iconColor" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ metric.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ metric.description }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ metric.value }}</p>
              <UBadge
                :color="metric.status === 'good' ? 'success' : metric.status === 'warning' ? 'warning' : 'error'"
                variant="subtle"
                :label="metric.status === 'good' ? '良好' : metric.status === 'warning' ? '一般' : '需优化'"
                size="xs"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- 热门内容 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">热门内容</h3>
            <UButton
              icon="i-lucide-external-link"
              variant="ghost"
              size="sm"
              to="/dashboard/content"
            />
          </div>
        </template>
        
        <div class="space-y-4">
          <div
            v-for="(content, index) in popularContent"
            :key="content.id"
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">{{ index + 1 }}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ content.title }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ content.views }} 次浏览</p>
            </div>
            <div class="flex-shrink-0">
              <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 实时数据 -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">实时数据</h3>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-sm text-gray-500 dark:text-gray-400">实时更新</span>
          </div>
        </div>
      </template>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="realtime in realtimeData"
          :key="realtime.title"
          class="text-center"
        >
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon :name="realtime.icon" class="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ realtime.value }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ realtime.title }}</p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
// 设置页面元数据
definePageMeta({
  layout: 'dashboard',
  title: '数据分析 - 仪表台 - AetherWeb',
  middleware: 'auth'
})

// 响应式数据
const selectedTimeRange = ref('7d')
const selectedChartPeriod = ref('7天')

// 时间范围选项
const timeRangeOptions = [
  { label: '最近7天', value: '7d' },
  { label: '最近30天', value: '30d' },
  { label: '最近90天', value: '90d' },
  { label: '最近1年', value: '1y' }
]

// 图表时间段选项
const chartPeriods = [
  { label: '7天', value: '7天' },
  { label: '30天', value: '30天' },
  { label: '90天', value: '90天' }
]

// 关键指标
const keyMetrics = ref([
  {
    title: '总访问量',
    value: '125,678',
    change: '+15.2%',
    trend: 'up',
    period: '较上周',
    icon: 'i-lucide-eye',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: '独立访客',
    value: '45,234',
    change: '+8.7%',
    trend: 'up',
    period: '较上周',
    icon: 'i-lucide-users',
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    title: '跳出率',
    value: '32.5%',
    change: '-2.1%',
    trend: 'down',
    period: '较上周',
    icon: 'i-lucide-mouse-pointer-click',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    title: '平均停留时间',
    value: '3:45',
    change: '+0.3%',
    trend: 'up',
    period: '较上周',
    icon: 'i-lucide-clock',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400'
  }
])

// 用户来源
const userSources = ref([
  {
    name: '直接访问',
    percentage: 45,
    users: '20,345',
    color: '#3B82F6'
  },
  {
    name: '搜索引擎',
    percentage: 30,
    users: '13,567',
    color: '#10B981'
  },
  {
    name: '社交媒体',
    percentage: 15,
    users: '6,789',
    color: '#F59E0B'
  },
  {
    name: '其他',
    percentage: 10,
    users: '4,532',
    color: '#8B5CF6'
  }
])

// 设备类型
const deviceTypes = ref([
  {
    name: '桌面端',
    percentage: 65,
    icon: 'i-lucide-monitor'
  },
  {
    name: '移动端',
    percentage: 30,
    icon: 'i-lucide-smartphone'
  },
  {
    name: '平板',
    percentage: 5,
    icon: 'i-lucide-tablet'
  }
])

// 性能指标
const performanceMetrics = ref([
  {
    name: '页面加载时间',
    description: '平均首次内容绘制时间',
    value: '1.2s',
    status: 'good',
    icon: 'i-lucide-zap',
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    name: '服务器响应时间',
    description: 'TTFB 平均响应时间',
    value: '245ms',
    status: 'good',
    icon: 'i-lucide-server',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'Core Web Vitals',
    description: 'LCP, FID, CLS 综合评分',
    value: '85/100',
    status: 'warning',
    icon: 'i-lucide-gauge',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  }
])

// 热门内容
const popularContent = ref([
  {
    id: 1,
    title: '如何使用 Nuxt 3 构建现代 Web 应用',
    views: '12,345'
  },
  {
    id: 2,
    title: 'Vue 3 Composition API 完全指南',
    views: '9,876'
  },
  {
    id: 3,
    title: 'TypeScript 最佳实践',
    views: '8,234'
  },
  {
    id: 4,
    title: 'Tailwind CSS 设计系统',
    views: '7,123'
  },
  {
    id: 5,
    title: '前端性能优化技巧',
    views: '6,789'
  }
])

// 实时数据
const realtimeData = ref([
  {
    title: '当前在线用户',
    value: '1,234',
    icon: 'i-lucide-users'
  },
  {
    title: '今日新访客',
    value: '567',
    icon: 'i-lucide-user-plus'
  },
  {
    title: '活跃会话',
    value: '890',
    icon: 'i-lucide-activity'
  }
])
</script> 