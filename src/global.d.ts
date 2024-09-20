interface ErrorPayload {
  error: string
}
type AbortPayload =
  { reason: string, error?: string } |
  { reason?: string, error: string } |
  { reason: string, error: string }

interface ProgressPayload {
  progress: number
}
