import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, ExternalLink } from "lucide-react";

const Settings = () => {
  const [keywords, setKeywords] = useState([
    "Saas", "development", "web developer", "freelance website development", "AI tools", "Product hunt"
  ]);
  const [newKeyword, setNewKeyword] = useState("");
  const [postsPerDay, setPostsPerDay] = useState("1");
  const [engagementLevel, setEngagementLevel] = useState("moderate");
  const [startTime, setStartTime] = useState("09:00");

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && keywords.length < 6) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your LinkedIn automation preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Keyword Settings */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <CardTitle>Keyword settings</CardTitle>
                    <p className="text-sm text-muted-foreground">Comment on posts with targeted keywords</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keywords" className="text-sm font-medium">
                    Target Keywords <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {keywords.map((keyword, index) => (
                      <Badge key={index} variant="default" className="flex items-center gap-1">
                        {keyword}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeKeyword(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="keywords"
                      placeholder="e.g. marketing"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                    />
                    <Button onClick={addKeyword} disabled={keywords.length >= 6}>
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 6 keywords are allowed
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <button className="text-xs text-muted-foreground hover:text-primary">
                      Click here to check LinkedIn posts for these keywords before saving, or comments won't be posted.
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="posts-per-day" className="text-sm font-medium">
                    Number of posts to comment per day <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="posts-per-day"
                    type="number"
                    min="1"
                    max="100"
                    value={postsPerDay}
                    onChange={(e) => setPostsPerDay(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 100 posts per day
                  </p>
                </div>

                <div>
                  <Label htmlFor="engagement" className="text-sm font-medium">
                    Comment Monitoring Based on Engagement <span className="text-destructive">*</span>
                  </Label>
                  <Select value={engagementLevel} onValueChange={setEngagementLevel}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select engagement level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Engagement Check</SelectItem>
                      <SelectItem value="moderate">Moderate Engagement Check</SelectItem>
                      <SelectItem value="high">High Engagement Check</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose when to post comments based on the engagement level
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Select Time to Start Commenting</Label>
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-24"
                    />
                    <Select defaultValue="AM">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comment Settings */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  2
                </div>
                <div>
                  <CardTitle>Comment settings</CardTitle>
                  <p className="text-sm text-muted-foreground">Customize and personalize your comments</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Additional Post Evaluation Rules</Label>
                  <div className="bg-gradient-secondary rounded-lg p-4 mt-2 border border-border">
                    <p className="text-sm text-muted-foreground">
                      Configure additional rules for post evaluation and comment generation. 
                      Premium feature - upgrade to access advanced customization options.
                    </p>
                    <Button variant="gradient" size="sm" className="mt-3">
                      Upgrade to Configure
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Next Step */}
        <div>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Ready to Launch!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Save your settings and start automating your LinkedIn comments
                </p>
                <Button variant="gradient" className="w-full">
                  Save & Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;