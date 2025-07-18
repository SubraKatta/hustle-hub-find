import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Star, TrendingUp, Users } from "lucide-react";

export interface SideHustle {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeCommitment: string;
  earningsPotential: string;
  upfrontCost: string;
  skills: string[];
  rating: number;
  popularityScore: number;
  featured: boolean;
}

interface SideHustleCardProps {
  sideHustle: SideHustle;
  onLearnMore: (id: number) => void;
}

export const SideHustleCard = ({ sideHustle, onLearnMore }: SideHustleCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-success/10 text-success border-success/20";
      case "Intermediate":
        return "bg-accent/10 text-accent border-accent/20";
      case "Advanced":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="group h-full hover:shadow-hover transition-all duration-300 animate-fade-in bg-gradient-card border-border/50 relative">
      {sideHustle.featured && (
        <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded-full">
          Featured
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-card-foreground mb-2 group-hover:text-primary transition-colors">
              {sideHustle.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {sideHustle.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            {sideHustle.category}
          </Badge>
          <Badge className={`text-xs ${getDifficultyColor(sideHustle.difficulty)}`}>
            {sideHustle.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2 text-success" />
            <span className="font-medium text-success">{sideHustle.earningsPotential}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{sideHustle.timeCommitment}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span>Start-up cost: {sideHustle.upfrontCost}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="h-4 w-4 mr-2 text-accent" />
            <span>{sideHustle.rating}/5 rating</span>
            <Users className="h-4 w-4 ml-4 mr-1" />
            <span>{sideHustle.popularityScore} interested</span>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Skills needed:</p>
          <div className="flex flex-wrap gap-1">
            {sideHustle.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                {skill}
              </span>
            ))}
            {sideHustle.skills.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                +{sideHustle.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <Button 
          onClick={() => onLearnMore(sideHustle.id)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};