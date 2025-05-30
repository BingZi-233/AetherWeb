// 全局数据库配置
export const DATABASE_CONFIG = {
  // 主数据库ID
  DATABASE_ID: 'dev',
  
  // 数据表配置
  COLLECTIONS: {
    UPDATE_LOGS: 'update_logs',
    USERS: 'users',
    CONTENT: 'content',
    ANALYTICS: 'analytics',
    SESSIONS: 'sessions',
    NOTIFICATIONS: 'notifications'
  }
}

// 更新日志类型定义
export interface UpdateLog {
  $id: string
  $createdAt: string
  $updatedAt: string
  title: string
  description: string
  version: string
  type: 'feature' | 'improvement' | 'bugfix' | 'security' | 'breaking' | 'deprecated' | 'maintenance'
  icon: string
  iconBg: string
  iconColor: string
  date: string
}

// 通知横幅类型定义
export interface Notification {
  $id: string
  $createdAt: string
  $updatedAt: string
  title: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
  icon: string
  color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
  variant: 'solid' | 'outline' | 'soft' | 'subtle'
  isActive: boolean
  priority: number // 优先级，数字越大优先级越高
  startDate?: string // 开始显示时间
  endDate?: string // 结束显示时间
  isDismissible: boolean // 是否可以关闭
  targetPages?: string[] // 目标页面，空数组表示所有页面
}

// 系统服务状态类型定义
export interface SystemService {
  id: string
  name: string
  description: string
  status: 'operational' | 'degraded' | 'outage' | 'maintenance'
  responseTime: string
} 