<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">仪表台概览</h1>
        <p class="text-gray-600 dark:text-gray-400">欢迎回来，这里是您的数据概览</p>
      </div>
      <div class="flex items-center space-x-3">
        <UButton
          icon="i-lucide-download"
          variant="outline"
          label="导出报告"
        />
        <UButton
          icon="i-lucide-refresh-cw"
          variant="solid"
          label="刷新数据"
          @click="refreshData"
          :loading="isRefreshing"
        />
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard
        v-for="stat in stats"
        :key="stat.title"
        class="hover:shadow-lg transition-shadow duration-200"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-lg" :class="stat.iconBg">
                <UIcon :name="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.title }}</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        </template>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <UIcon
              :name="stat.trend === 'up' ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
              :class="stat.trend === 'up' ? 'text-green-500' : 'text-red-500'"
              class="w-4 h-4"
            />
            <span
              :class="stat.trend === 'up' ? 'text-green-600' : 'text-red-600'"
              class="text-sm font-medium"
            >
              {{ stat.change }}
            </span>
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ stat.period }}</span>
        </div>
      </UCard>
    </div>

    <!-- 图表和活动区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 图表区域 -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">访问趋势</h3>
              <div class="flex items-center space-x-2">
                <USelectMenu
                  v-model="selectedPeriod"
                  :options="periodOptions"
                  size="sm"
                />
              </div>
            </div>
          </template>
          
          <!-- 图表占位符 -->
          <div class="h-80 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <UIcon name="i-lucide-bar-chart-3" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">图表数据加载中...</p>
              <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">这里将显示访问趋势图表</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- 最近活动 -->
      <div>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">最近活动</h3>
              <UButton
                icon="i-lucide-external-link"
                variant="ghost"
                size="sm"
                to="/dashboard/activities"
              />
            </div>
          </template>
          
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="flex-shrink-0">
                <div class="p-2 rounded-full" :class="activity.iconBg">
                  <UIcon :name="activity.icon" class="w-4 h-4" :class="activity.iconColor" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ activity.description }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
          
          <template #footer>
            <UButton
              label="查看全部活动"
              variant="ghost"
              size="sm"
              class="w-full"
              to="/dashboard/activities"
            />
          </template>
        </UCard>
      </div>
    </div>

    <!-- 快速操作和系统状态 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 快速操作 -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">快速操作</h3>
        </template>
        
        <div class="grid grid-cols-2 gap-4">
          <UButton
            v-for="action in quickActions"
            :key="action.label"
            :icon="action.icon"
            :label="action.label"
            variant="outline"
            class="h-20 flex-col space-y-2"
            :to="action.to"
          />
        </div>
      </UCard>

      <!-- 系统状态 -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">系统状态</h3>
        </template>
        
        <div class="space-y-4">
          <div
            v-for="status in systemStatus"
            :key="status.name"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-3 h-3 rounded-full"
                :class="status.status === 'healthy' ? 'bg-green-500' : status.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'"
              />
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ status.name }}</span>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ status.value }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-500">{{ status.description }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// 设置页面元数据
definePageMeta({
  layout: 'dashboard',
  title: '仪表台概览',
  middleware: 'auth'
})

// 响应式数据
const isRefreshing = ref(false)
const selectedPeriod = ref('7d')

// 时间段选项
const periodOptions = [
  { label: '最近7天', value: '7d' },
  { label: '最近30天', value: '30d' },
  { label: '最近90天', value: '90d' }
]

// 统计数据
const stats = ref([
  {
    title: '总用户数',
    value: '12,345',
    change: '+12.5%',
    trend: 'up',
    period: '较上月',
    icon: 'i-lucide-users',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: '活跃用户',
    value: '8,234',
    change: '+8.2%',
    trend: 'up',
    period: '较上月',
    icon: 'i-lucide-user-check',
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    title: '页面浏览量',
    value: '45,678',
    change: '-2.1%',
    trend: 'down',
    period: '较上月',
    icon: 'i-lucide-eye',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    title: '收入',
    value: '¥23,456',
    change: '+15.3%',
    trend: 'up',
    period: '较上月',
    icon: 'i-lucide-dollar-sign',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  }
])

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    title: '新用户注册',
    description: '张三刚刚注册了账户',
    time: '2分钟前',
    icon: 'i-lucide-user-plus',
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    id: 2,
    title: '系统更新',
    description: '系统已更新到版本 v2.1.0',
    time: '1小时前',
    icon: 'i-lucide-download',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 3,
    title: '数据备份',
    description: '每日数据备份已完成',
    time: '3小时前',
    icon: 'i-lucide-database',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    id: 4,
    title: '安全警告',
    description: '检测到异常登录尝试',
    time: '5小时前',
    icon: 'i-lucide-shield-alert',
    iconBg: 'bg-red-100 dark:bg-red-900',
    iconColor: 'text-red-600 dark:text-red-400'
  }
])

// 快速操作
const quickActions = ref([
  {
    label: '创建内容',
    icon: 'i-lucide-file-plus',
    to: '/dashboard/content/create'
  },
  {
    label: '查看报告',
    icon: 'i-lucide-bar-chart',
    to: '/dashboard/reports'
  }
])

// 系统状态
const systemStatus = ref([
  {
    name: 'API 服务',
    status: 'healthy',
    value: '99.9%',
    description: '正常运行'
  },
  {
    name: '数据库',
    status: 'healthy',
    value: '98.5%',
    description: '连接正常'
  },
  {
    name: '存储空间',
    status: 'warning',
    value: '78%',
    description: '使用率较高'
  },
  {
    name: 'CDN',
    status: 'healthy',
    value: '99.8%',
    description: '全球加速'
  }
])

// 刷新数据
const refreshData = async () => {
  isRefreshing.value = true
  
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 这里可以添加实际的数据刷新逻辑
  console.log('数据已刷新')
  
  isRefreshing.value = false
}

// 页面标题
useHead({
  title: '仪表台概览 - AetherWeb'
})
</script> 