
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-6">
        
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight">404</h1>
          <h2 className="text-xl font-semibold">
            Page not found
          </h2>
          <p className="text-sm text-muted-foreground">
            Sorry, the page you are looking for doesn’t exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Button asChild variant="default">
            <Link to="/">
              Go to Home
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() => history.back()}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-muted-foreground">
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </div>
  )
}
