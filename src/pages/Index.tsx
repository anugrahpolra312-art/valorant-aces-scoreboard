import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Leaderboard from "@/components/Leaderboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Leaderboard />
      
      {/* Footer */}
      <footer className="py-8 mt-16 border-t border-border/50">
        <p className="text-center text-sm text-muted-foreground">
          © 2024 VALSTATS. All player data is for demonstration purposes only.
        </p>
      </footer>
    </div>
  );
};

export default Index;
