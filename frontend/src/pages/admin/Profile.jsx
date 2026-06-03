import { useAuth } from "@/context/AuthContext.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Shield, Calendar } from "lucide-react";
import Loader from "@/components/common/Loader.jsx";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Loader />;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <PageHeader 
        title="Profile" 
        description="Your admin account information and settings."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Full Name</label>
                <p className="mt-2 text-lg font-medium">{user.name}</p>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Mail className="size-3.5" /> Email Address
                </label>
                <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Phone */}
              {user.phone && (
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Phone className="size-3.5" /> Phone Number
                  </label>
                  <p className="mt-2 text-sm">{user.phone}</p>
                </div>
              )}

              {/* Address */}
              {user.address && (
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <MapPin className="size-3.5" /> Address
                  </label>
                  <p className="mt-2 text-sm">{user.address}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Role Card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="size-5 text-primary" />
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Role</span>
              </div>
              <p className="text-lg font-semibold capitalize">{user.role}</p>
              <p className="text-xs text-muted-foreground mt-2">System Administrator</p>
            </CardContent>
          </Card>

          {/* Join Date Card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="size-5 text-primary" />
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Joined</span>
              </div>
              <p className="text-sm font-medium">{joinDate}</p>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Status</p>
                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  <span className="size-1.5 bg-green-600 rounded-full"></span> Active
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-3">
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
