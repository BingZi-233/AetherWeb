<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-sm">
      <UCard class="shadow-sm">
        <div class="p-8 text-center">
          <div v-if="loading" class="space-y-4">
            <UIcon name="i-lucide-zap" class="w-12 h-12 animate-pulse mx-auto text-green-500" />
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">正在验证魔术链接</h2>
              <p class="text-gray-600 dark:text-gray-300">请稍候，我们正在处理您的登录请求</p>
            </div>
          </div>

          <div v-else-if="error" class="space-y-4">
            <UIcon name="i-lucide-x-circle" class="w-12 h-12 mx-auto text-red-500" />
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">验证失败</h2>
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
// 设置页面元数据
definePageMeta({
  title: '魔术链接验证 - AetherWeb',
  layout: 'default'
})

const appwrite = useAppwrite()
const route = useRoute()

const loading = ref(true)
const error = ref('')

const redirectToLogin = () => {
  navigateTo('/auth/login')
}

onMounted(async () => {
  try {
    // 从URL参数中获取userId和secret
    const userId = route.query.userId as string
    const secret = route.query.secret as string

    if (!userId || !secret) {
      error.value = '无效的魔术链接参数'
      return
    }

    // 使用魔术链接创建会话
    await appwrite.account.createSession(userId, secret)
    
    // 登录成功，延迟跳转
    setTimeout(async () => {
      await navigateTo('/dashboard')
    }, 1500)
    
  } catch (err: any) {
    console.error('魔术链接验证失败:', err)
    error.value = err.message || '魔术链接验证失败，请重新获取'
  } finally {
    loading.value = false
  }
})
</script> 