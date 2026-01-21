import { Swords, Trophy } from "lucide-react";
const Hero = () => {
  return <div className="relative py-12 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-6 backdrop-blur-sm">
          <Trophy className="w-4 h-4" />
          CYBER CLUTCH 4.0
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
      </div>
    </div>;
};
export default Hero;