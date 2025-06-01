<template>
  <div class="space-y-6">
    <!-- 通知横幅区域 -->
    <div v-if="activeNotifications.length > 0" class="space-y-3">
      <UAlert
        v-for="notification in activeNotifications"
        :key="notification.$id"
        :icon="notification.icon"
        :color="notification.color"
        :variant="notification.variant"
        :title="notification.title"
        :description="notification.description"
        :close-button="notification.isDismissible ? { icon: 'i-lucide-x', color: 'gray', variant: 'link', padded: false } : undefined"
        @close="dismissNotification(notification.$id)"
      />
    </div>

    <!-- 加载通知时的占位符 -->
    <div v-else-if="isLoadingNotifications" class="animate-pulse">
      <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>

    <!-- 欢迎区域 -->
    <div class="text-center py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        欢迎来到 AetherWeb
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        您的专业 Minecraft 插件授权管理平台
      </p>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 更新日志 -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center space-x-2">
              <UIcon name="i-lucide-newspaper" class="w-5 h-5 text-primary-500" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">平台动态 - 更新日志</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              了解最新的插件功能、平台改进和安全更新。
            </p>
          </template>
          
          <div class="space-y-4">
            <!-- 加载状态 -->
            <div v-if="isLoadingLogs" class="flex items-center justify-center py-8">
              <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-primary-500" />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">加载更新日志...</span>
            </div>
            
            <!-- 错误状态 -->
            <UAlert
              v-else-if="logsError"
              icon="i-lucide-alert-circle"
              color="error"
              variant="soft"
              :title="logsError"
              description="使用默认数据显示"
            />
            
            <!-- 更新日志列表 -->
            <div
              v-for="update in updateLogs"
              :key="update.$id"
              class="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div class="flex-shrink-0 mt-1">
                <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="update.iconBg">
                  <UIcon :name="update.icon" class="w-4 h-4" :class="update.iconColor" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ update.title }}
                  </h4>
                  <UBadge
                    :color="getBadgeColor(update.type)"
                    variant="subtle"
                    :label="getTypeLabel(update.type)"
                  />
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {{ update.description }}
                </p>
                <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{{ update.date }}</span>
                  <span>{{ update.version }}</span>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- 右侧边栏 -->
      <div class="space-y-6">
        <!-- 帮助提示和指南 -->
        <UCard>
          <template #header>
            <div class="flex items-center space-x-2">
              <UIcon name="i-lucide-lightbulb" class="w-5 h-5 text-yellow-500" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">使用指南和技巧</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              充分利用您的插件授权管理体验。
            </p>
          </template>
          
          <div class="space-y-4">
            <div
              v-for="tip in helpfulTips"
              :key="tip.id"
              class="flex items-start space-x-3"
            >
              <div class="flex-shrink-0 mt-1">
                <UIcon :name="tip.icon" class="w-5 h-5" :class="tip.iconColor" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {{ tip.title }}
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {{ tip.description }}
                </p>
                <UButton
                  :label="tip.actionText"
                  variant="ghost"
                  size="xs"
                  :to="tip.actionLink"
                  trailing-icon="i-lucide-arrow-right"
                />
              </div>
            </div>
          </div>
        </UCard>

        <!-- 系统状态 -->
        <UCard>
          <template #header>
            <div class="flex items-center space-x-2">
              <UIcon name="i-lucide-activity" class="w-5 h-5 text-green-500" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">平台状态</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              快速检查我们的授权服务状态。
            </p>
          </template>
          
          <div class="space-y-4">
            <!-- 服务状态列表 -->
            <div
              v-for="service in systemServices"
              :key="service.id"
              class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center space-x-3">
                <div 
                  class="w-3 h-3 rounded-full"
                  :class="getStatusColor(service.status)"
                ></div>
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ service.name }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ service.description }}
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <UBadge
                  :color="getStatusBadgeColor(service.status)"
                  variant="subtle"
                  :label="getStatusText(service.status)"
                />
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ service.responseTime }}
                </div>
              </div>
            </div>
            
            <!-- 整体状态摘要 -->
            <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  整体状态
                </span>
                <UBadge
                  :color="getOverallStatusColor()"
                  variant="subtle"
                  :label="getOverallStatusText()"
                />
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                最后检查：{{ lastChecked }}
              </div>
              <UButton
                label="查看详细状态"
                variant="ghost"
                size="sm"
                class="w-full"
                to="/status"
                trailing-icon="i-lucide-external-link"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UpdateLog, Notification, SystemService } from '~/config/database'

