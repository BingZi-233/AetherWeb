<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 侧边栏 -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col" :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }">
      <!-- 侧边栏头部 -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div class="flex items-center space-x-3">
          <UIcon name="i-lucide-zap" class="w-8 h-8 text-primary-500" />
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">AetherWeb</h1>
        </div>
        <UButton
          icon="i-lucide-x"
          variant="ghost"
          size="sm"
          class="lg:hidden"
          @click="toggleSidebar"
        />
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div class="space-y-1">
          <NuxtLink
            v-for="item in mainNavigationItems"
            :key="item.to"
            :to="item.to"
            :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              item.active
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
            ]"
          >
            <UIcon :name="item.icon" class="w-5 h-5 mr-3" />
            {{ item.label }}
          </NuxtLink>
        </div>
        
        <div class="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="space-y-1">
            <NuxtLink
              to="/dashboard/help"
              :class="[
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                route.path?.startsWith('/dashboard/help')
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              ]"
            >
              <UIcon name="i-lucide-help-circle" class="w-5 h-5 mr-3" />
              帮助
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- 侧边栏底部用户信息 -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div v-if="user" class="flex items-center space-x-3">
          <UAvatar
            :src="userAvatar"
            :alt="user.name || '用户'"
            size="sm"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ user.name || '未设置姓名' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ user.email }}
            </p>
          </div>
          <UDropdownMenu :items="userMenuItems">
            <UButton
              icon="i-lucide-more-vertical"
              variant="ghost"
              size="sm"
            />
          </UDropdownMenu>
        </div>
        
        <!-- 加载状态 -->
        <div v-else-if="isLoadingUser" class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div class="flex-1 min-w-0">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
        
        <!-- 未登录状态 -->
        <div v-else class="flex items-center space-x-3">
          <UAvatar
            src=""
            alt="未登录"
            size="sm"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              未登录
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              请先登录
            </p>
          </div>
          <UButton
            icon="i-lucide-log-in"
            variant="ghost"
            size="sm"
            to="/auth/login"
          />
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="lg:pl-64">
      <!-- 顶部导航栏 -->
      <header class="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between h-16 px-6">
          <!-- 左侧：移动端菜单按钮和面包屑 -->
          <div class="flex items-center space-x-4">
            <UButton
              icon="i-lucide-menu"
              variant="ghost"
              size="sm"
              class="lg:hidden"
              @click="toggleSidebar"
            />
            <nav class="hidden md:flex items-center space-x-2 text-sm">
              <UBreadcrumb :links="breadcrumbLinks" />
            </nav>
          </div>

          <!-- 右侧：搜索、通知、用户菜单 -->
          <div class="flex items-center space-x-4">
            <!-- 搜索框 -->
            <div class="hidden md:block">
              <UInput
                v-model="searchQuery"
                placeholder="搜索..."
                icon="i-lucide-search"
                class="w-64"
              />
            </div>

            <!-- 通知按钮 -->
            <UButton
              icon="i-lucide-bell"
              variant="ghost"
              size="sm"
              :badge="notificationCount"
            />

            <!-- 主题切换 -->
            <UButton
              :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
              variant="ghost"
              size="sm"
              @click="toggleColorMode"
            />
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>

    <!-- 移动端遮罩层 -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="toggleSidebar"
    />
  </div>
</template>

<script setup lang="ts">
import type { Models } from 'appwrite'

// 响应式状态
const sidebarOpen = ref(false)
const searchQuery = ref('')
const notificationCount = ref(3)

// 用户相关状态
const user = ref<Models.User<Models.Preferences> | null>(null)
const isLoadingUser = ref(true)

// 主题相关
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// 路由相关
const route = useRoute()

// Appwrite相关
const { account } = useAppwrite()

// 头像相关
const { createAvatarUrl } = useUserAvatar()

// 获取用户头像URL（32px用于侧边栏）
const userAvatar = createAvatarUrl(user, 32)

// 获取当前用户信息
const getCurrentUser = async () => {
  try {
    isLoadingUser.value = true
    const currentUser = await account.get()
    user.value = currentUser
  } catch (error) {
    console.log('用户未登录:', error)
    user.value = null
  } finally {
    isLoadingUser.value = false
  }
}

// 监听用户更新事件
const handleUserUpdate = () => {
  getCurrentUser()
}

// 退出登录
const logout = async () => {
  try {
    await account.deleteSession('current')
    user.value = null
    await navigateTo('/auth/login')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

// 切换侧边栏
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// 切换主题
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// 导航菜单项
const mainNavigationItems = computed(() => [
  {
    label: '概览',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard',
    active: route.path === '/dashboard'
  },
  {
    label: '分析',
    icon: 'i-lucide-bar-chart-3',
    to: '/dashboard/analytics',
    active: route.path?.startsWith('/dashboard/analytics') || false
  },
  {
    label: '内容管理',
    icon: 'i-lucide-file-text',
    to: '/dashboard/content',
    active: route.path?.startsWith('/dashboard/content') || false
  },
  {
    label: '更新日志',
    icon: 'i-lucide-newspaper',
    to: '/dashboard/updates',
    active: route.path?.startsWith('/dashboard/updates') || false
  }
])

// 用户菜单项
const userMenuItems = computed(() => [
  [
    {
      label: '个人资料',
      icon: 'i-lucide-user',
      to: '/dashboard/profile'
    }
  ],
  [
    {
      label: '退出登录',
      icon: 'i-lucide-log-out',
      onSelect: logout
    }
  ]
])

// 面包屑导航
const breadcrumbLinks = computed(() => {
  if (!route.path) return []
  
  const pathSegments = route.path.split('/').filter(Boolean)
  const links = []
  
  let currentPath = ''
  for (const segment of pathSegments) {
    currentPath += `/${segment}`
    links.push({
      label: segment === 'dashboard' ? '仪表台' : segment,
      to: currentPath
    })
  }
  
  return links
})

// 监听路由变化，在移动端自动关闭侧边栏
watch(() => route.path, () => {
  if (import.meta.client && window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
})

// 组件挂载时获取用户信息
onMounted(() => {
  getCurrentUser()
  
  // 监听用户更新事件
  window.addEventListener('user-updated', handleUserUpdate)
  
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      sidebarOpen.value = false
    }
  }
  
  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('user-updated', handleUserUpdate)
  })
})
</script>

<style scoped>
/* 自定义样式 */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style> 