import { Trophy, Skull, Target, Award } from "lucide-react";

interface Player {
  rank: number;
  name: string;
  team: string;
  kills: number;
  deaths: number;
  wins: number;
  points: number;
  avatar: string;
}

const players: Player[] = [
  { rank: 1, name: "TenZ", team: "SEN", kills: 287, deaths: 142, wins: 18, points: 4850, avatar: "T" },
  { rank: 2, name: "Demon1", team: "EG", kills: 265, deaths: 156, wins: 16, points: 4420, avatar: "D" },
  { rank: 3, name: "Aspas", team: "LEV", kills: 251, deaths: 148, wins: 15, points: 4180, avatar: "A" },
  { rank: 4, name: "Derke", team: "FNC", kills: 243, deaths: 161, wins: 14, points: 3920, avatar: "D" },
  { rank: 5, name: "yay", team: "C9", kills: 238, deaths: 152, wins: 14, points: 3780, avatar: "Y" },
  { rank: 6, name: "Chronicle", team: "FNC", kills: 229, deaths: 168, wins: 13, points: 3650, avatar: "C" },
  { rank: 7, name: "Marved", team: "SEN", kills: 221, deaths: 174, wins: 12, points: 3480, avatar: "M" },
  { rank: 8, name: "Less", team: "LOUD", kills: 215, deaths: 169, wins: 12, points: 3320, avatar: "L" },
  { rank: 9, name: "Alfa", team: "KRU", kills: 208, deaths: 178, wins: 11, points: 3150, avatar: "A" },
  { rank: 10, name: "Sayaplayer", team: "100T", kills: 201, deaths: 182, wins: 10, points: 2980, avatar: "S" },
];

const getRankStyle = (rank: number) => {
  if (rank === 1) return "bg-gradient-to-r from-yellow-500 to-amber-600 text-black";
  if (rank === 2) return "bg-gradient-to-r from-slate-300 to-slate-400 text-black";
  if (rank === 3) return "bg-gradient-to-r from-amber-600 to-amber-700 text-black";
  return "bg-muted text-muted-foreground";
};

const Leaderboard = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="overflow-hidden rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm shadow-glow">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b border-border/50 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4">Player</div>
          <div className="col-span-2 text-center flex items-center justify-center gap-1">
            <Target className="w-4 h-4 text-accent" />
            Kills
          </div>
          <div className="col-span-2 text-center flex items-center justify-center gap-1">
            <Skull className="w-4 h-4 text-destructive" />
            Deaths
          </div>
          <div className="col-span-1 text-center flex items-center justify-center gap-1">
            <Trophy className="w-4 h-4 text-primary" />
            Wins
          </div>
          <div className="col-span-2 text-center flex items-center justify-center gap-1">
            <Award className="w-4 h-4 text-accent" />
            Points
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border/30">
          {players.map((player, index) => (
            <div
              key={player.rank}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-accent/10 transition-all duration-300 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Rank */}
              <div className="col-span-1 flex justify-center">
                <span className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm ${getRankStyle(player.rank)}`}>
                  {player.rank}
                </span>
              </div>

              {/* Player Info */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
                  {player.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {player.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{player.team}</p>
                </div>
              </div>

              {/* Kills */}
              <div className="col-span-2 text-center">
                <span className="text-lg font-bold text-accent">{player.kills}</span>
              </div>

              {/* Deaths */}
              <div className="col-span-2 text-center">
                <span className="text-lg font-medium text-muted-foreground">{player.deaths}</span>
              </div>

              {/* Wins */}
              <div className="col-span-1 text-center">
                <span className="text-lg font-bold text-primary">{player.wins}</span>
              </div>

              {/* Points */}
              <div className="col-span-2 text-center">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {player.points.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
