export const useAppwriteServer = () => {
  // 确保只在服务器端使用
  if (import.meta.client) {
    throw new Error('useAppwriteServer() 只能在服务器端使用。请在客户端使用 useAppwrite() 代替。')
  }
  
  const { $appwriteServer } = useNuxtApp()
  
  return $appwriteServer
} 