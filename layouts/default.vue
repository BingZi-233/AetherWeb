<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <!-- 页头 -->
    <AppHeader />
    
    <!-- 主要内容区域 -->
    <main class="flex-1">
      <slot />
    </main>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>

// 设置颜色模式
const colorMode = useColorMode()

// 确保颜色模式正确初始化
onMounted(() => {
  // 如果没有设置过颜色模式，使用系统偏好
  if (!colorMode.preference) {
    colorMode.preference = 'system'
  }
})
</script>