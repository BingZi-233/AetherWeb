<template>
  <UModal>
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">修改密码</h3>
        </template>

        <UForm
          ref="form"
          :schema="schema"
          :state="state"
          @submit="changePassword"
          class="space-y-4"
        >
          <UFormField label="当前密码" name="currentPassword">
            <UInput
              v-model="state.currentPassword"
              type="password"
              placeholder="请输入当前密码"
              class="w-full"
            />
          </UFormField>

          <UFormField label="新密码" name="newPassword">
            <UInput
              v-model="state.newPassword"
              type="password"
              placeholder="请输入新密码"
              class="w-full"
            />
          </UFormField>

          <UFormField label="确认新密码" name="confirmPassword">
            <UInput
              v-model="state.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              class="w-full"
            />
          </UFormField>
        </UForm>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton
              variant="outline"
              @click="closeModal"
            >
              取消
            </UButton>
            <UButton
              :loading="isLoading"
              @click="changePassword"
            >
              修改密码
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'

interface Props {
  onSuccess?: () => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: [value?: any]
}>()

const { account } = useAppwrite()
const toast = useToast()

const isLoading = ref(false)

// 表单验证模式
const schema = z.object({
  currentPassword: z.string().min(1, '请输入当前密码'),
  newPassword: z.string().min(8, '新密码至少需要8个字符'),
  confirmPassword: z.string().min(1, '请确认新密码')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword']
})

// 表单状态
const state = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const changePassword = async () => {
  try {
    isLoading.value = true
    
    await account.updatePassword(
      state.newPassword,
      state.currentPassword
    )
    
    toast.add({
      title: '成功',
      description: '密码修改成功'
    })
    
    props.onSuccess?.()
    closeModal()
  } catch (err: any) {
    toast.add({
      title: '密码修改失败',
      description: err.message || '请检查当前密码是否正确',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script> 