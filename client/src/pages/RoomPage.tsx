import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Copy, Trophy } from "lucide-react"

type RoomStatus = "waiting" | "playing" | "full" | "not-found"
type GamePhase = "idle" | "choosing" | "revealing" | "result"
type Choice = "rock" | "paper" | "scissors"

const CHOICE_ICONS: Record<Choice, string> = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
}

const CHOICE_LABELS: Record<Choice, string> = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors",
}

function determineWinner(p1: Choice, p2: Choice): "player1" | "player2" | "draw" {
  if (p1 === p2) return "draw"
  if ((p1 === "rock" && p2 === "scissors") ||
      (p1 === "paper" && p2 === "rock") ||
      (p1 === "scissors" && p2 === "paper")) {
    return "player1"
  }
  return "player2"
}

export default function RoomPage() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<RoomStatus>("waiting")
  const [playerCount, setPlayerCount] = useState(1)

  // Game state
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle")
  const [myChoice, setMyChoice] = useState<Choice | null>(null)
  const [opponentChoice, setOpponentChoice] = useState<Choice | null>(null)
  const [scores, setScores] = useState({ player1: 0, player2: 0, draws: 0 })
  const [roundHistory, setRoundHistory] = useState<Array<{ myChoice: Choice; opponentChoice: Choice; result: "win" | "lose" | "draw" }>>([])
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (!roomCode) return

    // TODO: connect to backend — join room via WebSocket or API
    console.log(`Joining room: ${roomCode}`)

    const joinRoom = async () => {
      try {
        setPlayerCount(1)
        setStatus("waiting")
      } catch {
        setStatus("not-found")
      }
    }

    joinRoom()
  }, [roomCode])

  // Countdown timer for revealing phase
  useEffect(() => {
    if (gamePhase !== "revealing") return
    if (countdown <= 0) {
      // Reveal choices
      const opponentChoices: Choice[] = ["rock", "paper", "scissors"]
      const opp = opponentChoices[Math.floor(Math.random() * opponentChoices.length)]
      setOpponentChoice(opp)

      if (myChoice) {
        const winner = determineWinner(myChoice, opp)
        const result = winner === "player1" ? "win" : winner === "player2" ? "lose" : "draw"

        setScores(prev => ({
          player1: prev.player1 + (result === "win" ? 1 : 0),
          player2: prev.player2 + (result === "lose" ? 1 : 0),
          draws: prev.draws + (result === "draw" ? 1 : 0),
        }))

        setRoundHistory(prev => [...prev, { myChoice, opponentChoice: opp, result }])
      }

      setGamePhase("result")
      return
    }

    const timer = setTimeout(() => setCountdown(c => c - 1), 800)
    return () => clearTimeout(timer)
  }, [gamePhase, countdown, myChoice])

  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode)
    }
  }

  const leaveRoom = () => {
    // TODO: send leave signal to backend
    navigate("/")
  }

  const handleChoose = (choice: Choice) => {
    if (gamePhase !== "choosing") return
    setMyChoice(choice)
    // TODO: send choice to backend via WebSocket
    console.log(`Player chose: ${choice}`)
    setCountdown(3)
    setGamePhase("revealing")
  }

  const handleNextRound = () => {
    setMyChoice(null)
    setOpponentChoice(null)
    setGamePhase("choosing")
  }

  const handleReadyUp = () => {
    // TODO: signal ready to backend
    setPlayerCount(2)
    setGamePhase("choosing")
  }

  // --- Error states ---

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

  // --- Waiting lobby ---

  if (gamePhase === "idle") {
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
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4" />
                <span>{playerCount}/2 Players</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">You</p>
                    <p className="text-xs text-muted-foreground">Ready</p>
                  </div>
                </div>

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

            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Waiting for another player to join...
              </p>
            </div>

            {/* Demo: simulate opponent joining for testing */}
            <Button onClick={handleReadyUp} variant="secondary" className="w-full">
              {playerCount < 2 ? "Simulate Opponent Join" : "Start Game"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // --- Game area ---

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button onClick={leaveRoom} variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
            <div className="text-center">
              <CardTitle className="text-lg">Rock Paper Scissors</CardTitle>
              <CardDescription className="font-mono text-xs tracking-widest uppercase">
                {roomCode}
              </CardDescription>
            </div>
            <Button onClick={copyRoomCode} variant="ghost" size="icon-sm">
              <Copy className="size-4" />
            </Button>
          </div>

          {/* Scoreboard */}
          <div className="mt-4 flex items-center justify-center gap-6 rounded-lg bg-muted/50 p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">You</p>
              <p className="text-2xl font-bold text-primary">{scores.player1}</p>
            </div>
            <div className="flex flex-col items-center">
              <Trophy className="size-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Draws: {scores.draws}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Opponent</p>
              <p className="text-2xl font-bold text-destructive">{scores.player2}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* --- Choosing Phase --- */}
          {gamePhase === "choosing" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-semibold">Choose Your Weapon</p>
                <p className="text-sm text-muted-foreground">Pick rock, paper, or scissors</p>
              </div>

              <div className="flex items-center justify-center gap-4">
                {(["rock", "paper", "scissors"] as Choice[]).map((choice) => (
                  <Button
                    key={choice}
                    onClick={() => handleChoose(choice)}
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto w-28 p-4 rounded-xl border-2 hover:border-primary hover:bg-muted transition-colors"
                  >
                    <span className="text-4xl">{CHOICE_ICONS[choice]}</span>
                    <span className="text-sm font-medium">{CHOICE_LABELS[choice]}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* --- Revealing Phase (Countdown) --- */}
          {gamePhase === "revealing" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <div className="text-center">
                <p className="text-lg font-semibold">Get Ready!</p>
                <p className="text-6xl font-bold text-primary mt-4 animate-pulse">{countdown}</p>
              </div>

              <div className="flex items-center justify-center gap-8">
                {/* Player choice (hidden) */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-muted-foreground">You</p>
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                    <span className="text-3xl">❓</span>
                  </div>
                </div>

                <span className="text-2xl font-bold text-muted-foreground">VS</span>

                {/* Opponent choice (hidden) */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-muted-foreground">Opponent</p>
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                    <span className="text-3xl">❓</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- Result Phase --- */}
          {gamePhase === "result" && myChoice && opponentChoice && (
            <div className="space-y-6">
              {/* Result banner */}
              {(() => {
                const winner = determineWinner(myChoice, opponentChoice)
                const result = winner === "player1" ? "win" : winner === "player2" ? "lose" : "draw"
                return (
                  <div className={`rounded-lg p-4 text-center ${
                    result === "win" ? "bg-green-500/10 text-green-600" :
                    result === "lose" ? "bg-red-500/10 text-red-600" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    <p className="text-xl font-bold">
                      {result === "win" ? "🎉 You Win!" : result === "lose" ? "😞 You Lose!" : "🤝 It's a Draw!"}
                    </p>
                  </div>
                )
              })()}

              {/* Choices reveal */}
              <div className="flex items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-muted-foreground">You</p>
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                    <span className="text-4xl">{CHOICE_ICONS[myChoice]}</span>
                  </div>
                  <p className="text-xs font-medium">{CHOICE_LABELS[myChoice]}</p>
                </div>

                <span className="text-lg font-bold text-muted-foreground">VS</span>

                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-muted-foreground">Opponent</p>
                  <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center border-2 border-destructive">
                    <span className="text-4xl">{CHOICE_ICONS[opponentChoice]}</span>
                  </div>
                  <p className="text-xs font-medium">{CHOICE_LABELS[opponentChoice]}</p>
                </div>
              </div>

              {/* Play again */}
              <Button onClick={handleNextRound} className="w-full h-12 text-lg">
                Next Round
              </Button>
            </div>
          )}

          {/* Round History */}
          {roundHistory.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Round History</p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {roundHistory.map((round, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-xs ${
                      round.result === "win" ? "bg-green-500/10 text-green-600" :
                      round.result === "lose" ? "bg-red-500/10 text-red-600" :
                      "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <span>Round {i + 1}</span>
                    <span className="font-mono">
                      {CHOICE_ICONS[round.myChoice]} vs {CHOICE_ICONS[round.opponentChoice]}
                    </span>
                    <span className="font-semibold uppercase">
                      {round.result === "win" ? "Win" : round.result === "lose" ? "Lose" : "Draw"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
