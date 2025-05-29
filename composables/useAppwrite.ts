export const useAppwrite = () => {
  // 确保只在客户端使用
  if (import.meta.server) {
    throw new Error('useAppwrite() 只能在客户端使用。请在服务器端使用 useAppwriteServer() 代替。')
  }
  
  const { $appwrite } = useNuxtApp()
  
  return $appwrite
} 