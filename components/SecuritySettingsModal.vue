<template>
  <UModal>
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">安全设置</h3>
        </template>

        <div class="space-y-6">
          <!-- 邮箱验证 -->
          <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white">邮箱验证</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                验证您的邮箱地址以提高账户安全性
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <UBadge
                :color="user?.emailVerification ? 'success' : 'warning'"
                variant="subtle"
                :label="user?.emailVerification ? '已验证' : '未验证'"
              />
              <UButton
                v-if="!user?.emailVerification"
                size="sm"
                variant="outline"
                @click="sendEmailVerification"
                :loading="isVerifyingEmail"
              >
                发送验证邮件
              </UButton>
            </div>
          </div>

          <!-- 手机验证 -->
          <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white">手机验证</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                验证您的手机号码以接收安全通知
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <UBadge
                :color="user?.phoneVerification ? 'success' : 'warning'"
                variant="subtle"
                :label="user?.phoneVerification ? '已验证' : '未验证'"
              />
              <UButton
                v-if="!user?.phoneVerification && user?.phone"
                size="sm"
                variant="outline"
                @click="sendPhoneVerification"
                :loading="isVerifyingPhone"
              >
                发送验证短信
              </UButton>
            </div>
          </div>

          <!-- 多因素认证 -->
          <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white">多因素认证 (MFA)</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                为您的账户添加额外的安全层
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <UBadge
                :color="user?.mfa ? 'success' : 'neutral'"
                variant="subtle"
                :label="user?.mfa ? '已启用' : '未启用'"
              />
              <UButton
                size="sm"
                :variant="user?.mfa ? 'outline' : 'solid'"
                :color="user?.mfa ? 'error' : 'primary'"
                @click="toggleMFA"
                :loading="isTogglingMFA"
              >
                {{ user?.mfa ? '禁用' : '启用' }}
              </UButton>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              variant="outline"
              @click="closeModal"
            >
              关闭
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Models } from 'appwrite'

interface Props {
  user: Models.User<Models.Preferences> | null
  onSuccess?: () => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: [value?: any]
}>()

const { account } = useAppwrite()
const toast = useToast()

const isVerifyingEmail = ref(false)
const isVerifyingPhone = ref(false)
const isTogglingMFA = ref(false)

const sendEmailVerification = async () => {
  try {
    isVerifyingEmail.value = true
    const origin = window.location.origin
    await account.createVerification(`${origin}/verify-email`)
    
    toast.add({
      title: '成功',
      description: '验证邮件已发送，请检查您的邮箱'
    })
  } catch (err: any) {
    toast.add({
      title: '发送失败',
      description: err.message || '请稍后重试',
      color: 'error'
    })
  } finally {
    isVerifyingEmail.value = false
  }
}

const sendPhoneVerification = async () => {
  try {
    isVerifyingPhone.value = true
    await account.createPhoneVerification()
    
    toast.add({
      title: '成功',
      description: '验证短信已发送，请检查您的手机'
    })
  } catch (err: any) {
    toast.add({
      title: '发送失败',
      description: err.message || '请稍后重试',
      color: 'error'
    })
  } finally {
    isVerifyingPhone.value = false
  }
}

const toggleMFA = async () => {
  try {
    isTogglingMFA.value = true
    
    if (props.user?.mfa) {
      // 禁用MFA的逻辑
      toast.add({
        title: '提示',
        description: 'MFA禁用功能需要额外验证',
        color: 'warning'
      })
    } else {
      // 启用MFA的逻辑
      toast.add({
        title: '提示',
        description: 'MFA启用功能需要配置认证器应用',
        color: 'info'
      })
    }
  } catch (err: any) {
    toast.add({
      title: '操作失败',
      description: err.message || '请稍后重试',
      color: 'error'
    })
  } finally {
    isTogglingMFA.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script> 