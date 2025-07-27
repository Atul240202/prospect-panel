import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ExternalLink, MessageCircle, Star, Zap } from "lucide-react";

const Community = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Join Community</h1>
        <p className="text-muted-foreground mt-2">
          Connect with other LinkedIn automation enthusiasts and get support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Discord Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-primary rounded-lg p-4 text-white">
                <h3 className="font-semibold mb-2">Join 2,500+ Members</h3>
                <p className="text-sm opacity-90">
                  Get real-time support, share strategies, and network with fellow LinkedIn automation users.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">24/7 Community Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm">Expert Tips & Strategies</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm">Early Access to Features</span>
                </div>
              </div>

              <Button variant="gradient" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Discord Server
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <div>
                    <h4 className="font-medium text-sm">Be Respectful</h4>
                    <p className="text-xs text-muted-foreground">Treat all community members with respect and kindness</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <div>
                    <h4 className="font-medium text-sm">Share Knowledge</h4>
                    <p className="text-xs text-muted-foreground">Help others by sharing your LinkedIn automation experiences</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <div>
                    <h4 className="font-medium text-sm">No Spam</h4>
                    <p className="text-xs text-muted-foreground">Keep discussions relevant and avoid promotional content</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">4</Badge>
                  <div>
                    <h4 className="font-medium text-sm">Use Search</h4>
                    <p className="text-xs text-muted-foreground">Search previous messages before asking common questions</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Community Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-secondary rounded-lg p-4 border border-border">
              <h4 className="font-medium mb-2">💡 Weekly Strategy Sessions</h4>
              <p className="text-sm text-muted-foreground">
                Every Tuesday at 2 PM EST - Join live discussions about LinkedIn automation best practices
              </p>
            </div>
            
            <div className="bg-gradient-secondary rounded-lg p-4 border border-border">
              <h4 className="font-medium mb-2">🚀 Success Stories</h4>
              <p className="text-sm text-muted-foreground">
                Members share their automation results and networking achievements
              </p>
            </div>
            
            <div className="bg-gradient-secondary rounded-lg p-4 border border-border">
              <h4 className="font-medium mb-2">🎯 Monthly Challenges</h4>
              <p className="text-sm text-muted-foreground">
                Participate in community challenges to maximize your LinkedIn engagement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Featured Community Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-secondary rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  SM
                </div>
                <div>
                  <h4 className="font-medium">Sarah Miller</h4>
                  <p className="text-sm text-muted-foreground">Generated 500+ leads this month</p>
                </div>
              </div>
              <Badge variant="secondary">Top Contributor</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-secondary rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  MR
                </div>
                <div>
                  <h4 className="font-medium">Mike Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">Automated 1000+ meaningful connections</p>
                </div>
              </div>
              <Badge variant="secondary">Community Helper</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;