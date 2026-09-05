import { Link } from "react-router-dom"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Heart, LogOut } from "lucide-react"
import { mockPatient } from "@/lib/mock-data"
import { useAuth } from "@/contexts/AuthContext"

export default function PatientProfilePage() {
  const { signOut } = useAuth()

  return (
    <div>
      <PageHeader
        title="My Profile"
        backHref="/patient/dashboard"
      />

      <div className="space-y-6">
        {/* Patient Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={mockPatient.avatar} alt={mockPatient.name} />
                <AvatarFallback className="text-2xl">
                  {mockPatient.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{mockPatient.name}</h2>
                <p className="text-lg text-muted-foreground">Age: {mockPatient.age}</p>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-1">
                {mockPatient.condition}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Phone className="w-6 h-6 text-primary" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {mockPatient.emergencyContact.name}
                </p>
                <p className="text-muted-foreground">
                  {mockPatient.emergencyContact.relation}
                </p>
                <p className="text-muted-foreground">
                  {mockPatient.emergencyContact.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <User className="w-6 h-6 text-primary" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Diagnosed</span>
                <span className="text-foreground font-medium">{mockPatient.diagnosedDate}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Patient ID</span>
                <span className="text-foreground font-medium">{mockPatient.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Log Out */}
        <Button
          variant="outline"
          size="xl"
          rounded="xl"
          className="w-full gap-3 text-lg"
          onClick={async () => {
            await signOut()
            window.location.href = '/login'
          }}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>
      </div>
    </div>
  )
}
