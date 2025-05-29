<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">系统设置</h1>
        <p class="text-gray-600 dark:text-gray-400">管理系统配置和用户偏好设置</p>
      </div>
      <div class="flex items-center space-x-3">
        <UButton
          icon="i-lucide-download"
          variant="outline"
          label="导出配置"
        />
        <UButton
          icon="i-lucide-save"
          variant="solid"
          label="保存设置"
          @click="saveSettings"
          :loading="isSaving"
        />
      </div>
    </div>

    <!-- 设置导航 -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in settingTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.id
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          <div class="flex items-center space-x-2">
            <UIcon :name="tab.icon" class="w-4 h-4" />
            <span>{{ tab.label }}</span>
          </div>
        </button>
      </nav>
    </div>

    <!-- 通用设置 -->
    <div v-if="activeTab === 'general'" class="space-y-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">基本信息</h3>
        </template>
        
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormGroup label="网站名称" required>
              <UInput
                v-model="settings.general.siteName"
                placeholder="输入网站名称"
              />
            </UFormGroup>
            
            <UFormGroup label="网站描述">
              <UInput
                v-model="settings.general.siteDescription"
                placeholder="输入网站描述"
              />
            </UFormGroup>
          </div>
          
          <UFormGroup label="网站URL">
            <UInput
              v-model="settings.general.siteUrl"
              placeholder="https://example.com"
            />
          </UFormGroup>
          
          <UFormGroup label="管理员邮箱">
            <UInput
              v-model="settings.general.adminEmail"
              type="email"
              placeholder="admin@example.com"
            />
          </UFormGroup>
          
          <UFormGroup label="时区">
            <USelectMenu
              v-model="settings.general.timezone"
              :options="timezoneOptions"
              placeholder="选择时区"
            />
          </UFormGroup>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">功能设置</h3>
        </template>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">用户注册</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">允许新用户注册账户</p>
            </div>
            <UToggle v-model="settings.general.allowRegistration" />
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">邮箱验证</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">新用户需要验证邮箱</p>
            </div>
            <UToggle v-model="settings.general.requireEmailVerification" />
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">维护模式</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">启用网站维护模式</p>
            </div>
            <UToggle v-model="settings.general.maintenanceMode" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- 安全设置 -->
    <div v-if="activeTab === 'security'" class="space-y-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">密码策略</h3>
        </template>
        
        <div class="space-y-6">
          <UFormGroup label="最小密码长度">
            <UInput
              v-model="settings.security.minPasswordLength"
              type="number"
              min="6"
              max="32"
            />
          </UFormGroup>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">要求大写字母</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">密码必须包含大写字母</p>
              </div>
              <UToggle v-model="settings.security.requireUppercase" />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">要求数字</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">密码必须包含数字</p>
              </div>
              <UToggle v-model="settings.security.requireNumbers" />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">要求特殊字符</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">密码必须包含特殊字符</p>
              </div>
              <UToggle v-model="settings.security.requireSpecialChars" />
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">登录安全</h3>
        </template>
        
        <div class="space-y-6">
          <UFormGroup label="最大登录尝试次数">
            <UInput
              v-model="settings.security.maxLoginAttempts"
              type="number"
              min="3"
              max="10"
            />
          </UFormGroup>
          
          <UFormGroup label="锁定时间（分钟）">
            <UInput
              v-model="settings.security.lockoutDuration"
              type="number"
              min="5"
              max="60"
            />
          </UFormGroup>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">双因素认证</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">启用双因素认证</p>
            </div>
            <UToggle v-model="settings.security.twoFactorAuth" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- 通知设置 -->
    <div v-if="activeTab === 'notifications'" class="space-y-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">邮件通知</h3>
        </template>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">新用户注册</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">有新用户注册时发送邮件</p>
            </div>
            <UToggle v-model="settings.notifications.newUserRegistration" />
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">系统错误</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">系统发生错误时发送邮件</p>
            </div>
            <UToggle v-model="settings.notifications.systemErrors" />
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">每日报告</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">每日发送系统报告</p>
            </div>
            <UToggle v-model="settings.notifications.dailyReports" />
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">SMTP 配置</h3>
        </template>
        
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormGroup label="SMTP 服务器">
              <UInput
                v-model="settings.notifications.smtpHost"
                placeholder="smtp.example.com"
              />
            </UFormGroup>
            
            <UFormGroup label="端口">
              <UInput
                v-model="settings.notifications.smtpPort"
                type="number"
                placeholder="587"
              />
            </UFormGroup>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormGroup label="用户名">
              <UInput
                v-model="settings.notifications.smtpUsername"
                placeholder="username@example.com"
              />
            </UFormGroup>
            
            <UFormGroup label="密码">
              <UInput
                v-model="settings.notifications.smtpPassword"
                type="password"
                placeholder="••••••••"
              />
            </UFormGroup>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">启用 SSL</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">使用 SSL 加密连接</p>
            </div>
            <UToggle v-model="settings.notifications.smtpSsl" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- 外观设置 -->
    <div v-if="activeTab === 'appearance'" class="space-y-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">主题设置</h3>
        </template>
        
        <div class="space-y-6">
          <UFormGroup label="默认主题">
            <USelectMenu
              v-model="settings.appearance.defaultTheme"
              :options="themeOptions"
              placeholder="选择默认主题"
            />
          </UFormGroup>
          
          <UFormGroup label="主色调">
            <div class="flex items-center space-x-4">
              <div
                v-for="color in colorOptions"
                :key="color.value"
                @click="settings.appearance.primaryColor = color.value"
                :class="[
                  'w-8 h-8 rounded-full cursor-pointer border-2 transition-all',
                  settings.appearance.primaryColor === color.value
                    ? 'border-gray-900 dark:border-white scale-110'
                    : 'border-gray-300 dark:border-gray-600'
                ]"
                :style="{ backgroundColor: color.color }"
              />
            </div>
          </UFormGroup>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">允许用户切换主题</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">用户可以自由切换明暗主题</p>
            </div>
            <UToggle v-model="settings.appearance.allowThemeSwitch" />
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">布局设置</h3>
        </template>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">紧凑模式</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">使用更紧凑的界面布局</p>
            </div>
            <UToggle v-model="settings.appearance.compactMode" />
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">显示侧边栏</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">默认显示侧边栏导航</p>
            </div>
            <UToggle v-model="settings.appearance.showSidebar" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// 设置页面元数据
