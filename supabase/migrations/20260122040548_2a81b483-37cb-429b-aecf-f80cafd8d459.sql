-- Create players table for leaderboard
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rank INTEGER NOT NULL,
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  kills INTEGER NOT NULL DEFAULT 0,
  deaths INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  avatar TEXT NOT NULL DEFAULT 'P',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view leaderboard)
CREATE POLICY "Anyone can view players" 
ON public.players 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_players_updated_at
BEFORE UPDATE ON public.players
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial leaderboard data
INSERT INTO public.players (rank, name, team, kills, deaths, wins, points, avatar) VALUES
(1, 'TenZ', 'SEN', 287, 142, 18, 4850, 'T'),
(2, 'Demon1', 'EG', 265, 156, 16, 4420, 'D'),
(3, 'Aspas', 'LEV', 251, 148, 15, 4180, 'A'),
(4, 'Derke', 'FNC', 243, 161, 14, 3920, 'D'),
(5, 'yay', 'C9', 238, 152, 14, 3780, 'Y'),
(6, 'Chronicle', 'FNC', 229, 168, 13, 3650, 'C'),
(7, 'Marved', 'SEN', 221, 174, 12, 3480, 'M'),
(8, 'Less', 'LOUD', 215, 169, 12, 3320, 'L'),
(9, 'Alfa', 'KRU', 208, 178, 11, 3150, 'A'),
(10, 'Sayaplayer', '100T', 201, 182, 10, 2980, 'S');