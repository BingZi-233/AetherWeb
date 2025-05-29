export default defineNuxtRouteMiddleware(async (to, from) => {
  // 只在客户端运行
  if (import.meta.server) return

  try {
    const { account } = useAppwrite()
    
    // 检查用户是否已登录
    const user = await account.get()
    
    // 检查用户是否有管理员权限
    const userRole = user.prefs?.role || 'user'
    
    if (userRole !== 'admin') {
      // 如果不是管理员，重定向到无权限页面或首页
      console.log('用户无管理员权限，重定向到首页')
      throw createError({
        statusCode: 403,
        statusMessage: '您没有权限访问此页面'
      })
    }
    
    // 如果是管理员，允许访问
    return
  } catch (error: any) {
    // 如果是权限错误，直接抛出
    if (error.statusCode === 403) {
      throw error
    }
    
    // 如果是认证错误，重定向到登录页
    console.log('用户未登录，重定向到登录页')
    return navigateTo('/auth/login')
  }
}) 