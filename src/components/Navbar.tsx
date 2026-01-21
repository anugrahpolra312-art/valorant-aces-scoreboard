import { Gamepad2 } from "lucide-react";
const Navbar = () => {
  return <nav className="w-full py-4 px-6 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
            <Gamepad2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">VAL</span>
            <span className="text-foreground">STATS</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm transition-colors text-primary-foreground font-bold">SILVER OAK UNIVERSITY</a>
          
          
          
        </div>
        
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          <span className="text-sm font-medium text-accent">LIVE</span>
        </div>
      </div>
    </nav>;
};
export default Navbar;