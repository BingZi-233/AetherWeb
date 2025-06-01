<template>
  <div>
    <!-- 英雄区域 -->
    <section class="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            专业的
            <span class="text-primary-600 dark:text-primary-400">Minecraft插件</span>
            授权平台
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            为服务器管理员和开发者提供安全可靠的插件授权服务，保护知识产权，提升服务器运营效率。
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              label="立即授权"
              size="lg"
              color="primary"
              variant="solid"
              trailing-icon="i-lucide-arrow-right"
              @click="navigateTo('/auth/register')"
            />
            <UButton
              label="查看插件"
              size="lg"
              color="neutral"
              variant="outline"
              leading-icon="i-lucide-package"
              @click="navigateTo('/dashboard/plugins')"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 特性展示 -->
    <section class="py-20 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            为什么选择我们的授权平台
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            我们专注于为Minecraft社区提供专业的插件授权解决方案，保障开发者权益，提升用户体验。
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UCard
            v-for="feature in features"
            :key="feature.title"
            class="text-center"
          >
            <template #header>
              <div class="flex justify-center mb-4">
                <UIcon
                  :name="feature.icon"
                  class="w-12 h-12 text-primary-500"
                />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ feature.title }}
              </h3>
            </template>

            <template #default>
              <p class="text-gray-600 dark:text-gray-300">
                {{ feature.description }}
              </p>
            </template>
          </UCard>
        </div>
      </div>
    </section>

    <!-- 工作流程 -->
    <section class="py-20 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            简单三步，开始授权
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            我们简化了授权流程，让开发者和服务器管理员都能轻松使用
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-lucide-user-plus" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. 注册账户</h3>
            <p class="text-gray-600 dark:text-gray-300">
              快速注册开发者或服务器管理员账户，验证身份信息
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-lucide-upload" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. 上传插件</h3>
            <p class="text-gray-600 dark:text-gray-300">
              上传您的插件文件，设置授权参数和使用条款
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-lucide-shield-check" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. 开始授权</h3>
            <p class="text-gray-600 dark:text-gray-300">
              生成授权密钥，开始安全的插件分发和使用
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据统计 -->
    <section class="py-20 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            平台数据一览
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            我们为Minecraft社区提供的专业服务得到了广泛认可
          </p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl sm:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              1,200+
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              授权插件
            </div>
          </div>

          <div class="text-center">
            <div class="text-4xl sm:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              5,000+
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              活跃服务器
            </div>
          </div>

          <div class="text-center">
            <div class="text-4xl sm:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              99.9%
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              服务可用性
            </div>
          </div>

          <div class="text-center">
            <div class="text-4xl sm:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              24/7
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              技术支持
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 客户评价 -->
    <section class="py-20 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            用户评价
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            听听我们的用户怎么说
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UCard class="text-center" v-for="testimonial in testimonials" :key="testimonial.id">
            <template #header>
              <div class="flex items-center justify-center mb-4">
                <UAvatar
                  :src="testimonial.avatar"
                  alt="User Avatar"
                  size="lg"
                  class="mb-4"
                />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ testimonial.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ testimonial.role }}
              </p>
            </template>

            <template #default>
              <p class="text-gray-600 dark:text-gray-300 italic">
                {{ testimonial.content }}
              </p>
            </template>
          </UCard>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="py-20 bg-primary-600 dark:bg-primary-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          准备开始您的插件授权之旅？
        </h2>
        <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          立即加入我们的平台，体验专业的Minecraft插件授权服务
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            label="免费注册"
            size="lg"
            color="neutral"
            variant="solid"
            trailing-icon="i-lucide-arrow-right"
            @click="navigateTo('/auth/register')"
          />
          <UButton
            label="联系客服"
            size="lg"
            color="neutral"
            variant="outline"
            leading-icon="i-lucide-message-circle"
            @click="navigateTo('/auth/login')"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
// 页面元数据
definePageMeta({
  title: 'AetherWeb - 专业的Minecraft插件授权平台',
  description: '为服务器管理员和开发者提供安全可靠的插件授权服务，保护知识产权，提升服务器运营效率。',
  layout: 'default'
})

useHead({
  title: 'AetherWeb - 专业的Minecraft插件授权平台',
  meta: [
    {
      name: 'description',
      content: '为服务器管理员和开发者提供安全可靠的插件授权服务，保护知识产权，提升服务器运营效率。'
    },
    {
      property: 'og:title',
      content: 'AetherWeb - 专业的Minecraft插件授权平台'
    },
    {
      property: 'og:description',
      content: '为服务器管理员和开发者提供安全可靠的插件授权服务，保护知识产权，提升服务器运营效率。'
    }
  ]
})

// 特性数据
const features = [
  {
    title: '安全授权',
    description: '采用先进的加密技术和授权验证机制，确保插件使用的安全性和合法性。',
    icon: 'i-lucide-shield-check'
  },
  {
    title: '实时验证',
    description: '支持实时在线验证，防止盗版使用，保护开发者的知识产权和收益。',
    icon: 'i-lucide-check-circle'
  },
  {
    title: '多服务器支持',
    description: '灵活的授权模式，支持单服务器、多服务器和集群部署的不同需求。',
    icon: 'i-lucide-server'
  },
  {
    title: '开发者友好',
    description: '提供完整的API接口和SDK，方便开发者快速集成授权系统到插件中。',
    icon: 'i-lucide-code-2'
  },
  {
    title: '数据统计',
    description: '详细的使用统计和分析报告，帮助开发者了解插件的使用情况和用户行为。',
    icon: 'i-lucide-bar-chart-3'
  },
  {
    title: '专业支持',
    description: '专业的技术支持团队，为开发者和服务器管理员提供及时的技术援助。',
    icon: 'i-lucide-headphones'
  }
]

// 客户评价数据
const testimonials = ref([
  {
    id: 1,
    name: '张开发者',
    role: '插件开发者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    content: 'AetherWeb的授权系统非常稳定，帮助我保护了插件的知识产权，同时提供了详细的使用统计。',
    rating: 5
  },
  {
    id: 2,
    name: '李管理员',
    role: '服务器管理员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    content: '授权流程简单快捷，技术支持响应及时，让我们的服务器运营更加顺畅。',
    rating: 5
  },
  {
    id: 3,
    name: '王团队',
    role: '开发团队负责人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    content: '多服务器授权功能很实用，API接口文档详细，集成过程非常顺利。',
    rating: 5
  }
])
</script>

<style scoped>
/* 渐变背景优化 */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* 确保卡片在移动端有合适的间距 */
@media (max-width: 767px) {
  .grid {
    gap: 1.5rem;
  }
}

/* 统计数据的动画效果 */
@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-3xl, .text-4xl {
  animation: countUp 0.6s ease-out;
}
</style>