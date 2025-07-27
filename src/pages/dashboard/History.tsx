import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";

const historyData = [
  {
    id: 1,
    account: "Atul Jha",
    post: "Our Team Recently Had A Great Chat About How Mid-Sized Tech Companies Are Stepping Into An Exciting Phase Of Growth....",
    comment: "I've Been Experimenting With AI Tools To Simplify Coding Workflows...It's Crazy How Much Time It Saves. Curious, Has Anyone Here Tried Integrating AI Into Front-End Projects? Would Love To Hear How It's Helped!",
    commentedOn: "Jul 15 2025",
    status: "completed"
  },
  {
    id: 2,
    account: "Atul Jha", 
    post: "Today, On ChaiNet, We Are Going To Have An Unfiltered Episode With Jemin Patel & Has Watched Our Profession Transform In Real-Time With The ...",
    comment: "I've Been Wondering About Indie Projects Lately...Do They Still Teach You As Much, Or Is The ROI Fading? Curious To Hear Jemin's Take!",
    commentedOn: "Jul 14 2025",
    status: "completed"
  },
  {
    id: 3,
    account: "Atul Jha",
    post: "ReWear — A Modern Platform For Sustainable Fashion",
    comment: "Love The Concept Of ReWear! I've Seen Firsthand How Tricky It Can Be To Balance Clean Design With Functionality, Especially Under Hackathon Pressure. The Points System And Personalized Dashboard Sound Super Practical...Bet That Was Fun To Build! Curious what Was The Biggest Challenge You Ran Into During The Process?",
    commentedOn: "Jul 14 2025", 
    status: "completed"
  },
  {
    id: 4,
    account: "Atul Jha",
    post: "Love The Concept! I've Worked On Payment",
    comment: "Love The Concept! I've Worked On Payment",
    commentedOn: "Jul 13 2025",
    status: "completed"
  }
];

const History = () => {
  const [activeTab, setActiveTab] = useState("completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">History</h1>
        <p className="text-muted-foreground mt-2">
          Track your LinkedIn commenting activity and engagement
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Completed
          </TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="completed" className="space-y-4 mt-6">
          {historyData.length > 0 ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b border-border">
                <div className="col-span-2">ACCOUNT</div>
                <div className="col-span-3">POST</div>
                <div className="col-span-5">COMMENT</div>
                <div className="col-span-2">COMMENTED ON</div>
              </div>

              {/* History Items */}
              {historyData.map((item) => (
                <Card key={item.id} className="shadow-card hover:shadow-elevated transition-shadow">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              AJ
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{item.account}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-3">
                        <p className="text-sm text-foreground line-clamp-3">
                          {item.post}
                        </p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                          See More
                        </Button>
                      </div>
                      
                      <div className="col-span-5">
                        <p className="text-sm text-foreground line-clamp-4">
                          {item.comment}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View on LinkedIn
                          </Button>
                        </div>
                      </div>
                      
                      <div className="col-span-2 text-right">
                        <p className="text-sm font-medium text-foreground">{item.commentedOn}</p>
                        <Badge variant="secondary" className="mt-1">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">No completed activities yet</h3>
                <p className="text-muted-foreground">
                  Your completed LinkedIn comments will appear here once you start automating.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4 mt-6">
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏳</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">No pending activities</h3>
              <p className="text-muted-foreground">
                Your queued LinkedIn comments will appear here. Configure your settings to start automating.
              </p>
              <Button variant="gradient" className="mt-4">
                Configure Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;