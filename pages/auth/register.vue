<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-sm">
      <!-- 注册卡片 -->
      <UCard class="shadow-sm">
        <div class="p-6">
          <!-- 标题 -->
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              注册账号
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              创建您的账号以开始使用
            </p>
          </div>

          <!-- 注册表单 -->
          <form @submit.prevent="handleRegister" class="space-y-4">
            <UInput
              v-model="registerForm.name"
              type="text"
              placeholder="请输入用户名"
              :disabled="loading"
              required
              size="lg"
              class="w-full"
            />

            <UInput
              v-model="registerForm.email"
              type="email"
              placeholder="请输入邮箱地址"
              :disabled="loading"
              required
              size="lg"
              class="w-full"
            />

            <UInput
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              :disabled="loading"
              required
              size="lg"
              class="w-full"
            />

            <UInput
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              :disabled="loading"
              required
              size="lg"
              class="w-full"
            />

            <!-- 服务条款 -->
            <div class="flex items-start space-x-2 text-sm">
              <UCheckbox
                v-model="agreeToTerms"
                :disabled="loading"
                class="mt-0.5"
              />
              <div class="text-gray-600 dark:text-gray-400">
                我已阅读并同意
                <a href="#" class="text-green-600 hover:text-green-500">服务条款</a>
                和
                <a href="#" class="text-green-600 hover:text-green-500">隐私政策</a>
                。注册即表示您同意我们的条款和条件，我们将保护您的个人信息安全。
              </div>
            </div>

            <UButton
              type="submit"
              block
              size="lg"
              :loading="loading"
              :disabled="!isFormValid"
              color="success"
              class="w-full"
            >
              注册
            </UButton>
          </form>

          <!-- 分割线 -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">或者使用</span>
            </div>
          </div>

          <!-- GitHub注册 -->
          <UButton
            @click="handleGithubRegister"
            variant="outline"
            block
            size="lg"
            :loading="loading"
            icon="i-simple-icons-github"
            color="success"
            class="w-full"
          >
            使用 GitHub 注册
          </UButton>
        </div>
      </UCard>

      <!-- 登录链接 -->
      <div class="text-center mt-6">
        <span class="text-gray-600 dark:text-gray-400">已有账户？</span>
        <NuxtLink to="/auth/login" class="ml-1 text-green-600 hover:text-green-500 font-medium">
          立即登录
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
        v-if="success"
        color="success"
        variant="soft"
        class="mt-4"
        title="注册成功！"
        description="正在跳转到邮箱验证页面..."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ID, OAuthProvider } from 'appwrite'

// 设置页面元数据
definePageMeta({
  title: '注册',
  middleware: 'guest'
})

const appwrite = useAppwrite()

// 响应式数据
const loading = ref(false)
const error = ref('')
const success = ref(false)
const agreeToTerms = ref(false)

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 表单验证
const isFormValid = computed(() => {
  return (
    registerForm.name.trim() &&
    registerForm.email.trim() &&
    registerForm.password.length >= 8 &&
    registerForm.password === registerForm.confirmPassword &&
    agreeToTerms.value
  )
})

// 邮箱密码注册
const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // 验证密码
    if (registerForm.password !== registerForm.confirmPassword) {
      error.value = '两次输入的密码不一致'
      return
    }
    
    if (registerForm.password.length < 8) {
      error.value = '密码长度至少为8位'
      return
    }
    
    if (!agreeToTerms.value) {
      error.value = '请同意服务条款和隐私政策'
      return
    }
    
    // 创建账户
    await appwrite.account.create(
      ID.unique(),
      registerForm.email,
      registerForm.password,
      registerForm.name
    )
    
    // 注册成功后自动登录
    await appwrite.account.createEmailPasswordSession(registerForm.email, registerForm.password)
    
    // 发送邮箱验证邮件
    try {
      const redirectUrl = `${window.location.origin}/auth/verify-email`
      await appwrite.account.createVerification(redirectUrl)
    } catch (verifyErr) {
      console.warn('发送验证邮件失败:', verifyErr)
      // 即使发送验证邮件失败，也继续注册流程
    }
    
    success.value = true
    
    // 延迟跳转到邮箱验证页面
    setTimeout(async () => {
      await navigateTo('/auth/verify-email')
    }, 1500)
    
  } catch (err: any) {
    error.value = err.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}

// GitHub注册
const handleGithubRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const redirectUrl = `${window.location.origin}/auth/callback`
    appwrite.account.createOAuth2Session(OAuthProvider.Github, redirectUrl, redirectUrl)
  } catch (err: any) {
    error.value = err.message || 'GitHub注册失败'
    loading.value = false
  }
}
</script> 