<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo区域 -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <UIcon name="i-lucide-zap" class="w-8 h-8 text-primary-500" />
            <span class="text-xl font-bold text-gray-900 dark:text-white">
              AetherWeb
            </span>
          </NuxtLink>
        </div>

        <!-- 桌面端导航菜单 -->
        <nav class="hidden md:flex items-center space-x-8">
          <UNavigationMenu
            arrow
            content-orientation="vertical"
            :items="navigationItems"
            class="flex items-center space-x-6"
            variant="link"
            color="neutral"
            :ui="{
              content: 'min-w-96 w-96',
              viewport: 'min-w-96 w-96'
            }"
          />
        </nav>

        <!-- 右侧操作区域 -->
        <div class="flex items-center space-x-4">

          <!-- 主题切换按钮 -->
          <UButton
            :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="toggleColorMode"
          />
          
          <!-- 登录按钮 -->
          <UButton
            label="登录"
            icon="i-lucide-log-in"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="handleLogin"
            class="hidden sm:flex"
          />

          <!-- 注册按钮 -->
          <UButton
            label="注册"
            icon="i-lucide-user-plus"
            variant="solid"
            color="primary"
            size="sm"
            @click="handleRegister"
            class="hidden sm:flex"
          />

          <!-- 移动端菜单按钮 -->
          <UButton
            :icon="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="toggleMobileMenu"
            class="md:hidden"
          />
        </div>
      </div>

      <!-- 移动端导航菜单 -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="isMobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <UNavigationMenu
              :items="mobileNavigationItems"
              orientation="vertical"
              variant="link"
              color="neutral"
              class="w-full"
            />
            
            <!-- 移动端操作按钮 -->
            <div class="flex flex-col space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <!-- 登录按钮 -->
              <UButton
                label="登录"
                icon="i-lucide-log-in"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="handleLogin"
                class="w-full"
              />
              
              <!-- 注册按钮 -->
              <UButton
                label="注册"
                icon="i-lucide-user-plus"
                variant="solid"
                color="primary"
                size="sm"
                @click="handleRegister"
                class="w-full"
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
// 响应式状态管理
const isMobileMenuOpen = ref(false)
const colorMode = useColorMode()

// 计算属性
const isDark = computed(() => colorMode.value === 'dark')

// 导航菜单数据
const navigationItems = [
  {
    label: '产品',
    icon: 'i-lucide-box',
    children: [
      {
        label: '功能特性',
        description: '了解我们的核心功能',
        to: '/features',
        icon: 'i-lucide-star'
      },
      {
        label: '定价方案',
        description: '选择适合您的方案',
        to: '/pricing',
        icon: 'i-lucide-credit-card'
      }
    ]
  },
  {
    label: '解决方案',
    icon: 'i-lucide-lightbulb',
    children: [
      {
        label: '企业版',
        description: '为企业客户定制的解决方案',
        to: '/enterprise',
        icon: 'i-lucide-building'
      },
      {
        label: '开发者',
        description: '为开发者提供的工具和API',
        to: '/developers',
        icon: 'i-lucide-code'
      }
    ]
  },
  {
    label: '资源',
    icon: 'i-lucide-book-open',
    children: [
      {
        label: '文档',
        description: '详细的使用指南和API文档',
        to: '/docs',
        icon: 'i-lucide-file-text'
      },
      {
        label: '博客',
        description: '最新的技术文章和行业洞察',
        to: '/blog',
        icon: 'i-lucide-newspaper'
      },
      {
        label: '帮助中心',
        description: '常见问题和技术支持',
        to: '/help',
        icon: 'i-lucide-help-circle'
      }
    ]
  },
  
]

// 移动端导航菜单（扁平化结构）
const mobileNavigationItems = computed(() => {
  const flatItems: any[] = []
  
  navigationItems.forEach(item => {
    if (item.children) {
      // 添加父级项目
      flatItems.push({
        label: item.label,
        icon: item.icon,
        type: 'label'
      })
      // 添加子级项目
      item.children.forEach(child => {
        flatItems.push(child)
      })
    } else {
      flatItems.push(item)
    }
  })
  
  return [flatItems]
})

// 方法
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const handleLogin = () => {
  // 导航到登录页面
  navigateTo('/auth/login')
}

const handleRegister = () => {
  // 导航到注册页面
  navigateTo('/auth/register')
}

// 监听路由变化，关闭移动端菜单
const route = useRoute()
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

// 监听窗口大小变化，在大屏幕时关闭移动端菜单
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      isMobileMenuOpen.value = false
    }
  }
  
  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<style scoped>
/* 自定义样式 */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

/* 确保导航菜单在移动端正确显示 */
@media (max-width: 767px) {
  :deep(.navigation-menu) {
    width: 100%;
  }
}
</style> 