import { Client, Account, Databases, Storage, Functions, Teams, Avatars, Users, Messaging } from 'node-appwrite'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // 初始化Appwrite服务器端客户端
  const client = new Client()
  
  client
    .setEndpoint(config.public.appwrite.endpoint)
    .setProject(config.public.appwrite.projectId)
    .setKey(config.appwrite.apiKey) // 服务器端API密钥
  
  // 初始化各种服务
  const account = new Account(client)
  const databases = new Databases(client)
  const storage = new Storage(client)
  const functions = new Functions(client)
  const teams = new Teams(client)
  const avatars = new Avatars(client)
  const users = new Users(client) // 服务器端独有
  const messaging = new Messaging(client) // 服务器端独有
  
  // 创建Appwrite服务器端实例
  const appwriteServer = {
    client,
    account,
    databases,
    storage,
    functions,
    teams,
    avatars,
    users,
    messaging
  }
  
  return {
    provide: {
      appwriteServer
    }
  }
}) 