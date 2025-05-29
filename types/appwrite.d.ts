import type { Client, Account, Databases, Storage, Functions, Teams, Avatars } from 'appwrite'
import type { 
  Client as ServerClient, 
  Account as ServerAccount, 
  Databases as ServerDatabases, 
  Storage as ServerStorage, 
  Functions as ServerFunctions, 
  Teams as ServerTeams, 
  Avatars as ServerAvatars,
  Users,
  Messaging
} from 'node-appwrite'

declare module '#app' {
  interface NuxtApp {
    $appwrite: {
      client: Client
      account: Account
      databases: Databases
      storage: Storage
      functions: Functions
      teams: Teams
      avatars: Avatars
    }
    $appwriteServer: {
      client: ServerClient
      account: ServerAccount
      databases: ServerDatabases
      storage: ServerStorage
      functions: ServerFunctions
      teams: ServerTeams
      avatars: ServerAvatars
      users: Users
      messaging: Messaging
    }
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $appwrite: {
      client: Client
      account: Account
      databases: Databases
      storage: Storage
      functions: Functions
      teams: Teams
      avatars: Avatars
    }
  }
}

export {} 