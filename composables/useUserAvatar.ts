import type { Models } from 'appwrite'

export const useUserAvatar = () => {
  const { storage, avatars } = useAppwrite()

  /**
   * 触发用户更新事件
   */
  const triggerUserUpdate = () => {
    if (import.meta.client) {
      window.dispatchEvent(new CustomEvent('user-updated'))
    }
  }

  /**
   * 获取用户头像URL
   * @param user 用户对象
   * @param size 头像尺寸，默认128
   * @returns 头像URL
   */
  const getUserAvatarUrl = (user: Models.User<Models.Preferences> | null, size: number = 128): string => {
    if (!user) return ''
    
    // 优先使用自定义上传的头像文件
    if (user.prefs?.avatarFileId) {
      try {
        // 使用getFileView获取文件URL，它有更好的权限处理
        const fileUrl = storage.getFileView(
          'avatars', // bucket ID
          user.prefs.avatarFileId
        )
        return fileUrl
      } catch (error) {
        console.warn('获取头像文件失败:', error)
        // 如果获取失败，继续使用默认头像
      }
    }
    
    // 如果有直接的头像URL（向后兼容）
    if (user.prefs?.avatar) {
      return user.prefs.avatar
    }
    
    // 使用Appwrite的初始头像生成器作为备用方案
    try {
      return avatars.getInitials(
        user.name || user.email || 'User', 
        size, 
        size
      )
    } catch (error) {
      console.warn('生成初始头像失败:', error)
      return ''
    }
  }

  /**
   * 创建响应式的头像URL计算属性
   * @param user 响应式用户对象
   * @param size 头像尺寸，默认128
   * @returns 响应式头像URL
   */
  const createAvatarUrl = (user: Ref<Models.User<Models.Preferences> | null>, size: number = 128) => {
    return computed(() => getUserAvatarUrl(user.value, size))
  }

  return {
    getUserAvatarUrl,
    createAvatarUrl,
    triggerUserUpdate
  }
} 