<template>
  <div class="space-y-6">
    <!-- 维护通知横幅 -->
    <UAlert
      icon="i-lucide-wrench"
      color="info"
      variant="soft"
      title="计划维护通知"
      description="我们将在周日进行系统维护，服务可能暂时不可用。"
      :close-button="{ icon: 'i-lucide-x', color: 'gray', variant: 'link', padded: false }"
    />

    <!-- 欢迎区域 -->
    <div class="text-center py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        欢迎来到 AetherWeb
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        您的现代化 Web 应用管理平台
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
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">最新动态 - 更新日志</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              了解最新功能、改进和错误修复。
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
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">实用提示和指南</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              充分利用您的仪表台体验。
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
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">系统状态</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              快速检查我们的服务状态。
            </p>
          </template>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">所有系统正常运行</span>
              </div>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              最后检查：刚刚
            </div>
            <UButton
              label="查看状态页面"
              variant="ghost"
              size="sm"
              class="w-full mt-3"
              to="/status"
              trailing-icon="i-lucide-external-link"
            />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UpdateLog } from '~/config/database'

// 设置页面元数据
definePageMeta({
  layout: 'dashboard',
  title: '仪表台概览',
  middleware: 'auth'
})

// 响应式数据
const updateLogs = ref<UpdateLog[]>([])
const isLoadingLogs = ref(true)
const logsError = ref<string | null>(null)

// 数据库操作
const { getUpdateLogs } = useDatabase()

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
    title: '键盘快捷键',
    description: '按 Ctrl + K（或 Cmd + K）打开命令面板进行快速导航。',
    icon: 'i-lucide-keyboard',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    actionText: '了解更多',
    actionLink: '/help/shortcuts'
  },
  {
    id: 2,
    title: '探索文档',
    description: '在我们的综合文档中查找详细指南和API参考。',
    icon: 'i-lucide-book-open',
    iconColor: 'text-blue-600 dark:text-blue-400',
    actionText: '了解更多',
    actionLink: '/docs'
  },
  {
    id: 3,
    title: '高级筛选',
    description: '在分析部分使用高级筛选器深入了解您的数据。',
    icon: 'i-lucide-filter',
    iconColor: 'text-green-600 dark:text-green-400',
    actionText: '了解更多',
    actionLink: '/help/filtering'
  }
])

// 页面标题
useHead({
  title: '仪表台概览 - AetherWeb'
})

// 组件挂载时获取数据
onMounted(() => {
  fetchUpdateLogs()
})
</script> 