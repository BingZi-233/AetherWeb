<template>
  <div class="space-y-6">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">用户管理</h1>
        <p class="text-gray-600 dark:text-gray-400">管理系统中的所有用户账户</p>
      </div>
      <div class="flex items-center space-x-3">
        <UButton
          icon="i-lucide-download"
          variant="outline"
          label="导出用户"
        />
        <UButton
          icon="i-lucide-user-plus"
          variant="solid"
          label="添加用户"
          to="/dashboard/users/create"
        />
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <UCard
        v-for="stat in userStats"
        :key="stat.title"
        class="hover:shadow-lg transition-shadow duration-200"
      >
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg" :class="stat.iconBg">
              <UIcon :name="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.title }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
            </div>
          </div>
        </template>
      </UCard>
    </div>

    <!-- 搜索和筛选 -->
    <UCard>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            placeholder="搜索用户..."
            icon="i-lucide-search"
            :loading="isSearching"
          />
        </div>
        <div class="flex items-center space-x-3">
          <USelectMenu
            v-model="selectedRole"
            :options="roleOptions"
            placeholder="角色筛选"
            size="sm"
          />
          <USelectMenu
            v-model="selectedStatus"
            :options="statusOptions"
            placeholder="状态筛选"
            size="sm"
          />
          <UButton
            icon="i-lucide-filter"
            variant="outline"
            size="sm"
            @click="resetFilters"
          >
            重置
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- 用户列表 -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">用户列表</h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              共 {{ filteredUsers.length }} 个用户
            </span>
          </div>
        </div>
      </template>

      <!-- 表格 -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                用户
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                角色
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                最后登录
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                注册时间
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="user in paginatedUsers"
              :key="user.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <UAvatar
                    :src="user.avatar"
                    :alt="user.name"
                    size="sm"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="getRoleColor(user.role)"
                  variant="subtle"
                  :label="user.role"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="getStatusColor(user.status)"
                  variant="subtle"
                  :label="user.status"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ user.lastLogin }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ user.createdAt }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UDropdownMenu :items="getUserActions(user)">
                  <UButton
                    icon="i-lucide-more-horizontal"
                    variant="ghost"
                    size="sm"
                  />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <template #footer>
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredUsers.length) }} 条，共 {{ filteredUsers.length }} 条
          </div>
          <UPagination
            v-model="currentPage"
            :total="Math.ceil(filteredUsers.length / pageSize)"
            :show-controls="true"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Models } from 'appwrite'

// 设置页面元数据
definePageMeta({
  layout: 'dashboard',
  title: '用户管理',
  middleware: 'auth'
})

// Appwrite相关
const { account, teams, avatars } = useAppwrite()

// 响应式数据
const searchQuery = ref('')
const isSearching = ref(false)
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const isLoading = ref(true)

// 用户数据
const users = ref<Models.User<Models.Preferences>[]>([])
const userStats = ref([
  {
    title: '总用户数',
    value: '0',
    icon: 'i-lucide-users',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: '活跃用户',
    value: '0',
    icon: 'i-lucide-user-check',
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    title: '新注册',
    value: '0',
    icon: 'i-lucide-user-plus',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    title: '待审核',
    value: '0',
    icon: 'i-lucide-user-x',
    iconBg: 'bg-orange-100 dark:bg-orange-900',
    iconColor: 'text-orange-600 dark:text-orange-400'
  }
])

// 筛选选项
const roleOptions = ref([
  { label: '全部角色', value: '' },
  { label: '管理员', value: 'admin' },
  { label: '用户', value: 'user' },
  { label: '编辑', value: 'editor' }
])

const statusOptions = ref([
  { label: '全部状态', value: '' },
  { label: '活跃', value: 'active' },
  { label: '未验证', value: 'unverified' },
  { label: '已禁用', value: 'disabled' }
])

// 获取用户列表
const fetchUsers = async () => {
  try {
    isLoading.value = true
    
    // 注意：Appwrite的用户管理需要管理员权限
    // 这里我们只能获取当前用户信息，实际项目中需要后端API
    const currentUser = await account.get()
    users.value = [currentUser]
    
    // 更新统计数据
    updateUserStats()
  } catch (error) {
    console.error('获取用户列表失败:', error)
    // 如果无法获取真实数据，使用模拟数据
    users.value = generateMockUsers()
    updateUserStats()
  } finally {
    isLoading.value = false
  }
}

