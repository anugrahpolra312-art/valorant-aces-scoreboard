import { Swords, Trophy } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative py-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-6 backdrop-blur-sm">
          <Trophy className="w-4 h-4" />
          VCT Champions 2024
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
            VALORANT
          </span>
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 flex items-center justify-center gap-3">
          <Swords className="w-8 h-8 text-primary" />
          Tournament Leaderboard
          <Swords className="w-8 h-8 text-primary transform scale-x-[-1]" />
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track the top players competing for glory in the ultimate VALORANT championship. 
          Live stats, rankings, and performance metrics.
        </p>
        
        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">32</p>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Teams</p>
          </div>
          <div className="w-px h-12 bg-border/50" />
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">128</p>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Players</p>
          </div>
          <div className="w-px h-12 bg-border/50" />
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">$2.5M</p>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Prize Pool</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
