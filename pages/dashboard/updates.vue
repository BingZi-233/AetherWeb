<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">更新日志</h1>
        <p class="text-gray-600 dark:text-gray-400">查看所有系统更新和功能变更</p>
      </div>
      <div class="flex items-center space-x-3">
        <USelect
          v-model="selectedType"
          :items="typeFilterOptions"
          placeholder="筛选类型"
          class="w-40"
        />
        <UButton
          icon="i-lucide-refresh-cw"
          variant="outline"
          @click="refreshData"
          :loading="isRefreshing"
        >
          刷新
        </UButton>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UCard
        v-for="stat in stats"
        :key="stat.type"
        class="text-center"
      >
        <div class="flex items-center justify-center space-x-2">
          <div class="w-3 h-3 rounded-full" :class="stat.color"></div>
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stat.label }}</span>
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white mt-2">{{ stat.count }}</div>
      </UCard>
    </div>

    <!-- 更新日志列表 -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">更新记录</h3>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            共 {{ totalCount }} 条记录
          </div>
        </div>
      </template>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
        <span class="ml-3 text-gray-600 dark:text-gray-400">加载中...</span>
      </div>

      <!-- 错误状态 -->
      <UAlert
        v-else-if="error"
        icon="i-lucide-alert-circle"
        color="error"
        variant="soft"
        :title="error"
        description="请稍后重试"
        class="mb-6"
      />

      <!-- 空状态 -->
      <div v-else-if="updateLogs.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-file-text" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无更新日志</h3>
        <p class="text-gray-500 dark:text-gray-400">还没有任何更新记录</p>
      </div>

      <!-- 更新日志列表 -->
      <div v-else class="space-y-4">
        <div
          v-for="update in updateLogs"
          :key="update.$id"
          class="flex items-start space-x-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
        >
          <div class="flex-shrink-0 mt-1">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="update.iconBg">
              <UIcon :name="update.icon" class="w-5 h-5" :class="update.iconColor" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ update.title }}
              </h4>
              <UBadge
                :color="getBadgeColor(update.type)"
                variant="subtle"
                :label="getTypeLabel(update.type)"
              />
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
              {{ update.description }}
            </p>
            <div class="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-1">
                <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                <span>{{ update.date }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <UIcon name="i-lucide-tag" class="w-4 h-4" />
                <span>{{ update.version }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <UIcon name="i-lucide-clock" class="w-4 h-4" />
                <span>{{ formatDate(update.$createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <template #footer v-if="totalPages > 1">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalCount) }} 条，共 {{ totalCount }} 条
          </div>
          <UPagination
            v-model="currentPage"
            :total="totalCount"
            :page-size="pageSize"
            @update:model-value="handlePageChange"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { UpdateLog } from '~/config/database'

// 设置页面元数据
definePageMeta({
  layout: 'dashboard',
  title: '更新日志 - 仪表台 - AetherWeb',
  middleware: 'auth'
})

// 响应式数据
const updateLogs = ref<UpdateLog[]>([])
const isLoading = ref(true)
const isRefreshing = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const selectedType = ref<string>('all')

// 数据库操作
const { getUpdateLogsWithPagination, getUpdateLogsStats } = useDatabase()

// 计算属性
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

// 类型筛选选项
const typeFilterOptions = [
  { label: '全部类型', value: 'all' },
  { label: '新功能', value: 'feature' },
  { label: '改进', value: 'improvement' },
  { label: '错误修复', value: 'bugfix' },
  { label: '安全更新', value: 'security' },
  { label: '破坏性更改', value: 'breaking' },
  { label: '功能废弃', value: 'deprecated' },
  { label: '维护更新', value: 'maintenance' }
]

// 统计数据
const stats = ref([
  { type: 'feature', label: '新功能', count: 0, color: 'bg-blue-500' },
  { type: 'improvement', label: '改进', count: 0, color: 'bg-green-500' },
  { type: 'bugfix', label: '错误修复', count: 0, color: 'bg-red-500' },
  { type: 'security', label: '安全更新', count: 0, color: 'bg-orange-500' }
])

// 获取更新日志数据
const fetchUpdateLogs = async (page: number = 1, type: string = 'all') => {
  try {
    isLoading.value = true
    error.value = null
    
    // 使用新的分页API，只有当type不为'all'时才传递筛选参数
    const result = await getUpdateLogsWithPagination(
      page, 
      pageSize.value, 
      type === 'all' ? undefined : type
    )
    updateLogs.value = result.documents
    totalCount.value = result.total
    
    // 获取统计数据
    await fetchStats()
    
  } catch (err: any) {
    console.error('获取更新日志失败:', err)
    error.value = err.message || '获取更新日志失败'
  } finally {
    isLoading.value = false
  }
}

// 获取统计数据
const fetchStats = async () => {
  try {
    const statsData = await getUpdateLogsStats()
    stats.value.forEach(stat => {
      stat.count = statsData[stat.type] || 0
    })
  } catch (err: any) {
    console.error('获取统计数据失败:', err)
  }
}

// 处理页面变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchUpdateLogs(page, selectedType.value)
}

// 刷新数据
const refreshData = async () => {
  isRefreshing.value = true
  await fetchUpdateLogs(currentPage.value, selectedType.value)
  isRefreshing.value = false
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取徽章颜色的函数
const getBadgeColor = (type: string): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' => {
  const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'> = {
    feature: 'primary',
    improvement: 'success',
    bugfix: 'error',
    security: 'error',
    breaking: 'warning',
    deprecated: 'neutral',
    maintenance: 'info'
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

// 监听筛选类型变化
watch(selectedType, (newType) => {
  currentPage.value = 1
  fetchUpdateLogs(1, newType)
})

// 组件挂载时获取数据
onMounted(() => {
  fetchUpdateLogs()
})
</script> 