// 生成模拟用户数据（用于演示）
const generateMockUsers = (): Models.User<Models.Preferences>[] => {
  const mockUsers: any[] = []
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  const roles = ['admin', 'user', 'editor']
  const statuses = ['active', 'unverified', 'disabled']
  
  for (let i = 0; i < 20; i++) {
    const name = names[i % names.length] + (i > 7 ? i : '')
    mockUsers.push({
      $id: `user_${i}`,
      $createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      $updatedAt: new Date().toISOString(),
      name,
      email: `${name.toLowerCase()}@example.com`,
      emailVerification: Math.random() > 0.3,
      status: Math.random() > 0.8,
      labels: [],
      passwordUpdate: new Date().toISOString(),
      hash: 'argon2',
      hashOptions: {},
      registration: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      accessedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      prefs: {
        role: roles[Math.floor(Math.random() * roles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)]
      }
    })
  }
  
  return mockUsers as Models.User<Models.Preferences>[]
}

// 更新统计数据
const updateUserStats = () => {
  const total = users.value.length
  const active = users.value.filter(u => u.prefs?.status === 'active' || u.status).length
  const recent = users.value.filter(u => {
    const regDate = new Date(u.registration)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return regDate > weekAgo
  }).length
  const pending = users.value.filter(u => u.prefs?.status === 'unverified' || !u.emailVerification).length
  
  userStats.value[0].value = total.toString()
  userStats.value[1].value = active.toString()
  userStats.value[2].value = recent.toString()
  userStats.value[3].value = pending.toString()
}

// 处理用户数据以适配模板
const processedUsers = computed(() => {
  return users.value.map(user => ({
    id: user.$id,
    name: user.name || '未设置姓名',
    email: user.email,
    avatar: getUserAvatar(user),
    role: user.prefs?.role || 'user',
    status: user.prefs?.status || (user.status ? 'active' : 'unverified'),
    lastLogin: user.accessedAt ? new Date(user.accessedAt).toLocaleDateString('zh-CN') : '从未登录',
    createdAt: new Date(user.registration).toLocaleDateString('zh-CN')
  }))
})

// 获取用户头像
const getUserAvatar = (user: Models.User<Models.Preferences>) => {
  if (user.prefs?.avatar) {
    return user.prefs.avatar
  }
  
  try {
    return avatars.getInitials(user.name || user.email, 32, 32)
  } catch {
    return ''
  }
}

// 筛选用户
const filteredUsers = computed(() => {
  let filtered = processedUsers.value
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }
  
  // 角色筛选
  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role === selectedRole.value)
  }
  
  // 状态筛选
  if (selectedStatus.value) {
    filtered = filtered.filter(user => user.status === selectedStatus.value)
  }
  
  return filtered
})

// 分页用户
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

// 获取角色颜色
const getRoleColor = (role: string): "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral" => {
  const colors: Record<string, "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"> = {
    admin: 'error',
    editor: 'primary',
    user: 'success'
  }
  return colors[role] || 'neutral'
}

// 获取状态颜色
const getStatusColor = (status: string): "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral" => {
  const colors: Record<string, "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"> = {
    active: 'success',
    unverified: 'warning',
    disabled: 'error'
  }
  return colors[status] || 'neutral'
}

// 获取用户操作菜单
const getUserActions = (user: any) => [
  [
    {
      label: '查看详情',
      icon: 'i-lucide-eye',
      onSelect: () => navigateTo(`/dashboard/users/${user.id}`)
    },
    {
      label: '编辑用户',
      icon: 'i-lucide-edit',
      onSelect: () => navigateTo(`/dashboard/users/${user.id}/edit`)
    }
  ],
  [
    {
      label: user.status === 'active' ? '禁用用户' : '启用用户',
      icon: user.status === 'active' ? 'i-lucide-user-x' : 'i-lucide-user-check',
      onSelect: () => toggleUserStatus(user)
    },
    {
      label: '删除用户',
      icon: 'i-lucide-trash-2',
      onSelect: () => deleteUser(user)
    }
  ]
]

// 切换用户状态
const toggleUserStatus = async (user: any) => {
  // 这里需要实现用户状态切换逻辑
  console.log('切换用户状态:', user)
}

// 删除用户
const deleteUser = async (user: any) => {
  // 这里需要实现用户删除逻辑
  console.log('删除用户:', user)
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  selectedRole.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
}

// 监听搜索查询变化
watch(searchQuery, () => {
  isSearching.value = true
  setTimeout(() => {
    isSearching.value = false
  }, 500)
  currentPage.value = 1
})

// 监听筛选变化
watch([selectedRole, selectedStatus], () => {
  currentPage.value = 1
})

// 组件挂载时获取数据
onMounted(() => {
  fetchUsers()
})

// 页面标题
useHead({
  title: '用户管理 - AetherWeb'
})
</script> 