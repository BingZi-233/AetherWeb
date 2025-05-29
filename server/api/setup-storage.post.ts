import { Permission, Role, Compression } from 'node-appwrite'
import { useAppwriteServer } from '~/composables/useAppwriteServer'

export default defineEventHandler(async (event) => {
  // 使用服务器端Appwrite组合式函数
  const { storage } = useAppwriteServer()

  try {
    // 检查avatars桶是否已存在
    try {
      await storage.getBucket('avatars')
      return { success: true, message: 'Avatars bucket already exists' }
    } catch {
      // 桶不存在，创建它
      await storage.createBucket('avatars', 'User Avatars', [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ], false, true, 5 * 1024 * 1024, ['jpg', 'jpeg', 'png', 'gif', 'webp'], Compression.Gzip, false, false)
    }

    // 创建avatars存储桶
    const bucket = await storage.createBucket(
      'avatars', // bucketId
      'User Avatars', // name
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ], // permissions
      false, // fileSecurity
      true, // enabled
      5 * 1024 * 1024, // maximumFileSize (5MB)
      ['jpg', 'jpeg', 'png', 'gif', 'webp'], // allowedFileExtensions
      Compression.Gzip, // compression
      false, // encryption
      false // antivirus
    )

    return {
      success: true,
      message: 'Avatars bucket created successfully',
      bucket: bucket
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to setup storage bucket',
      data: error.message
    })
  }
}) 