definePageMeta({
  layout: 'dashboard',
  title: '系统设置',
  middleware: 'auth'
})

// 响应式数据
const activeTab = ref('general')
const isSaving = ref(false)

// 设置标签页
const settingTabs = [
  { id: 'general', label: '通用设置', icon: 'i-lucide-settings' },
  { id: 'security', label: '安全设置', icon: 'i-lucide-shield' },
  { id: 'notifications', label: '通知设置', icon: 'i-lucide-bell' },
  { id: 'appearance', label: '外观设置', icon: 'i-lucide-palette' }
]

// 时区选项
const timezoneOptions = [
  { label: 'UTC+8 (北京时间)', value: 'Asia/Shanghai' },
  { label: 'UTC+0 (格林威治时间)', value: 'UTC' },
  { label: 'UTC-5 (东部时间)', value: 'America/New_York' },
  { label: 'UTC-8 (太平洋时间)', value: 'America/Los_Angeles' }
]

// 主题选项
const themeOptions = [
  { label: '跟随系统', value: 'system' },
  { label: '明亮主题', value: 'light' },
  { label: '暗黑主题', value: 'dark' }
]

// 颜色选项
const colorOptions = [
  { label: '蓝色', value: 'blue', color: '#3B82F6' },
  { label: '绿色', value: 'green', color: '#10B981' },
  { label: '紫色', value: 'purple', color: '#8B5CF6' },
  { label: '红色', value: 'red', color: '#EF4444' },
  { label: '橙色', value: 'orange', color: '#F59E0B' },
  { label: '粉色', value: 'pink', color: '#EC4899' }
]

// 设置数据
const settings = ref({
  general: {
    siteName: 'AetherWeb',
    siteDescription: '现代化的 Web 应用平台',
    siteUrl: 'https://aetherweb.com',
    adminEmail: 'admin@aetherweb.com',
    timezone: 'Asia/Shanghai',
    allowRegistration: true,
    requireEmailVerification: true,
    maintenanceMode: false
  },
  security: {
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorAuth: false
  },
  notifications: {
    newUserRegistration: true,
    systemErrors: true,
    dailyReports: false,
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpSsl: true
  },
  appearance: {
    defaultTheme: 'system',
    primaryColor: 'blue',
    allowThemeSwitch: true,
    compactMode: false,
    showSidebar: true
  }
})

// 保存设置
const saveSettings = async () => {
  isSaving.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 这里可以添加实际的保存逻辑
    console.log('设置已保存:', settings.value)
    
    // 显示成功消息
    // 可以使用 useToast() 显示成功消息
    
  } catch (error) {
    console.error('保存设置失败:', error)
    // 显示错误消息
  } finally {
    isSaving.value = false
  }
}

// 页面标题
useHead({
  title: '系统设置 - AetherWeb'
})
</script> 