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
    SESSIONS: 'sessions'
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