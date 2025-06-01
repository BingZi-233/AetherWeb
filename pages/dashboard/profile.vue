<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">个人资料</h1>
        <p class="text-gray-600 dark:text-gray-400">管理您的个人信息和账户设置</p>
      </div>
      <UButton
        icon="i-lucide-refresh-cw"
        variant="outline"
        @click="refreshUserData"
        :loading="isRefreshing"
      >
        刷新数据
      </UButton>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- 错误状态 -->
    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="soft"
      :title="error.title"
      :description="error.message"
      :close-button="{ icon: 'i-lucide-x', color: 'gray', variant: 'link', padded: false }"
      @close="error = null"
    />

    <template v-if="!isLoading && user">
      <!-- 用户基本信息卡片 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">基本信息</h3>
            <UBadge
              :color="user.status ? 'success' : 'error'"
              variant="subtle"
              :label="user.status ? '已激活' : '未激活'"
            />
          </div>
        </template>

        <div class="space-y-6">
          <!-- 头像和基本信息 -->
          <div class="flex items-center space-x-6">
            <div class="relative group cursor-pointer" @click="openAvatarModal">
              <UAvatar
                :src="userAvatarUrl"
                :alt="user.name || '用户'"
                size="3xl"
                class="ring-4 ring-white dark:ring-gray-800 shadow-lg transition-all group-hover:ring-primary-500"
              />
              <div class="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <UIcon name="i-lucide-camera" class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="flex-1">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ user.name || '未设置姓名' }}
              </h4>
              <p class="text-gray-500 dark:text-gray-400">{{ user.email }}</p>
              <div class="flex items-center space-x-4 mt-2 text-sm text-gray-400 dark:text-gray-500">
                <span>注册时间：{{ formatDate(user.registration) }}</span>
                <span>最后登录：{{ formatDate(user.accessedAt) }}</span>
              </div>
              <div class="flex items-center space-x-2 mt-2">
                <UBadge
                  v-if="user.emailVerification"
                  color="success"
                  variant="subtle"
                  label="邮箱已验证"
                />
                <UBadge
                  v-else
                  color="warning"
                  variant="subtle"
                  label="邮箱未验证"
                />
                <UBadge
                  v-if="user.phoneVerification"
                  color="success"
                  variant="subtle"
                  label="手机已验证"
                />
                <UBadge
                  v-if="user.mfa"
                  color="primary"
                  variant="subtle"
                  label="已启用MFA"
                />
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex flex-wrap gap-3">
            <UButton
              icon="i-lucide-edit"
              variant="outline"
              @click="openEditProfileModal"
            >
              编辑资料
            </UButton>
            <UButton
              icon="i-lucide-key"
              variant="outline"
              @click="openChangePasswordModal"
            >
              修改密码
            </UButton>
            <UButton
              v-if="!user.emailVerification"
              icon="i-lucide-mail"
              variant="outline"
              color="warning"
              @click="sendEmailVerification"
              :loading="isVerifyingEmail"
            >
              验证邮箱
            </UButton>
            <UButton
              icon="i-lucide-shield"
              variant="outline"
              @click="openSecurityModal"
            >
              安全设置
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- 账户统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {{ sessions.length }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">活跃会话</div>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ user.mfa ? '已启用' : '未启用' }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">多因素认证</div>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ formatDate(user.registration).split(' ')[0] }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">注册日期</div>
          </div>
        </UCard>
      </div>

      <!-- 会话管理卡片 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">活跃会话</h3>
            <div class="flex items-center space-x-2">
              <UButton
                icon="i-lucide-log-out"
                variant="outline"
                size="sm"
                color="error"
                @click="logoutAllSessions"
                :loading="isLoggingOutAll"
                :disabled="sessions.length <= 1"
              >
                退出所有会话
              </UButton>
              <UButton
                icon="i-lucide-refresh-cw"
                variant="outline"
                size="sm"
                @click="refreshSessions"
                :loading="isLoadingSessions"
              >
                刷新
              </UButton>
            </div>
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="session in sessions"
            :key="session.$id"
            class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <UIcon
                :name="getDeviceIcon(session.clientName)"
                class="w-5 h-5 text-gray-500 dark:text-gray-400"
              />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ session.clientName }} {{ session.clientVersion }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ session.countryName }} • {{ formatDate(session.$createdAt) }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500">
                  IP: {{ session.ip }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <UBadge
                :color="session.current ? 'success' : 'neutral'"
                variant="subtle"
                :label="session.current ? '当前会话' : '其他会话'"
              />
              <UButton
                v-if="!session.current"
                icon="i-lucide-log-out"
                variant="ghost"
                size="sm"
                color="error"
                @click="deleteSession(session.$id)"
                :loading="deletingSessionId === session.$id"
              >
                退出
              </UButton>
              <span v-else class="text-xs text-gray-400 px-2">
                当前设备
              </span>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="sessions.length === 0" class="text-center py-8">
            <UIcon name="i-lucide-monitor-off" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400">暂无活跃会话</p>
          </div>
        </div>
      </UCard>

      <!-- 偏好设置卡片 -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">偏好设置</h3>
        </template>

        <div class="space-y-6">
          <!-- 主题设置 -->
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white">主题模式</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                选择您偏好的界面主题
              </p>
            </div>
            <USelect
              v-model="themePreference"
              :items="themeOptions"
              class="w-32"
              @change="updateTheme"
            />
          </div>

          <!-- 通知设置 -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 dark:text-white">通知设置</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">邮件通知</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">接收重要更新和消息</p>
                </div>
                <USwitch v-model="notificationSettings.email" @change="updateNotificationSettings" />
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">桌面通知</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">在浏览器中显示通知</p>
                </div>
                <USwitch v-model="notificationSettings.desktop" @change="updateNotificationSettings" />
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- 危险操作卡片 -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-red-600 dark:text-red-400">危险操作</h3>
        </template>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div>
              <h4 class="text-md font-medium text-red-900 dark:text-red-100">删除账户</h4>
              <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                永久删除您的账户和所有相关数据，此操作不可撤销
              </p>
            </div>
            <UButton
              variant="outline"
              color="error"
              @click="openDeleteAccountModal"
            >
              删除账户
            </UButton>
          </div>
        </div>
      </UCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Models } from 'appwrite'
import AvatarUploadModal from '~/components/AvatarUploadModal.vue'
import EditProfileModal from '~/components/EditProfileModal.vue'
import ChangePasswordModal from '~/components/ChangePasswordModal.vue'
import SecuritySettingsModal from '~/components/SecuritySettingsModal.vue'
import DeleteAccountModal from '~/components/DeleteAccountModal.vue'

// 设置页面元数据
definePageMeta({
  layout: 'dashboard',
  title: '个人资料 - 仪表台 - AetherWeb',
  middleware: 'auth'
})

// Appwrite相关
const { account, storage } = useAppwrite()

// 头像相关
const { createAvatarUrl, triggerUserUpdate } = useUserAvatar()

// 主题相关
const colorMode = useColorMode()

// 弹窗管理
const overlay = useOverlay()

// 响应式状态
const user = ref<Models.User<Models.Preferences> | null>(null)
const sessions = ref<Models.Session[]>([])
const isLoading = ref(true)
const isRefreshing = ref(false)
const isLoadingSessions = ref(false)
const isLoggingOutAll = ref(false)
const isVerifyingEmail = ref(false)
const deletingSessionId = ref<string | null>(null)
const error = ref<{ title: string; message: string } | null>(null)

// 偏好设置
const themePreference = ref(colorMode.preference)
const notificationSettings = reactive({
  email: true,
  desktop: false
})

// 选项数据
const themeOptions = [
  { label: '跟随系统', value: 'system' },
  { label: '浅色模式', value: 'light' },
  { label: '深色模式', value: 'dark' }
]

// 计算属性
const userAvatarUrl = createAvatarUrl(user, 128)

// 工具函数
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const showError = (title: string, message: string) => {
  error.value = { title, message }
}

const showSuccess = (message: string) => {
  // 使用toast通知
  const toast = useToast()
  toast.add({ title: '成功', description: message })
}

// 主要方法
const getCurrentUser = async () => {
  try {
    const currentUser = await account.get()
    user.value = currentUser
    
    // 设置偏好
    notificationSettings.email = currentUser.prefs?.notifications?.email ?? true
    notificationSettings.desktop = currentUser.prefs?.notifications?.desktop ?? false
    
    // 触发用户更新事件，通知其他组件
    triggerUserUpdate()
  } catch (err: any) {
    showError('获取用户信息失败', err.message || '请稍后重试')
  }
}

const refreshUserData = async () => {
  isRefreshing.value = true
  try {
    await getCurrentUser()
    await getSessions()
    showSuccess('数据刷新成功')
  } catch (err: any) {
    showError('刷新失败', err.message || '请稍后重试')
  } finally {
    isRefreshing.value = false
  }
}

const sendEmailVerification = async () => {
  try {
    isVerifyingEmail.value = true
    const origin = window.location.origin
    await account.createVerification(`${origin}/auth/verify-email`)
    showSuccess('验证邮件已发送，请检查您的邮箱')
  } catch (err: any) {
    showError('发送验证邮件失败', err.message || '请稍后重试')
  } finally {
    isVerifyingEmail.value = false
  }
}

const getSessions = async () => {
  try {
    isLoadingSessions.value = true
    const response = await account.listSessions()
    sessions.value = response.sessions
  } catch (err: any) {
    showError('获取会话列表失败', err.message || '请稍后重试')
  } finally {
    isLoadingSessions.value = false
  }
}

const refreshSessions = async () => {
  await getSessions()
}

const deleteSession = async (sessionId: string) => {
  try {
    deletingSessionId.value = sessionId
    await account.deleteSession(sessionId)
    await getSessions()
    showSuccess('会话已删除')
  } catch (err: any) {
    showError('删除会话失败', err.message || '请稍后重试')
  } finally {
    deletingSessionId.value = null
  }
}

const getDeviceIcon = (clientName: string) => {
  const name = clientName.toLowerCase()
  if (name.includes('mobile') || name.includes('android') || name.includes('ios')) {
    return 'i-lucide-smartphone'
  } else if (name.includes('tablet') || name.includes('ipad')) {
    return 'i-lucide-tablet'
  } else {
    return 'i-lucide-monitor'
  }
}

const updateTheme = () => {
  colorMode.preference = themePreference.value
}

const updateNotificationSettings = async () => {
  try {
    const prefs = {
      ...user.value?.prefs,
      notifications: notificationSettings
    }
    
    await account.updatePrefs(prefs)
    showSuccess('通知设置已更新')
  } catch (err: any) {
    showError('更新通知设置失败', err.message || '请稍后重试')
  }
}

// 弹窗方法
const openAvatarModal = () => {
  const avatarModal = overlay.create(AvatarUploadModal)
  avatarModal.open({
    user: user.value,
    currentAvatarUrl: userAvatarUrl.value,
    onSuccess: async () => {
      await getCurrentUser()
      showSuccess('头像更新成功')
    }
  })
}

const openEditProfileModal = () => {
  const editModal = overlay.create(EditProfileModal)
  editModal.open({
    user: user.value,
    onSuccess: async () => {
      await getCurrentUser()
      showSuccess('个人资料更新成功')
    }
  })
}

const openChangePasswordModal = () => {
  const passwordModal = overlay.create(ChangePasswordModal)
  passwordModal.open({
    onSuccess: () => {
      showSuccess('密码更新成功')
    }
  })
}

const openSecurityModal = () => {
  const securityModal = overlay.create(SecuritySettingsModal)
  securityModal.open({
    user: user.value,
    onSuccess: async () => {
      await getCurrentUser()
      showSuccess('安全设置已更新')
    }
  })
}

const openDeleteAccountModal = () => {
  const deleteModal = overlay.create(DeleteAccountModal)
  deleteModal.open({
    user: user.value,
    onSuccess: async () => {
      showSuccess('账户删除成功')
      await navigateTo('/auth/login')
    }
  })
}

const logoutAllSessions = async () => {
  try {
    isLoggingOutAll.value = true
    await account.deleteSessions()
    await getSessions()
    showSuccess('所有会话已退出')
  } catch (err: any) {
    showError('退出所有会话失败', err.message || '请稍后重试')
  } finally {
    isLoggingOutAll.value = false
  }
}

// 组件挂载时的初始化
onMounted(async () => {
  try {
    isLoading.value = true
    await getCurrentUser()
    await getSessions()
  } catch (err: any) {
    showError('初始化失败', err.message || '请刷新页面重试')
  } finally {
    isLoading.value = false
  }
})
</script> 