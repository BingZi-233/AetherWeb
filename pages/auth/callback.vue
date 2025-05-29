<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-sm">
      <UCard class="shadow-sm">
        <div class="p-8 text-center">
          <div v-if="loading" class="space-y-4">
            <UIcon name="i-lucide-loader-2" class="w-12 h-12 animate-spin mx-auto text-green-500" />
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">正在处理登录</h2>
              <p class="text-gray-600 dark:text-gray-300">请稍候，我们正在验证您的身份</p>
            </div>
          </div>

          <div v-else-if="error" class="space-y-4">
            <UIcon name="i-lucide-x-circle" class="w-12 h-12 mx-auto text-red-500" />
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">登录失败</h2>
              <p class="text-gray-600 dark:text-gray-300 mb-4">{{ error }}</p>
              <UButton @click="redirectToLogin" variant="outline" size="lg">
                返回登录页面
              </UButton>
            </div>
          </div>

          <div v-else class="space-y-4">
            <UIcon name="i-lucide-check-circle" class="w-12 h-12 mx-auto text-green-500" />
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">登录成功</h2>
              <p class="text-gray-600 dark:text-gray-300">正在跳转到仪表台...</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const appwrite = useAppwrite()

const loading = ref(true)
const error = ref('')

const redirectToLogin = () => {
  navigateTo('/auth/login')
}

onMounted(async () => {
  try {
    // 检查是否有会话
    const session = await appwrite.account.getSession('current')
    
    if (session) {
      // 获取用户信息检查邮箱验证状态
      const user = await appwrite.account.get()
      
      // 如果邮箱未验证，跳转到验证页面
      if (!user.emailVerification) {
        await navigateTo('/auth/verify-email')
      } else {
        // 邮箱已验证，跳转到仪表台
        await navigateTo('/dashboard')
      }
    } else {
      error.value = '未找到有效的登录会话'
    }
  } catch (err: any) {
    console.error('OAuth回调处理失败:', err)
    error.value = err.message || '登录验证失败，请重试'
  } finally {
    loading.value = false
  }
})
</script> 