import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Swords, DoorOpen } from "lucide-react"

export default function HomePage() {
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = useState("")

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    const code = roomCode.trim()
    if (code.length > 0) {
      navigate(`/room/${code}`)
    }
  }

  const handleQuickMatch = () => {
    // TODO: connect to backend matchmaking API
    console.log("Quick match requested")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Rock Paper Scissors</CardTitle>
          <CardDescription>Play against another player in real time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Match */}
          <div className="space-y-2">
            <Button onClick={handleQuickMatch} className="w-full h-12 text-lg" size="lg">
              <Swords className="mr-2 size-5" />
              Quick Match
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Join Room */}
          <form onSubmit={handleJoinRoom} className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="room-code">
                Room Code
              </label>
              <div className="flex gap-2">
                <Input
                  id="room-code"
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="flex-1"
                  maxLength={10}
                />
                <Button type="submit" variant="outline" disabled={roomCode.trim().length === 0}>
                  <DoorOpen className="mr-2 size-4" />
                  Join
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
