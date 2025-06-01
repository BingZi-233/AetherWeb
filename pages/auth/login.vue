<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-sm">
      <!-- 登录卡片 -->
      <UCard class="shadow-sm">
        <div class="p-6">
          <!-- 标题 -->
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              登录账号
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              欢迎回来，请登录您的账户
            </p>
          </div>

          <!-- 登录表单 -->
          <form @submit.prevent="handleEmailLogin" class="space-y-4">
            <UInput
              v-model="emailForm.email"
              type="email"
              placeholder="请输入邮箱地址"
              :disabled="loading"
              required
              size="lg"
              class="w-full"
            />

            <UInput
              v-model="emailForm.password"
              type="password"
              placeholder="请输入密码"
              :disabled="loading"
              required
              size="lg"
              class="w-full"
            />

            <UButton
              type="submit"
              block
              size="lg"
              :loading="loading"
              :disabled="!emailForm.email || !emailForm.password"
              color="success"
              class="w-full"
            >
              登录
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

          <!-- GitHub登录 -->
          <UButton
            @click="handleGithubLogin"
            variant="outline"
            block
            size="lg"
            :loading="loading"
            icon="i-simple-icons-github"
            color="success"
            class="w-full"
          >
            使用 GitHub 登录
          </UButton>

          <!-- 魔术链接登录 -->
          <div class="mt-8">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              魔术链接登录
            </h3>
            
            <form @submit.prevent="handleMagicLink" class="space-y-4">
              <UInput
                v-model="magicLinkEmail"
                type="email"
                placeholder="请输入邮箱地址"
                :disabled="loading"
                required
                size="lg"
                class="w-full"
              />
              
              <UButton
                type="submit"
                variant="soft"
                block
                size="lg"
                :loading="loading"
                :disabled="!magicLinkEmail"
                color="success"
                class="w-full"
              >
                发送魔术链接
              </UButton>
            </form>
            
            <UAlert
              v-if="magicLinkSent"
              color="success"
              variant="soft"
              class="mt-4"
              title="魔术链接已发送"
              description="请查收您的邮箱并点击链接完成登录。"
            />
          </div>
        </div>
      </UCard>

      <!-- 注册链接 -->
      <div class="text-center mt-6">
        <span class="text-gray-600 dark:text-gray-400">还没有账户？</span>
        <NuxtLink to="/auth/register" class="ml-1 text-green-600 hover:text-green-500 font-medium">
          立即注册
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ID, OAuthProvider } from 'appwrite'

// 设置页面元数据
definePageMeta({
  title: '登录 - AetherWeb',
  middleware: 'guest'
})

const appwrite = useAppwrite()

// 响应式数据
const loading = ref(false)
const error = ref('')
const magicLinkSent = ref(false)

const emailForm = reactive({
  email: '',
  password: ''
})

const magicLinkEmail = ref('')

// 邮箱密码登录
const handleEmailLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    await appwrite.account.createEmailPasswordSession(emailForm.email, emailForm.password)
    
    // 获取用户信息检查邮箱验证状态
    const user = await appwrite.account.get()
    
    // 如果邮箱未验证，跳转到验证页面
    if (!user.emailVerification) {
      await navigateTo('/auth/verify-email')
    } else {
      // 邮箱已验证，跳转到仪表台
      await navigateTo('/dashboard')
    }
  } catch (err: any) {
    error.value = err.message || '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}

// GitHub登录
const handleGithubLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const redirectUrl = `${window.location.origin}/auth/callback`
    appwrite.account.createOAuth2Session(OAuthProvider.Github, redirectUrl, redirectUrl)
  } catch (err: any) {
    error.value = err.message || 'GitHub登录失败'
    loading.value = false
  }
}

// 魔术链接登录
const handleMagicLink = async () => {
  try {
    loading.value = true
    error.value = ''
    magicLinkSent.value = false
    
    const redirectUrl = `${window.location.origin}/auth/magic-link`
    await appwrite.account.createMagicURLToken(ID.unique(), magicLinkEmail.value, redirectUrl)
    
    magicLinkSent.value = true
    magicLinkEmail.value = ''
  } catch (err: any) {
    error.value = err.message || '发送魔术链接失败'
  } finally {
    loading.value = false
  }
}
</script> 