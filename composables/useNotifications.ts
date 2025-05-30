import type { Notification } from '~/config/database'

export const useNotifications = () => {
  const { 
    getActiveNotifications, 
    createNotification, 
    updateNotification, 
    deleteNotification, 
    getAllNotifications 
  } = useDatabase()

  // 创建信息通知
  const createInfoNotification = async (
    title: string, 
    description: string, 
    options: Partial<Notification> = {}
  ): Promise<Notification> => {
    const notificationData: Omit<Notification, '$id' | '$createdAt' | '$updatedAt'> = {
      title,
      description,
      type: 'info',
      icon: 'i-lucide-info',
      color: 'info',
      variant: 'soft',
      isActive: true,
      priority: 1,
      isDismissible: true,
      ...options
    }
    
    return await createNotification(notificationData)
  }

  // 创建成功通知
  const createSuccessNotification = async (
    title: string, 
    description: string, 
    options: Partial<Notification> = {}
  ): Promise<Notification> => {
    const notificationData: Omit<Notification, '$id' | '$createdAt' | '$updatedAt'> = {
      title,
      description,
      type: 'success',
      icon: 'i-lucide-check-circle',
      color: 'success',
      variant: 'soft',
      isActive: true,
      priority: 2,
      isDismissible: true,
      ...options
    }
    
    return await createNotification(notificationData)
  }

  // 创建警告通知
  const createWarningNotification = async (
    title: string, 
    description: string, 
    options: Partial<Notification> = {}
  ): Promise<Notification> => {
    const notificationData: Omit<Notification, '$id' | '$createdAt' | '$updatedAt'> = {
      title,
      description,
      type: 'warning',
      icon: 'i-lucide-alert-triangle',
      color: 'warning',
      variant: 'soft',
      isActive: true,
      priority: 3,
      isDismissible: true,
      ...options
    }
    
    return await createNotification(notificationData)
  }

  // 创建错误通知
  const createErrorNotification = async (
    title: string, 
    description: string, 
    options: Partial<Notification> = {}
  ): Promise<Notification> => {
    const notificationData: Omit<Notification, '$id' | '$createdAt' | '$updatedAt'> = {
      title,
      description,
      type: 'error',
      icon: 'i-lucide-alert-circle',
      color: 'error',
      variant: 'soft',
      isActive: true,
      priority: 4,
      isDismissible: true,
      ...options
    }
    
    return await createNotification(notificationData)
  }

  // 创建维护通知
  const createMaintenanceNotification = async (
    title: string, 
    description: string, 
    startDate?: string,
    endDate?: string,
    options: Partial<Notification> = {}
  ): Promise<Notification> => {
    const notificationData: Omit<Notification, '$id' | '$createdAt' | '$updatedAt'> = {
      title,
      description,
      type: 'warning',
      icon: 'i-lucide-wrench',
      color: 'warning',
      variant: 'soft',
      isActive: true,
      priority: 5,
      isDismissible: false, // 维护通知通常不可关闭
      startDate,
      endDate,
      ...options
    }
    
    return await createNotification(notificationData)
  }

  // 停用通知
  const deactivateNotification = async (id: string): Promise<Notification> => {
    return await updateNotification(id, { isActive: false })
  }

  // 激活通知
  const activateNotification = async (id: string): Promise<Notification> => {
    return await updateNotification(id, { isActive: true })
  }

  // 批量停用通知
  const deactivateMultipleNotifications = async (ids: string[]): Promise<void> => {
    const promises = ids.map(id => deactivateNotification(id))
    await Promise.all(promises)
  }

  // 获取特定页面的通知
  const getNotificationsForPage = async (page: string): Promise<Notification[]> => {
    return await getActiveNotifications(page)
  }

  return {
    // 基础方法
    getActiveNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
    getAllNotifications,
    
    // 便捷创建方法
    createInfoNotification,
    createSuccessNotification,
    createWarningNotification,
    createErrorNotification,
    createMaintenanceNotification,
    
    // 管理方法
    deactivateNotification,
    activateNotification,
    deactivateMultipleNotifications,
    getNotificationsForPage
  }
} 