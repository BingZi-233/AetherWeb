export default defineNuxtRouteMiddleware(async (to, from) => {
  // 只在客户端运行
  if (import.meta.server) return
  
  // 跳过初始化时的水合过程
  const nuxtApp = useNuxtApp()
  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return

  // 如果是认证相关页面，跳过全局检查
  const authRoutes = ['/auth/login', '/auth/register', '/auth/callback', '/auth/magic-link']
  if (authRoutes.includes(to.path)) return

  try {
    const { account } = useAppwrite()
    
    // 尝试获取当前用户信息
    const user = await account.get()
    
    // 如果成功获取用户信息，可以在这里设置全局用户状态
    console.log('用户已登录:', user.name || user.email)
    
  } catch (error) {
    // 用户未登录，但不在这里处理重定向
    // 重定向逻辑由具体的页面中间件处理
    console.log('用户未登录')
  }
}) 