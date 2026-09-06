import type { ReactNode } from "react"
import { Bell, LogOut, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"

export function AppHeader({
  profileHref,
  extra,
}: {
  profileHref: string
  extra?: ReactNode
}) {
  const { profile, user, signOut } = useAuth()
  const name = (profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Guest").trim()
  const initial = name.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/8 bg-black/90 px-4 backdrop-blur-xl sm:px-6">
      {extra}
      <div className="mx-auto flex w-full max-w-xl items-center">
        <label className="relative flex w-full items-center">
          <Search className="pointer-events-none absolute left-3 size-4 text-zinc-500" />
          <input
            type="search"
            placeholder="Search anything..."
            className="h-11 w-full rounded-full border border-white/10 bg-[#111827] pl-10 pr-16 text-sm text-foreground outline-none placeholder:text-zinc-500 focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          />
          <kbd className="pointer-events-none absolute right-3 hidden rounded-md border border-white/10 bg-black px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline">
            Ctrl K
          </kbd>
        </label>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-foreground" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-white/5">
              <Avatar className="size-9 ring-2 ring-primary/70">
                <AvatarImage src={profile?.avatar_url || ""} alt={name} />
                <AvatarFallback className="bg-primary text-sm font-bold text-primary-foreground">{initial}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-foreground sm:inline">{name.split(" ")[0]}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to={profileHref}>Profile & settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await signOut()
                window.location.href = "/login"
              }}
            >
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
