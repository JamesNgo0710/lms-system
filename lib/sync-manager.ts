"use client"

import { STORAGE_KEYS } from "./constants"

interface SyncMetadata {
  lastUpdated: string
  version: number
  updatedBy: string
}

interface SyncData {
  topics: any[]
  lessons: any[]
  assessments: any[]
  users: any[]
  metadata: SyncMetadata
}

class SyncManager {
  private listeners: ((data: SyncData) => void)[] = []
  private pollInterval: NodeJS.Timeout | null = null
  private isPolling = false
  private lastKnownVersion = 0
  private currentUser: string | null = null
  private broadcastChannel: BroadcastChannel | null = null

  constructor() {
    if (typeof window !== "undefined") {
      // Initialize BroadcastChannel for cross-tab communication
      this.broadcastChannel = new BroadcastChannel('lms-sync')
      this.broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'DATA_UPDATE') {
          this.handleExternalUpdate(event.data.payload)
        }
      }

      // Listen for storage changes (cross-tab synchronization)
      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith(STORAGE_KEYS.prefix)) {
          this.checkForUpdates()
        }
      })
    }
  }

  // Initialize user and start polling
  initializeUser(userId: string) {
    this.currentUser = userId
    this.lastKnownVersion = this.getCurrentVersion()
    this.startPolling()
  }

  // Start polling for updates every 5 seconds
  startPolling() {
    if (this.isPolling) return
    
    this.isPolling = true
    this.pollInterval = setInterval(() => {
      this.checkForUpdates()
    }, 5000) // Check every 5 seconds
  }

  // Stop polling
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
    this.isPolling = false
  }

  // Check for updates and notify listeners if data has changed
  async checkForUpdates() {
    try {
      const currentVersion = this.getCurrentVersion()
      
      if (currentVersion > this.lastKnownVersion) {
        // Data update detected, syncing...
        const syncData = this.loadSyncData()
        if (syncData) {
          this.lastKnownVersion = currentVersion
          this.notifyListeners(syncData)
        }
      }
    } catch (error) {
      // Error checking for updates
    }
  }

  // Get current data version from localStorage
  getCurrentVersion(): number {
    const metadata = this.getMetadata()
    return metadata?.version || 0
  }

  // Get sync metadata
  getMetadata(): SyncMetadata | null {
    const metadataStr = localStorage.getItem(`${STORAGE_KEYS.prefix}-metadata`)
    return metadataStr ? JSON.parse(metadataStr) : null
  }

  // Update metadata when data changes
  updateMetadata(updatedBy: string) {
    const metadata: SyncMetadata = {
      lastUpdated: new Date().toISOString(),
      version: this.getCurrentVersion() + 1,
      updatedBy
    }
    
    localStorage.setItem(`${STORAGE_KEYS.prefix}-metadata`, JSON.stringify(metadata))
    
    // Broadcast to other tabs
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'DATA_UPDATE',
        payload: this.loadSyncData()
      })
    }
  }

  // Load all sync data from localStorage
  loadSyncData(): SyncData | null {
    try {
      const topics = localStorage.getItem(`${STORAGE_KEYS.prefix}-${STORAGE_KEYS.topics}`)
      const lessons = localStorage.getItem(`${STORAGE_KEYS.prefix}-${STORAGE_KEYS.lessons}`)
      const assessments = localStorage.getItem(`${STORAGE_KEYS.prefix}-${STORAGE_KEYS.assessments}`)
      const users = localStorage.getItem(`${STORAGE_KEYS.prefix}-${STORAGE_KEYS.users}`)
      const metadata = this.getMetadata()

      if (!metadata) return null

      return {
        topics: topics ? JSON.parse(topics) : [],
        lessons: lessons ? JSON.parse(lessons) : [],
        assessments: assessments ? JSON.parse(assessments) : [],
        users: users ? JSON.parse(users) : [],
        metadata
      }
    } catch (error) {
      console.error('Error loading sync data:', error)
      return null
    }
  }

  // Handle external updates from other tabs
  handleExternalUpdate(syncData: SyncData) {
    if (syncData.metadata.version > this.lastKnownVersion) {
      console.log('📡 Received external update, syncing...')
      this.lastKnownVersion = syncData.metadata.version
      this.notifyListeners(syncData)
    }
  }

  // Subscribe to data changes
  subscribe(listener: (data: SyncData) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Notify all listeners of data changes
  notifyListeners(data: SyncData) {
    this.listeners.forEach(listener => {
      try {
        listener(data)
      } catch (error) {
        // Error notifying sync listener
      }
    })
  }

  // Force sync data across all tabs and users
  forceSyncData(data: SyncData) {
    // Save to localStorage
    localStorage.setItem(`${STORAGE_KEYS.prefix}-${STORAGE_KEYS.topics}`, JSON.stringify(data.topics))
    localStorage.setItem(`${STORAGE_KEYS.prefix}-${STORAGE_KEYS.lessons}`, JSON.stringify(data.lessons))
    localStorage.setItem(`${STORAGE_KEYS.prefix}-${STORAGE_KEYS.assessments}`, JSON.stringify(data.assessments))
    localStorage.setItem(`${STORAGE_KEYS.prefix}-${STORAGE_KEYS.users}`, JSON.stringify(data.users))
    localStorage.setItem(`${STORAGE_KEYS.prefix}-metadata`, JSON.stringify(data.metadata))

    // Update version
    this.lastKnownVersion = data.metadata.version

    // Broadcast to other tabs
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'DATA_UPDATE',
        payload: data
      })
    }
  }

  // Get sync status for debugging
  getSyncStatus() {
    return {
      isPolling: this.isPolling,
      currentUser: this.currentUser,
      lastKnownVersion: this.lastKnownVersion,
      currentVersion: this.getCurrentVersion(),
      metadata: this.getMetadata()
    }
  }

  // Cleanup when component unmounts
  cleanup() {
    this.stopPolling()
    if (this.broadcastChannel) {
      this.broadcastChannel.close()
    }
    if (typeof window !== "undefined") {
      window.removeEventListener('storage', this.checkForUpdates)
    }
  }
}

// Export singleton instance
export const syncManager = new SyncManager()
export default syncManager 