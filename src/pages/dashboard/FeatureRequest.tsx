import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Lightbulb, Bug } from "lucide-react";

const FeatureRequest = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Feature Request</h1>
        <p className="text-muted-foreground mt-2">
          Help us improve Commentify by sharing your ideas and feedback
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Submit a Feature Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="feature-title">Feature Title</Label>
                <input
                  id="feature-title"
                  type="text"
                  placeholder="Brief title for your feature request"
                  className="w-full mt-2 px-3 py-2 border border-input rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="feature-description">Description</Label>
                <Textarea
                  id="feature-description"
                  placeholder="Describe your feature request in detail..."
                  className="min-h-[120px] mt-2"
                />
              </div>
              <Button variant="gradient" className="w-full">
                Submit Feature Request
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-destructive" />
              Report a Bug
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bug-title">Bug Title</Label>
                <input
                  id="bug-title"
                  type="text"
                  placeholder="Brief description of the bug"
                  className="w-full mt-2 px-3 py-2 border border-input rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="bug-description">Bug Description</Label>
                <Textarea
                  id="bug-description"
                  placeholder="Describe the bug and steps to reproduce..."
                  className="min-h-[120px] mt-2"
                />
              </div>
              <Button variant="destructive" className="w-full">
                Report Bug
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Recent Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gradient-secondary rounded-lg p-4 border border-border">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">Advanced Comment Templates</h4>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">In Progress</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Allow users to create custom comment templates with dynamic variables
              </p>
              <p className="text-xs text-muted-foreground mt-2">Requested 2 days ago</p>
            </div>

            <div className="bg-gradient-secondary rounded-lg p-4 border border-border">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">LinkedIn Post Analytics</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Show engagement metrics for posts where comments were made
              </p>
              <p className="text-xs text-muted-foreground mt-2">Requested 1 week ago</p>
            </div>

            <div className="bg-gradient-secondary rounded-lg p-4 border border-border">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">Multiple LinkedIn Accounts</h4>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Under Review</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Support for managing multiple LinkedIn accounts in one dashboard
              </p>
              <p className="text-xs text-muted-foreground mt-2">Requested 2 weeks ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureRequest;