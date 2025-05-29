<template>
  <div class="space-y-6">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">内容管理</h1>
        <p class="text-gray-600 dark:text-gray-400">管理网站的所有内容和文章</p>
      </div>
      <div class="flex items-center space-x-3">
        <UButton
          icon="i-lucide-download"
          variant="outline"
          label="导出内容"
        />
        <UButton
          icon="i-lucide-file-plus"
          variant="solid"
          label="创建内容"
          to="/dashboard/content/create"
        />
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <UCard
        v-for="stat in contentStats"
        :key="stat.title"
        class="hover:shadow-lg transition-shadow duration-200"
      >
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg" :class="stat.iconBg">
              <UIcon :name="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.title }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
            </div>
          </div>
        </template>
      </UCard>
    </div>

    <!-- 搜索和筛选 -->
    <UCard>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            placeholder="搜索内容..."
            icon="i-lucide-search"
            :loading="isSearching"
          />
        </div>
        <div class="flex items-center space-x-3">
          <USelectMenu
            v-model="selectedCategory"
            :options="categoryOptions"
            placeholder="分类筛选"
            size="sm"
          />
          <USelectMenu
            v-model="selectedStatus"
            :options="statusOptions"
            placeholder="状态筛选"
            size="sm"
          />
          <USelectMenu
            v-model="selectedAuthor"
            :options="authorOptions"
            placeholder="作者筛选"
            size="sm"
          />
          <UButton
            icon="i-lucide-filter"
            variant="outline"
            size="sm"
            @click="resetFilters"
          >
            重置
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- 内容列表 -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">内容列表</h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              共 {{ filteredContent.length }} 篇内容
            </span>
            <UButton
              :icon="viewMode === 'grid' ? 'i-lucide-list' : 'i-lucide-grid-3x3'"
              variant="ghost"
              size="sm"
              @click="toggleViewMode"
            />
          </div>
        </div>
      </template>

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="content in paginatedContent"
          :key="content.id"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
        >
          <!-- 内容图片 -->
          <div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
            <img
              v-if="content.image"
              :src="content.image"
              :alt="content.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-400" />
            </div>
          </div>
          
          <!-- 内容信息 -->
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <UBadge
                :color="getCategoryColor(content.category)"
                variant="subtle"
                :label="content.category"
                size="xs"
              />
              <UBadge
                :color="getStatusColor(content.status)"
                variant="subtle"
                :label="content.status"
                size="xs"
              />
            </div>
            
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {{ content.title }}
            </h4>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {{ content.excerpt }}
            </p>
            
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-2">
                <UAvatar :src="content.author.avatar" :alt="content.author.name" size="xs" />
                <span>{{ content.author.name }}</span>
              </div>
              <span>{{ content.publishedAt }}</span>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <div class="flex items-center space-x-1">
                  <UIcon name="i-lucide-eye" class="w-3 h-3" />
                  <span>{{ content.views }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <UIcon name="i-lucide-heart" class="w-3 h-3" />
                  <span>{{ content.likes }}</span>
                </div>
              </div>
              
              <UDropdownMenu :items="getContentActions(content)">
                <UButton
                  icon="i-lucide-more-horizontal"
                  variant="ghost"
                  size="sm"
                />
              </UDropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                内容
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                分类
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                作者
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                发布时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                数据
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="content in paginatedContent"
              :key="content.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      v-if="content.image"
                      :src="content.image"
                      :alt="content.title"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <UIcon name="i-lucide-image" class="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ content.title }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ content.excerpt }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="getCategoryColor(content.category)"
                  variant="subtle"
                  :label="content.category"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <UAvatar :src="content.author.avatar" :alt="content.author.name" size="xs" />
                  <span class="text-sm text-gray-900 dark:text-white">{{ content.author.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="getStatusColor(content.status)"
                  variant="subtle"
                  :label="content.status"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ content.publishedAt }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-1">
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                    <span>{{ content.views }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <UIcon name="i-lucide-heart" class="w-4 h-4" />
                    <span>{{ content.likes }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UDropdownMenu :items="getContentActions(content)">
                  <UButton
                    icon="i-lucide-more-horizontal"
                    variant="ghost"
                    size="sm"
                  />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <template #footer>
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredContent.length) }} 条，共 {{ filteredContent.length }} 条
          </div>
          <UPagination
            v-model="currentPage"
            :total="Math.ceil(filteredContent.length / pageSize)"
            :show-controls="true"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
// 设置页面元数据
definePageMeta({
  layout: 'dashboard',
  title: '内容管理',
  middleware: 'auth'
})

// 响应式数据
const searchQuery = ref('')
const isSearching = ref(false)
const selectedCategory = ref('')
const selectedStatus = ref('')
const selectedAuthor = ref('')
const currentPage = ref(1)
const pageSize = 12
const viewMode = ref<'grid' | 'list'>('grid')

// 筛选选项
const categoryOptions = [
  { label: '全部分类', value: '' },
  { label: '技术', value: '技术' },
  { label: '设计', value: '设计' },
  { label: '产品', value: '产品' },
  { label: '营销', value: '营销' }
]

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '已发布', value: '已发布' },
  { label: '草稿', value: '草稿' },
  { label: '待审核', value: '待审核' }
]

const authorOptions = [
  { label: '全部作者', value: '' },
  { label: '张三', value: '张三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' }
]

