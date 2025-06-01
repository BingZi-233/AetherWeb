<template>
  <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 主要内容区域 -->
      <div class="py-12 lg:py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <!-- 公司信息 -->
          <div class="lg:col-span-1">
            <div class="flex items-center space-x-2 mb-4">
              <UIcon name="i-lucide-zap" class="w-8 h-8 text-primary-500" />
              <span class="text-xl font-bold text-gray-900 dark:text-white">
                AetherWeb
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
              构建现代化的Web应用程序，为您的业务提供强大的数字化解决方案。
            </p>
            
            <!-- 社交媒体链接 -->
            <div class="flex space-x-4">
              <UButton
                v-for="social in socialLinks"
                :key="social.name"
                :icon="social.icon"
                variant="ghost"
                color="neutral"
                size="sm"
                :to="social.url"
                target="_blank"
                :aria-label="social.name"
              />
            </div>
          </div>

          <!-- 产品链接 -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              产品
            </h3>
            <ul class="space-y-3">
              <li v-for="link in productLinks" :key="link.name">
                <NuxtLink
                  :to="link.url"
                  class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  {{ link.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- 解决方案链接 -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              解决方案
            </h3>
            <ul class="space-y-3">
              <li v-for="link in solutionLinks" :key="link.name">
                <NuxtLink
                  :to="link.url"
                  class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  {{ link.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- 支持链接 -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              支持
            </h3>
            <ul class="space-y-3">
              <li v-for="link in supportLinks" :key="link.name">
                <NuxtLink
                  :to="link.url"
                  class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  {{ link.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="border-t border-gray-200 dark:border-gray-800"></div>

      <!-- 底部信息 -->
      <div class="py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <!-- 版权信息 -->
          <div class="text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {{ currentYear }} AetherWeb. 保留所有权利。
            </p>
          </div>

          <!-- 法律链接 -->
          <div class="flex flex-wrap items-center space-x-6">
            <NuxtLink
              v-for="link in legalLinks"
              :key="link.name"
              :to="link.url"
              class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              {{ link.name }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 回到顶部按钮 -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-2 opacity-0"
      >
        <div
          v-if="showBackToTop"
          class="fixed bottom-8 right-8 z-40"
        >
          <UButton
            icon="i-lucide-arrow-up"
            variant="solid"
            color="primary"
            size="lg"
            @click="scrollToTop"
            class="rounded-full shadow-lg"
            aria-label="回到顶部"
          />
        </div>
      </Transition>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 响应式状态
const showBackToTop = ref(false)

// 计算当前年份
const currentYear = new Date().getFullYear()

// 社交媒体链接
const socialLinks = [
  {
    name: 'GitHub',
    icon: 'i-simple-icons-github',
    url: 'https://github.com/BingZi-233/AetherWeb'
  }
]

// 产品链接
const productLinks = [
  { name: '功能特性', url: '/features' },
  { name: '定价方案', url: '/pricing' },
  { name: '集成服务', url: '/integrations' },
  { name: 'API文档', url: '/api' }
]

// 解决方案链接
const solutionLinks = [
  { name: '企业版', url: '/enterprise' },
  { name: '开发者工具', url: '/developers' },
  { name: '初创公司', url: '/startups' },
  { name: '教育机构', url: '/education' }
]

// 支持链接
const supportLinks = [
  { name: '帮助中心', url: '/help' },
  { name: '文档', url: '/docs' },
  { name: '社区论坛', url: '/community' },
  { name: '联系我们', url: '/contact' }
]

// 法律链接
const legalLinks = [
  { name: '隐私政策', url: '/privacy' },
  { name: '服务条款', url: '/terms' },
  { name: 'Cookie政策', url: '/cookies' }
]

// 滚动到顶部功能
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听滚动事件，控制回到顶部按钮显示
onMounted(() => {
  const handleScroll = () => {
    showBackToTop.value = window.scrollY > 300
  }

  window.addEventListener('scroll', handleScroll)
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style scoped>
/* 确保链接在移动端有足够的点击区域 */
@media (max-width: 767px) {
  a {
    display: block;
    padding: 0.25rem 0;
  }
}

/* 平滑的悬停效果 */
a {
  transition: color 0.2s ease-in-out;
}

/* 回到顶部按钮的阴影效果 */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 深色模式下的阴影调整 */
.dark .shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
}
</style> 