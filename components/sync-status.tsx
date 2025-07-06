"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Wifi, WifiOff, RefreshCw, Info } from "lucide-react"
import { useSync } from "@/hooks/use-data-store"

export function SyncStatus() {
  const { syncStatus } = useSync()
  const [showDetails, setShowDetails] = useState(false)

  const isConnected = syncStatus.isPolling

  return (
    <div className="flex items-center space-x-2">
      <Badge 
        variant={isConnected ? "default" : "secondary"}
        className="flex items-center space-x-1"
      >
        {isConnected ? (
          <Wifi className="w-3 h-3" />
        ) : (
          <WifiOff className="w-3 h-3" />
        )}
        <span>{isConnected ? "Synced" : "Offline"}</span>
      </Badge>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Info className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sync Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Connection Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sync Active</span>
                    <Badge variant={syncStatus.isPolling ? "default" : "secondary"}>
                      {syncStatus.isPolling ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current User</span>
                    <span className="text-sm font-medium">{syncStatus.currentUser || "None"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Version</span>
                    <span className="text-sm font-medium">{syncStatus.currentVersion}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {syncStatus.metadata && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Last Update</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Updated By</span>
                      <span className="text-sm font-medium">{syncStatus.metadata.updatedBy}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Time</span>
                      <span className="text-sm font-medium">
                        {new Date(syncStatus.metadata.lastUpdated).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function SyncIndicator() {
  const { syncStatus } = useSync()
  const isConnected = syncStatus.isPolling

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      {isConnected ? (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span>Offline</span>
        </div>
      )}
    </div>
  )
} 