// 内容统计
const contentStats = ref([
  {
    title: '总内容数',
    value: '156',
    icon: 'i-lucide-file-text',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: '已发布',
    value: '128',
    icon: 'i-lucide-check-circle',
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    title: '草稿',
    value: '23',
    icon: 'i-lucide-edit',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    title: '待审核',
    value: '5',
    icon: 'i-lucide-clock',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400'
  }
])

// 模拟内容数据
const content = ref([
  {
    id: 1,
    title: 'Nuxt 3 完全指南：从入门到精通',
    excerpt: '深入了解 Nuxt 3 的核心概念、新特性和最佳实践，帮助你构建现代化的 Vue.js 应用程序。',
    category: '技术',
    status: '已发布',
    author: {
      name: '张三',
      avatar: 'https://avatars.githubusercontent.com/u/739984?v=4'
    },
    publishedAt: '2024-01-15',
    views: '12,345',
    likes: '234',
    image: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: 2,
    title: 'Vue 3 Composition API 最佳实践',
    excerpt: '探索 Vue 3 Composition API 的强大功能，学习如何编写更清晰、更可维护的代码。',
    category: '技术',
    status: '已发布',
    author: {
      name: '李四',
      avatar: 'https://avatars.githubusercontent.com/u/739985?v=4'
    },
    publishedAt: '2024-01-14',
    views: '9,876',
    likes: '187',
    image: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: 3,
    title: '现代 Web 设计趋势 2024',
    excerpt: '了解 2024 年最新的 Web 设计趋势，包括色彩搭配、排版设计和用户体验优化。',
    category: '设计',
    status: '草稿',
    author: {
      name: '王五',
      avatar: 'https://avatars.githubusercontent.com/u/739986?v=4'
    },
    publishedAt: '2024-01-13',
    views: '7,234',
    likes: '156',
    image: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: 4,
    title: 'TypeScript 进阶技巧',
    excerpt: '掌握 TypeScript 的高级特性，提升代码质量和开发效率。',
    category: '技术',
    status: '待审核',
    author: {
      name: '张三',
      avatar: 'https://avatars.githubusercontent.com/u/739984?v=4'
    },
    publishedAt: '2024-01-12',
    views: '5,678',
    likes: '123',
    image: 'https://picsum.photos/400/300?random=4'
  },
  {
    id: 5,
    title: '产品经理必备技能',
    excerpt: '成为优秀产品经理需要掌握的核心技能和工作方法。',
    category: '产品',
    status: '已发布',
    author: {
      name: '李四',
      avatar: 'https://avatars.githubusercontent.com/u/739985?v=4'
    },
    publishedAt: '2024-01-11',
    views: '4,321',
    likes: '98',
    image: 'https://picsum.photos/400/300?random=5'
  }
])

// 筛选内容
const filteredContent = computed(() => {
  let filtered = content.value

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.excerpt.toLowerCase().includes(query)
    )
  }

  // 分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(item => item.category === selectedCategory.value)
  }

  // 状态筛选
  if (selectedStatus.value) {
    filtered = filtered.filter(item => item.status === selectedStatus.value)
  }

  // 作者筛选
  if (selectedAuthor.value) {
    filtered = filtered.filter(item => item.author.name === selectedAuthor.value)
  }

  return filtered
})

// 分页内容
const paginatedContent = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredContent.value.slice(start, end)
})

// 获取分类颜色
const getCategoryColor = (category: string): "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral" => {
  const colors: Record<string, "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"> = {
    '技术': 'primary',
    '设计': 'success',
    '产品': 'warning',
    '营销': 'info'
  }
  return colors[category] || 'neutral'
}

// 获取状态颜色
const getStatusColor = (status: string): "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral" => {
  const colors: Record<string, "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"> = {
    '已发布': 'success',
    '草稿': 'warning',
    '待审核': 'info'
  }
  return colors[status] || 'neutral'
}

// 获取内容操作菜单
const getContentActions = (content: any) => {
  return [
    [
      {
        label: '查看',
        icon: 'i-lucide-eye',
        onSelect: () => viewContent(content)
      },
      {
        label: '编辑',
        icon: 'i-lucide-edit',
        onSelect: () => editContent(content)
      },
      {
        label: '复制',
        icon: 'i-lucide-copy',
        onSelect: () => duplicateContent(content)
      }
    ],
    [
      {
        label: content.status === '已发布' ? '取消发布' : '发布',
        icon: content.status === '已发布' ? 'i-lucide-eye-off' : 'i-lucide-send',
        onSelect: () => togglePublishStatus(content)
      },
      {
        label: '删除',
        icon: 'i-lucide-trash-2',
        onSelect: () => deleteContent(content)
      }
    ]
  ]
}

// 内容操作方法
const viewContent = (content: any) => {
  console.log('查看内容:', content)
}

const editContent = (content: any) => {
  console.log('编辑内容:', content)
}

const duplicateContent = (content: any) => {
  console.log('复制内容:', content)
}

const togglePublishStatus = (content: any) => {
  console.log('切换发布状态:', content)
}

const deleteContent = (content: any) => {
  console.log('删除内容:', content)
}

// 切换视图模式
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
  selectedAuthor.value = ''
  currentPage.value = 1
}

// 监听搜索变化
watch(searchQuery, () => {
  currentPage.value = 1
})

// 监听筛选变化
watch([selectedCategory, selectedStatus, selectedAuthor], () => {
  currentPage.value = 1
})

// 页面标题
useHead({
  title: '内容管理 - AetherWeb'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 