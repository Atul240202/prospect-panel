import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
      <div className="text-center text-white max-w-2xl px-6">
        <h1 className="text-6xl font-bold mb-6">commentify</h1>
        <p className="text-2xl mb-8 opacity-90">
          boost your linkedin profile
        </p>
        <p className="text-lg mb-8 opacity-80">
          Automate your LinkedIn commenting strategy with AI-powered insights. 
          Connect with your audience more effectively and grow your professional network.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              Get Started Free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
