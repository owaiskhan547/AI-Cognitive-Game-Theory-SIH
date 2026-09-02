import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
}

export function PageHeader({ title, subtitle, backHref }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {backHref && (
        <Button variant="ghost" size="sm" asChild className="mb-4 gap-2 text-muted-foreground hover:text-foreground">
          <Link to={backHref}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
