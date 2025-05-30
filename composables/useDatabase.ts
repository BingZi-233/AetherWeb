import { Databases, Query } from 'appwrite'
import { DATABASE_CONFIG, type UpdateLog } from '~/config/database'

export const useDatabase = () => {
  const { client } = useAppwrite()
  const databases = new Databases(client)

  // 获取更新日志
  const getUpdateLogs = async (limit: number = 10): Promise<UpdateLog[]> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_CONFIG.DATABASE_ID,
        DATABASE_CONFIG.COLLECTIONS.UPDATE_LOGS,
        [
          Query.orderDesc('date'),
          Query.limit(limit)
        ]
      )
      
      return response.documents as unknown as UpdateLog[]
    } catch (error) {
      console.error('获取更新日志失败:', error)
      throw error
    }
  }

  // 获取更新日志（支持分页和筛选）
  const getUpdateLogsWithPagination = async (
    page: number = 1,
    limit: number = 10,
    type?: string
  ): Promise<{ documents: UpdateLog[], total: number }> => {
    try {
      const queries = [
        Query.orderDesc('date'),
        Query.limit(limit),
        Query.offset((page - 1) * limit)
      ]
      
      // 如果指定了类型，添加筛选条件
      if (type) {
        queries.push(Query.equal('type', type))
      }
      
      const response = await databases.listDocuments(
        DATABASE_CONFIG.DATABASE_ID,
        DATABASE_CONFIG.COLLECTIONS.UPDATE_LOGS,
        queries
      )
      
      return {
        documents: response.documents as unknown as UpdateLog[],
        total: response.total
      }
    } catch (error) {
      console.error('获取更新日志失败:', error)
      throw error
    }
  }

  // 获取更新日志统计
  const getUpdateLogsStats = async (): Promise<Record<string, number>> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_CONFIG.DATABASE_ID,
        DATABASE_CONFIG.COLLECTIONS.UPDATE_LOGS,
        [Query.limit(1000)] // 获取所有记录用于统计
      )
      
      const logs = response.documents as unknown as UpdateLog[]
      const stats = logs.reduce((acc, log) => {
        acc[log.type] = (acc[log.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      return stats
    } catch (error) {
      console.error('获取更新日志统计失败:', error)
      throw error
    }
  }

  // 创建更新日志
  const createUpdateLog = async (data: Omit<UpdateLog, '$id' | '$createdAt' | '$updatedAt'>): Promise<UpdateLog> => {
    try {
      const response = await databases.createDocument(
        DATABASE_CONFIG.DATABASE_ID,
        DATABASE_CONFIG.COLLECTIONS.UPDATE_LOGS,
        'unique()',
        data
      )
      
      return response as unknown as UpdateLog
    } catch (error) {
      console.error('创建更新日志失败:', error)
      throw error
    }
  }

  // 更新更新日志
  const updateUpdateLog = async (id: string, data: Partial<UpdateLog>): Promise<UpdateLog> => {
    try {
      const response = await databases.updateDocument(
        DATABASE_CONFIG.DATABASE_ID,
        DATABASE_CONFIG.COLLECTIONS.UPDATE_LOGS,
        id,
        data
      )
      
      return response as unknown as UpdateLog
    } catch (error) {
      console.error('更新更新日志失败:', error)
      throw error
    }
  }

  // 删除更新日志
  const deleteUpdateLog = async (id: string): Promise<void> => {
    try {
      await databases.deleteDocument(
        DATABASE_CONFIG.DATABASE_ID,
        DATABASE_CONFIG.COLLECTIONS.UPDATE_LOGS,
        id
      )
    } catch (error) {
      console.error('删除更新日志失败:', error)
      throw error
    }
  }

  return {
    databases,
    getUpdateLogs,
    getUpdateLogsWithPagination,
    getUpdateLogsStats,
    createUpdateLog,
    updateUpdateLog,
    deleteUpdateLog
  }
} 