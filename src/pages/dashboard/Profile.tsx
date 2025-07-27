import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trash2, Share2 } from "lucide-react";

const Profile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile information and LinkedIn connection
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="text-center pb-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" alt="Atul Jha" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                AJ
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <CardTitle className="text-2xl">Atul Jha</CardTitle>
              <p className="text-muted-foreground mt-1">@atuljha24</p>
              <Badge variant="destructive" className="mt-2">Deactivated</Badge>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">LinkedIn Connection</h3>
              <div className="bg-gradient-secondary rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Chrome Extension Status</p>
                    <p className="text-sm text-muted-foreground">
                      Connect your LinkedIn account through our Chrome extension
                    </p>
                  </div>
                  <Badge variant="destructive">Not Connected</Badge>
                </div>
                <Button variant="gradient" className="mt-3" size="sm">
                  Connect LinkedIn
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Account Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-card rounded-lg p-4 border border-border">
                  <p className="text-sm font-medium text-muted-foreground">Total Comments</p>
                  <p className="text-2xl font-bold text-foreground">0</p>
                </div>
                <div className="bg-gradient-card rounded-lg p-4 border border-border">
                  <p className="text-sm font-medium text-muted-foreground">Active Keywords</p>
                  <p className="text-2xl font-bold text-foreground">6</p>
                </div>
                <div className="bg-gradient-card rounded-lg p-4 border border-border">
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">0%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
              <div className="bg-gradient-card rounded-lg p-6 border border-border text-center">
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect your LinkedIn account to start automating comments
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;