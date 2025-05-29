export default defineNuxtRouteMiddleware(async (to, from) => {
  // 只在客户端运行
  if (import.meta.server) return

  try {
    const { account } = useAppwrite()
    
    // 检查用户是否已登录
    const user = await account.get()
    
    // 获取用户角色
    const userRole = user.prefs?.role || 'user'
    
    // 从路由元数据中获取所需角色
    const requiredRoles = to.meta.roles as string[] | undefined
    
    if (requiredRoles && requiredRoles.length > 0) {
      // 检查用户角色是否在允许的角色列表中
      if (!requiredRoles.includes(userRole)) {
        console.log(`用户角色 ${userRole} 不在允许的角色列表中:`, requiredRoles)
        throw createError({
          statusCode: 403,
          statusMessage: '您没有权限访问此页面'
        })
      }
    }
    
    // 如果角色检查通过，允许访问
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