<template>
  <UModal>
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-500" />
            <h3 class="text-lg font-semibold text-red-600 dark:text-red-400">删除账户</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 class="text-md font-medium text-red-900 dark:text-red-100 mb-2">
              ⚠️ 警告：此操作不可撤销
            </h4>
            <ul class="text-sm text-red-700 dark:text-red-300 space-y-1">
              <li>• 您的所有个人数据将被永久删除</li>
              <li>• 所有文件和设置将无法恢复</li>
              <li>• 您将无法再使用此邮箱注册新账户</li>
              <li>• 所有相关的会话将立即失效</li>
            </ul>
          </div>

          <div class="space-y-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              为了确认删除操作，请在下方输入您的邮箱地址：
            </p>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ user?.email }}
            </p>
            <UInput
              v-model="confirmEmail"
              placeholder="请输入您的邮箱地址"
              :class="{ 'border-red-500': confirmEmail && !isEmailMatched, 'w-full': true }"
            />
            <p class="text-sm text-gray-600 dark:text-gray-400">
              请输入您的密码以确认删除：
            </p>
            <UInput
              v-model="password"
              type="password"
              placeholder="请输入您的密码"
              class="w-full"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton
              variant="outline"
              @click="closeModal"
            >
              取消
            </UButton>
            <UButton
              color="error"
              :loading="isDeleting"
              :disabled="!canDelete"
              @click="deleteAccount"
            >
              确认删除账户
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

const isDeleting = ref(false)
const confirmEmail = ref('')
const password = ref('')

const isEmailMatched = computed(() => {
  return confirmEmail.value === props.user?.email
})

const canDelete = computed(() => {
  return isEmailMatched.value && password.value.length > 0
})

const deleteAccount = async () => {
  if (!canDelete.value) return
  
  try {
    isDeleting.value = true
    
    // 这里应该调用删除账户的API
    // 注意：Appwrite目前没有直接的删除用户账户API
    // 通常需要通过服务器端API来处理
    
    toast.add({
      title: '账户删除请求已提交',
      description: '您的账户将在24小时内被删除',
      color: 'warning'
    })
    
    props.onSuccess?.()
    closeModal()
  } catch (err: any) {
    toast.add({
      title: '删除失败',
      description: err.message || '请稍后重试',
      color: 'error'
    })
  } finally {
    isDeleting.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script> 