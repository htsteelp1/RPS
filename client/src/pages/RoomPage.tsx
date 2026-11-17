import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Copy } from "lucide-react"

type RoomStatus = "waiting" | "playing" | "full" | "not-found"

export default function RoomPage() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<RoomStatus>("waiting")
  const [playerCount, setPlayerCount] = useState(1)

  useEffect(() => {
    if (!roomCode) return

    // TODO: connect to backend — join room via WebSocket or API
    console.log(`Joining room: ${roomCode}`)

    // Simulate room join logic
    // In production, this would be replaced with actual backend communication
    const joinRoom = async () => {
      try {
        // Example: const response = await fetch(`/api/rooms/${roomCode}/join`)
        // For now, simulate a successful join
        setPlayerCount(1)
        setStatus("waiting")
      } catch {
        setStatus("not-found")
      }
    }

    joinRoom()
  }, [roomCode])

  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode)
    }
  }

  const leaveRoom = () => {
    // TODO: send leave signal to backend
    navigate("/")
  }

  if (status === "not-found") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">Room Not Found</CardTitle>
            <CardDescription>
              The room "{roomCode}" doesn't exist or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={leaveRoom} variant="outline">
              <ArrowLeft className="mr-2 size-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "full") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Room is Full</CardTitle>
            <CardDescription>
              This room already has 2 players. Find another game!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={leaveRoom} variant="outline">
              <ArrowLeft className="mr-2 size-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button onClick={leaveRoom} variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
            <CardTitle className="text-lg">Room</CardTitle>
            <div className="w-8" />
          </div>
          <CardDescription className="flex items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-mono text-sm font-semibold tracking-widest uppercase">
              {roomCode}
            </span>
            <Button onClick={copyRoomCode} variant="ghost" size="icon-xs" className="h-5 w-5">
              <Copy className="size-3" />
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Players */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" />
              <span>{playerCount}/2 Players</span>
            </div>

            <div className="space-y-2">
              {/* Player 1 (You) */}
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">You</p>
                  <p className="text-xs text-muted-foreground">Ready</p>
                </div>
              </div>

              {/* Player 2 slot */}
              {playerCount < 2 && (
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-4 py-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Waiting for opponent...</p>
                    <p className="text-xs text-muted-foreground">Share the room code to invite</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          {status === "waiting" && (
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {playerCount < 2
                  ? "Waiting for another player to join..."
                  : "All players ready! Game starting..."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
