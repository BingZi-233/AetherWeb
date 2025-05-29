<template>
  <UModal>
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">更换头像</h3>
        </template>

        <div class="space-y-4">
          <div class="text-center">
            <UAvatar
              :src="previewAvatar || currentAvatarUrl"
              :alt="user?.name || '用户'"
              size="3xl"
              class="mx-auto"
            />
          </div>

          <div class="space-y-2">
            <UButton
              block
              variant="outline"
              @click="triggerFileUpload"
              icon="i-lucide-upload"
            >
              选择图片
            </UButton>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            />
            <p class="text-xs text-gray-500 text-center">
              支持 JPG、PNG、GIF 格式，最大 5MB
            </p>
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
              :loading="isUploading"
              :disabled="!selectedFile"
              @click="uploadAvatar"
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
import { ID } from 'appwrite'

interface Props {
  user: Models.User<Models.Preferences> | null
  currentAvatarUrl: string
  onSuccess?: () => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: [value?: any]
}>()

const { account, storage } = useAppwrite()
const toast = useToast()

const isUploading = ref(false)
const selectedFile = ref<File | null>(null)
const previewAvatar = ref('')
const fileInput = ref<HTMLInputElement>()

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 检查文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        title: '文件过大',
        description: '请选择小于5MB的图片文件',
        color: 'error'
      })
      return
    }
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      toast.add({
        title: '文件类型错误',
        description: '请选择图片文件',
        color: 'error'
      })
      return
    }
    
    selectedFile.value = file
    
    // 创建预览
    const reader = new FileReader()
    reader.onload = (e) => {
      previewAvatar.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const uploadAvatar = async () => {
  if (!selectedFile.value) return
  
  try {
    isUploading.value = true
    
    // 上传文件到Appwrite Storage
    const fileId = ID.unique()
    const uploadedFile = await storage.createFile(
      'avatars', // bucket ID
      fileId,
      selectedFile.value
    )
    
    // 删除旧头像文件（如果存在）
    if (props.user?.prefs?.avatarFileId) {
      try {
        await storage.deleteFile('avatars', props.user.prefs.avatarFileId)
      } catch {
        // 忽略删除错误
      }
    }
    
    // 更新用户偏好设置中的头像文件ID
    const prefs = {
      ...props.user?.prefs,
      avatarFileId: uploadedFile.$id
    }
    
    await account.updatePrefs(prefs)
    
    toast.add({
      title: '成功',
      description: '头像上传成功'
    })
    
    props.onSuccess?.()
    closeModal()
  } catch (err: any) {
    toast.add({
      title: '头像上传失败',
      description: err.message || '请稍后重试',
      color: 'error'
    })
  } finally {
    isUploading.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script> 