// 设置页面元数据
definePageMeta({
  layout: 'dashboard',
  title: '概览 - 仪表台 - AetherWeb',
  middleware: 'auth'
})

// 响应式数据
const updateLogs = ref<UpdateLog[]>([])
const isLoadingLogs = ref(true)
const logsError = ref<string | null>(null)

// 通知相关的响应式数据
const activeNotifications = ref<Notification[]>([])
const isLoadingNotifications = ref(true)
const dismissedNotifications = ref<Set<string>>(new Set())

// 数据库操作
const { getUpdateLogs, getActiveNotifications } = useDatabase()

// 获取激活的通知
const fetchActiveNotifications = async () => {
  try {
    isLoadingNotifications.value = true
    const currentPage = 'dashboard' // 当前页面标识
    const notifications = await getActiveNotifications(currentPage)
    
    // 过滤掉已被用户关闭的通知
    activeNotifications.value = notifications.filter(
      notification => !dismissedNotifications.value.has(notification.$id)
    )
  } catch (error: any) {
    console.error('获取通知失败:', error)
    // 如果获取失败，显示默认通知（可选）
    activeNotifications.value = []
  } finally {
    isLoadingNotifications.value = false
  }
}

// 关闭通知的方法
const dismissNotification = (notificationId: string) => {
  dismissedNotifications.value.add(notificationId)
  activeNotifications.value = activeNotifications.value.filter(
    notification => notification.$id !== notificationId
  )
  
  // 可以选择将关闭状态保存到localStorage
  if (import.meta.client) {
    const dismissed = Array.from(dismissedNotifications.value)
    localStorage.setItem('dismissedNotifications', JSON.stringify(dismissed))
  }
}

// 从localStorage恢复已关闭的通知状态
const restoreDismissedNotifications = () => {
  if (import.meta.client) {
    try {
      const dismissed = localStorage.getItem('dismissedNotifications')
      if (dismissed) {
        const dismissedArray = JSON.parse(dismissed) as string[]
        dismissedNotifications.value = new Set(dismissedArray)
      }
    } catch (error) {
      console.error('恢复已关闭通知状态失败:', error)
    }
  }
}

// 获取更新日志数据
const fetchUpdateLogs = async () => {
  try {
    isLoadingLogs.value = true
    logsError.value = null
    const logs = await getUpdateLogs(6) // 获取最新的6条记录
    updateLogs.value = logs
  } catch (error: any) {
    console.error('获取更新日志失败:', error)
    logsError.value = error.message || '获取更新日志失败'
    // 如果获取失败，使用默认数据
    updateLogs.value = getDefaultUpdateLogs()
  } finally {
    isLoadingLogs.value = false
  }
}

// 获取徽章颜色的函数
const getBadgeColor = (type: string): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' => {
  const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'> = {
    feature: 'primary',      // 新功能 - 蓝色
    improvement: 'success',  // 改进 - 绿色
    bugfix: 'error',        // 错误修复 - 红色
    security: 'error',      // 安全更新 - 红色
    breaking: 'warning',    // 破坏性更改 - 橙色
    deprecated: 'neutral',  // 功能废弃 - 灰色
    maintenance: 'info'     // 维护更新 - 蓝色
  }
  return colorMap[type] || 'neutral'
}

// 获取类型标签的函数
const getTypeLabel = (type: string): string => {
  const labelMap: Record<string, string> = {
    feature: '新功能',
    improvement: '改进',
    bugfix: '错误修复',
    security: '安全更新',
    breaking: '破坏性更改',
    deprecated: '功能废弃',
    maintenance: '维护更新'
  }
  return labelMap[type] || '未知类型'
}

