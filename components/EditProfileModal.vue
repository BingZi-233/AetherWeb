<template>
  <UModal>
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">编辑个人资料</h3>
        </template>

        <UForm
          ref="form"
          :schema="schema"
          :state="state"
          @submit="updateProfile"
          class="space-y-4"
        >
          <UFormField label="姓名" name="name">
            <UInput v-model="state.name" placeholder="请输入您的姓名" class="w-full" />
          </UFormField>

          <UFormField label="邮箱" name="email">
            <UInput
              v-model="state.email"
              type="email"
              placeholder="请输入邮箱地址"
              disabled
              class="w-full"
            />
            <template #help>
              <span class="text-xs text-gray-500">邮箱地址无法修改</span>
            </template>
          </UFormField>

          <UFormField label="手机号码" name="phone" help="可选">
            <div class="flex">
              <div class="flex items-center px-3 bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md text-sm text-gray-600 dark:text-gray-400">
                +86
              </div>
              <UInput
                v-model="state.phone"
                type="tel"
                placeholder="请输入手机号码"
                class="flex-1 rounded-l-none"
              />
            </div>
          </UFormField>

          <UFormField 
            label="密码确认" 
            name="password" 
            help="修改个人资料需要输入密码确认"
          >
            <UInput
              v-model="state.password"
              type="password"
              placeholder="请输入您的密码"
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
              @click="updateProfile"
            >
              保存
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Models } from 'appwrite'
import { z } from 'zod'

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

const isLoading = ref(false)

// 表单验证模式
const schema = z.object({
  name: z.string().min(1, '请输入姓名'),
  email: z.string().email('请输入有效的邮箱地址'),
  phone: z.string().optional().refine((val) => {
    if (!val) return true // 可选字段
    return /^1[3-9]\d{9}$/.test(val)
  }, '请输入有效的手机号码'),
  password: z.string().min(1, '请输入密码确认')
})

// 表单状态
const state = reactive({
  name: props.user?.name || '',
  email: props.user?.email || '',
  phone: props.user?.phone?.startsWith('+86') ? props.user.phone.slice(3) : (props.user?.phone || ''),
  password: ''
})

const updateProfile = async () => {
  try {
    isLoading.value = true
    
    // 检查是否有任何修改
    const hasNameChange = state.name !== props.user?.name
    const currentUserPhone = props.user?.phone?.startsWith('+86') ? props.user.phone.slice(3) : (props.user?.phone || '')
    const hasPhoneChange = state.phone !== currentUserPhone
    
    if (!hasNameChange && !hasPhoneChange) {
      toast.add({
        title: '提示',
        description: '没有检测到任何修改',
        color: 'warning'
      })
      closeModal()
      return
    }
    
    // 更新用户名
    if (hasNameChange) {
      await account.updateName(state.name)
    }
    
    // 更新手机号
    if (hasPhoneChange) {
      if (state.phone) {
        const fullPhoneNumber = `+86${state.phone}`
        await account.updatePhone(fullPhoneNumber, state.password)
      }
    }
    
    toast.add({
      title: '成功',
      description: '个人资料更新成功'
    })
    
    props.onSuccess?.()
    closeModal()
  } catch (err: any) {
    toast.add({
      title: '更新失败',
      description: err.message || '请检查密码是否正确',
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