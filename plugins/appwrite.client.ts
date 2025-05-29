import { Client, Account, Databases, Storage, Functions, Teams, Avatars } from 'appwrite'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // 初始化Appwrite客户端
  const client = new Client()
  
  client
    .setEndpoint(config.public.appwrite.endpoint)
    .setProject(config.public.appwrite.projectId)
  
  // 初始化各种服务
  const account = new Account(client)
  const databases = new Databases(client)
  const storage = new Storage(client)
  const functions = new Functions(client)
  const teams = new Teams(client)
  const avatars = new Avatars(client)
  
  // 创建Appwrite实例
  const appwrite = {
    client,
    account,
    databases,
    storage,
    functions,
    teams,
    avatars
  }
  
  return {
    provide: {
      appwrite
    }
  }
}) 