<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-sm">
      <!-- 邮箱验证卡片 -->
      <UCard class="shadow-sm">
        <div class="p-6">
          <!-- 标题和图标 -->
          <div class="text-center mb-6">
            <div class="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <Icon 
                :name="verificationStatus === 'verified' ? 'i-lucide-check-circle' : 'i-lucide-mail'" 
                class="w-8 h-8"
                :class="verificationStatus === 'verified' ? 'text-green-600' : 'text-green-600'"
              />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ pageTitle }}
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ pageDescription }}
            </p>
          </div>

          <!-- 验证状态内容 -->
          <div v-if="verificationStatus === 'pending'" class="space-y-4">
            <div class="text-center">
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                我们已向您的邮箱发送了验证链接：
              </p>
              <p class="font-medium text-gray-900 dark:text-white mb-6">
                {{ userEmail }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                请检查您的邮箱（包括垃圾邮件文件夹）并点击验证链接完成验证。
              </p>
            </div>

            <!-- 重新发送验证邮件 -->
            <UButton
              @click="resendVerificationEmail"
              variant="outline"
              block
              size="lg"
              :loading="resendLoading"
              :disabled="resendCooldown > 0"
              color="success"
              class="w-full"
            >
              <template v-if="resendCooldown > 0">
                {{ resendCooldown }}秒后可重新发送
              </template>
              <template v-else>
                重新发送验证邮件
              </template>
            </UButton>

            <!-- 手动检查验证状态 -->
            <UButton
              @click="checkVerificationStatus"
              variant="subtle"
              block
              size="lg"
              :loading="checkLoading"
              color="success"
              class="w-full"
            >
              我已验证，检查状态
            </UButton>
          </div>

          <!-- 验证成功状态 -->
          <div v-else-if="verificationStatus === 'verified'" class="space-y-4">
            <div class="text-center">
              <p class="text-green-600 dark:text-green-400 font-medium mb-4">
                邮箱验证成功！
              </p>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                您的账户已激活，现在可以使用所有功能。
              </p>
            </div>

            <UButton
              @click="goToDashboard"
              block
              size="lg"
              color="success"
              class="w-full"
            >
              进入仪表台
            </UButton>
          </div>

          <!-- 验证失败状态 -->
          <div v-else-if="verificationStatus === 'failed'" class="space-y-4">
            <div class="text-center">
              <p class="text-red-600 dark:text-red-400 font-medium mb-4">
                验证失败
              </p>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                验证链接可能已过期或无效。请重新发送验证邮件。
              </p>
            </div>

            <UButton
              @click="resendVerificationEmail"
              block
              size="lg"
              :loading="resendLoading"
              color="success"
              class="w-full"
            >
              重新发送验证邮件
            </UButton>
          </div>

          <!-- 验证中状态 -->
          <div v-else-if="verificationStatus === 'verifying'" class="space-y-4">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p class="text-gray-600 dark:text-gray-400">
                正在验证您的邮箱...
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- 返回登录链接 -->
      <div class="text-center mt-6">
        <span class="text-gray-600 dark:text-gray-400">需要帮助？</span>
        <NuxtLink to="/auth/login" class="ml-1 text-green-600 hover:text-green-500 font-medium">
          返回登录
        </NuxtLink>
      </div>

      <!-- 错误提示 -->
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        class="mt-4"
        :title="error"
        :close-button="{ icon: 'i-lucide-x', color: 'gray', variant: 'link', padded: false }"
        @close="error = ''"
      />

      <!-- 成功提示 -->
      <UAlert
        v-if="successMessage"
        color="success"
        variant="soft"
        class="mt-4"
        :title="successMessage"
        :close-button="{ icon: 'i-lucide-x', color: 'gray', variant: 'link', padded: false }"
        @close="successMessage = ''"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// 设置页面元数据
definePageMeta({
  title: '邮箱验证 - AetherWeb',
  middleware: 'auth'
})

const appwrite = useAppwrite()
const route = useRoute()

// 响应式数据
const verificationStatus = ref<'pending' | 'verified' | 'failed' | 'verifying'>('pending')
const userEmail = ref('')
const error = ref('')
const successMessage = ref('')
const resendLoading = ref(false)
const checkLoading = ref(false)
const resendCooldown = ref(0)

// 计算属性
const pageTitle = computed(() => {
  switch (verificationStatus.value) {
    case 'verified':
      return '验证成功'
    case 'failed':
      return '验证失败'
    case 'verifying':
      return '验证中'
    default:
      return '验证您的邮箱'
  }
})

const pageDescription = computed(() => {
  switch (verificationStatus.value) {
    case 'verified':
      return '您的邮箱已成功验证'
    case 'failed':
      return '邮箱验证遇到问题'
    case 'verifying':
      return '请稍候，正在处理验证'
    default:
      return '请查看您的邮箱并点击验证链接'
  }
})

// 获取当前用户信息
const getCurrentUser = async () => {
  try {
    const user = await appwrite.account.get()
    userEmail.value = user.email
    
    // 检查邮箱是否已验证
    if (user.emailVerification) {
      verificationStatus.value = 'verified'
    }
    
    return user
  } catch (err: any) {
    // 如果用户未登录，重定向到登录页
    if (err.code === 401) {
      await navigateTo('/auth/login')
    } else {
      error.value = '获取用户信息失败'
    }
    return null
  }
}

// 处理URL中的验证参数
const handleVerificationFromURL = async () => {
  const userId = route.query.userId as string
  const secret = route.query.secret as string
  
  if (userId && secret) {
    verificationStatus.value = 'verifying'
    
    try {
      // 使用Appwrite的验证API
      await appwrite.account.updateVerification(userId, secret)
      verificationStatus.value = 'verified'
      successMessage.value = '邮箱验证成功！'
      
      // 清除URL参数
      await navigateTo('/auth/verify-email', { replace: true })
    } catch (err: any) {
      verificationStatus.value = 'failed'
      error.value = err.message || '验证失败，请重试'
    }
  }
}

// 重新发送验证邮件
const resendVerificationEmail = async () => {
  try {
    resendLoading.value = true
    error.value = ''
    
    // 发送验证邮件
    const redirectUrl = `${window.location.origin}/auth/verify-email`
    await appwrite.account.createVerification(redirectUrl)
    
    successMessage.value = '验证邮件已重新发送，请检查您的邮箱'
    
    // 设置冷却时间（60秒）
    resendCooldown.value = 60
    const countdown = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearInterval(countdown)
      }
    }, 1000)
    
  } catch (err: any) {
    error.value = err.message || '发送验证邮件失败，请重试'
  } finally {
    resendLoading.value = false
  }
}

// 检查验证状态
const checkVerificationStatus = async () => {
  try {
    checkLoading.value = true
    error.value = ''
    
    const user = await appwrite.account.get()
    
    if (user.emailVerification) {
      verificationStatus.value = 'verified'
      successMessage.value = '邮箱验证成功！'
    } else {
      error.value = '邮箱尚未验证，请检查您的邮箱'
    }
    
  } catch (err: any) {
    error.value = err.message || '检查验证状态失败'
  } finally {
    checkLoading.value = false
  }
}

// 跳转到仪表台
const goToDashboard = async () => {
  await navigateTo('/dashboard')
}

// 页面初始化
onMounted(async () => {
  // 首先处理URL中的验证参数
  await handleVerificationFromURL()
  
  // 如果不是从验证链接来的，获取用户信息
  if (verificationStatus.value === 'pending') {
    await getCurrentUser()
  }
})
</script> 