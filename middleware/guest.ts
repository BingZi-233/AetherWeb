export default defineNuxtRouteMiddleware(async (to, from) => {
  // 只在客户端运行
  if (import.meta.server) return

  try {
    const { account } = useAppwrite()
    
    // 检查用户是否已登录
    await account.get()
    
    // 如果用户已登录，重定向到仪表台
    console.log('用户已登录，重定向到仪表台')
    return navigateTo('/dashboard')
  } catch (error) {
    // 如果获取用户信息失败，说明未登录，允许访问登录/注册页面
    return
  }
}) 