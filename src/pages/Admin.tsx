import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const defaultFormData: PlayerFormData = {
  rank: 1,
  name: '',
  team: '',
  kills: 0,
  deaths: 0,
  wins: 0,
  points: 0,
  avatar: 'P',
};

const Admin = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState<PlayerFormData>(defaultFormData);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const { data: players = [], isLoading: playersLoading } = useQuery({
    queryKey: ['admin-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('rank', { ascending: true });
      if (error) throw error;
      return data as Player[];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (data: PlayerFormData) => {
      const { error } = await supabase.from('players').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-players'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast({ title: 'Player added successfully' });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to add player', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PlayerFormData }) => {
      const { error } = await supabase.from('players').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-players'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast({ title: 'Player updated successfully' });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update player', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('players').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-players'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast({ title: 'Player deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete player', description: error.message, variant: 'destructive' });
    },
  });

  const openCreateDialog = () => {
    setEditingPlayer(null);
    setFormData(defaultFormData);
    setIsDialogOpen(true);
  };

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

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPlayer(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayer) {
      updateMutation.mutate({ id: editingPlayer.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Shield className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leaderboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-primary to-primary/80">
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border/50">
              <DialogHeader>
                <DialogTitle>{editingPlayer ? 'Edit Player' : 'Add New Player'}</DialogTitle>
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
                    <Label htmlFor="avatar">Avatar (single char)</Label>
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
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-primary to-primary/80"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingPlayer ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {playersLoading ? (
          <p className="text-muted-foreground text-center py-8">Loading players...</p>
        ) : (
          <div className="grid gap-4">
            {players.map((player) => (
              <Card key={player.id} className="bg-card/50 border-border/50">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                      {player.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">#{player.rank} {player.name}</p>
                      <p className="text-sm text-muted-foreground">{player.team}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-muted-foreground">
                      K: {player.kills} | D: {player.deaths} | W: {player.wins} | Pts: {player.points}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(player)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(player.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
