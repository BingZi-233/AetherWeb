export default defineNuxtRouteMiddleware(async (to, from) => {
  // 只在客户端运行
  if (import.meta.server) return

  try {
    const { account } = useAppwrite()
    
    // 检查用户是否已登录
    const user = await account.get()
    
    // 如果用户邮箱未验证，重定向到验证页面
    if (!user.emailVerification) {
      console.log('用户邮箱未验证，重定向到验证页面')
      return navigateTo('/auth/verify-email')
    }
    
    // 邮箱已验证，允许访问
    return
  } catch (error) {
    // 如果获取用户信息失败，说明未登录，重定向到登录页
    console.log('用户未登录，重定向到登录页')
    return navigateTo('/auth/login')
  }
}) 