// 默认更新日志数据（作为后备）
const getDefaultUpdateLogs = (): UpdateLog[] => [
  {
    $id: '1',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    title: '增强的用户角色和权限',
    description: '新增了更细粒度的权限控制系统，支持自定义角色和权限分配。',
    date: '2024年1月15日',
    version: 'v2.3.0',
    type: 'feature',
    icon: 'i-lucide-users',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    $id: '2',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    title: '性能优化和错误修复',
    description: '提升了页面加载速度，修复了多个已知问题，优化了用户体验。',
    date: '2024年1月10日',
    version: 'v2.2.5',
    type: 'improvement',
    icon: 'i-lucide-zap',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400'
  }
]

// 帮助提示数据
const helpfulTips = ref([
  {
    id: 1,
    title: '快速授权管理',
    description: '按 Ctrl + K（或 Cmd + K）打开命令面板进行快速插件授权操作。',
    icon: 'i-lucide-keyboard',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    actionText: '了解更多',
    actionLink: '/help/shortcuts'
  },
  {
    id: 2,
    title: '插件文档中心',
    description: '在我们的文档中心查找插件使用指南和API参考文档。',
    icon: 'i-lucide-book-open',
    iconColor: 'text-blue-600 dark:text-blue-400',
    actionText: '查看文档',
    actionLink: '/docs'
  },
  {
    id: 3,
    title: '授权数据分析',
    description: '在分析部分查看您的插件授权使用情况和服务器统计数据。',
    icon: 'i-lucide-filter',
    iconColor: 'text-green-600 dark:text-green-400',
    actionText: '查看分析',
    actionLink: '/dashboard/analytics'
  }
])

// 系统服务状态数据
const systemServices = ref<SystemService[]>([
  {
    id: 'auth',
    name: '授权服务',
    description: 'Minecraft插件授权验证',
    status: 'operational',
    responseTime: '45ms'
  },
  {
    id: 'database',
    name: '数据库',
    description: '用户数据和授权记录',
    status: 'operational',
    responseTime: '12ms'
  },
  {
    id: 'telemetry',
    name: '遥测服务',
    description: '插件使用统计和监控',
    status: 'operational',
    responseTime: '28ms'
  },
  {
    id: 'cache',
    name: '缓存系统',
    description: 'Redis缓存服务',
    status: 'degraded',
    responseTime: '156ms'
  },
  {
    id: 'cdn',
    name: 'CDN',
    description: '插件文件分发网络',
    status: 'operational',
    responseTime: '23ms'
  }
])

// 最后检查时间
const lastChecked = ref('刚刚')

// 获取状态颜色
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    operational: 'bg-green-500',
    degraded: 'bg-yellow-500',
    outage: 'bg-red-500',
    maintenance: 'bg-blue-500'
  }
  return colorMap[status] || 'bg-gray-500'
}

// 获取状态徽章颜色
const getStatusBadgeColor = (status: string): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' => {
  const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'> = {
    operational: 'success',
    degraded: 'warning',
    outage: 'error',
    maintenance: 'info'
  }
  return colorMap[status] || 'neutral'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    operational: '正常',
    degraded: '降级',
    outage: '故障',
    maintenance: '维护'
  }
  return textMap[status] || '未知'
}

// 获取整体状态颜色
const getOverallStatusColor = (): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' => {
  const services = systemServices.value
  const hasOutage = services.some(s => s.status === 'outage')
  const hasDegraded = services.some(s => s.status === 'degraded')
  const hasMaintenance = services.some(s => s.status === 'maintenance')
  
  if (hasOutage) return 'error'
  if (hasDegraded) return 'warning'
  if (hasMaintenance) return 'info'
  return 'success'
}

// 获取整体状态文本
const getOverallStatusText = (): string => {
  const services = systemServices.value
  const hasOutage = services.some(s => s.status === 'outage')
  const hasDegraded = services.some(s => s.status === 'degraded')
  const hasMaintenance = services.some(s => s.status === 'maintenance')
  
  if (hasOutage) return '服务异常'
  if (hasDegraded) return '部分降级'
  if (hasMaintenance) return '维护中'
  return '全部正常'
}

// 组件挂载时获取数据
onMounted(() => {
  // 恢复已关闭的通知状态
  restoreDismissedNotifications()
  
  // 获取数据
  fetchActiveNotifications()
  fetchUpdateLogs()
})
</script> 