import { useState } from "react";
import { Trophy, Skull, Target, Award, Pencil } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Player {
  id: string;
  rank: number;
  name: string;
  team: string;
  kills: number;
  deaths: number;
  wins: number;
  points: number;
  avatar: string;
}

interface PlayerFormData {
  rank: number;
  name: string;
  team: string;
  kills: number;
  deaths: number;
  wins: number;
  points: number;
  avatar: string;
}

const getRankStyle = (rank: number) => {
  if (rank === 1) return "bg-gradient-to-r from-yellow-500 to-amber-600 text-black";
  if (rank === 2) return "bg-gradient-to-r from-slate-300 to-slate-400 text-black";
  if (rank === 3) return "bg-gradient-to-r from-amber-600 to-amber-700 text-black";
  return "bg-muted text-muted-foreground";
};

const Leaderboard = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState<PlayerFormData>({
    rank: 1, name: '', team: '', kills: 0, deaths: 0, wins: 0, points: 0, avatar: 'P'
  });

  const { data: players = [], isLoading, error } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('rank', { ascending: true });
      
      if (error) throw error;
      return data as Player[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PlayerFormData }) => {
      const { error } = await supabase.from('players').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast({ title: 'Player updated successfully' });
      setIsDialogOpen(false);
      setEditingPlayer(null);
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update player', description: error.message, variant: 'destructive' });
    },
  });

  const openEditDialog = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      rank: player.rank,
      name: player.name,
      team: player.team,
      kills: player.kills,
      deaths: player.deaths,
      wins: player.wins,
      points: player.points,
      avatar: player.avatar,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayer) {
      updateMutation.mutate({ id: editingPlayer.id, data: formData });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="overflow-hidden rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm shadow-glow p-8 text-center">
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="overflow-hidden rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm shadow-glow p-8 text-center">
          <p className="text-destructive">Error loading leaderboard</p>
        </div>
      </div>
    );
  }

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
              key={player.id}
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
              <div className="col-span-2 text-center flex items-center justify-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {player.points.toLocaleString()}
                </span>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => openEditDialog(player)}
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Dialog - Admin Only */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle>Edit Player Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rank">Rank</Label>
                <Input
                  id="rank"
                  type="number"
                  value={formData.rank}
                  onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) || 0 })}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value.slice(0, 2) })}
                  className="bg-muted/50"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Player Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-muted/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team">Team</Label>
              <Input
                id="team"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                className="bg-muted/50"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kills">Kills</Label>
                <Input
                  id="kills"
                  type="number"
                  value={formData.kills}
                  onChange={(e) => setFormData({ ...formData, kills: parseInt(e.target.value) || 0 })}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deaths">Deaths</Label>
                <Input
                  id="deaths"
                  type="number"
                  value={formData.deaths}
                  onChange={(e) => setFormData({ ...formData, deaths: parseInt(e.target.value) || 0 })}
                  className="bg-muted/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wins">Wins</Label>
                <Input
                  id="wins"
                  type="number"
                  value={formData.wins}
                  onChange={(e) => setFormData({ ...formData, wins: parseInt(e.target.value) || 0 })}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                  className="bg-muted/50"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-primary to-primary/80"
                disabled={updateMutation.isPending}
              >
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leaderboard;
