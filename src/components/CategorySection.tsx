import { 
  Laptop, 
  PaintBucket, 
  ShoppingCart, 
  BookOpen, 
  DollarSign, 
  Users,
  Smartphone,
  Camera
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Remote Work",
    icon: Laptop,
    description: "Work from anywhere opportunities",
    count: 45,
    color: "bg-primary/10 text-primary"
  },
  {
    name: "Creative",
    icon: PaintBucket,
    description: "Design, writing, and artistic ventures",
    count: 32,
    color: "bg-accent/10 text-accent"
  },
  {
    name: "E-commerce",
    icon: ShoppingCart,
    description: "Online selling and retail",
    count: 28,
    color: "bg-success/10 text-success"
  },
  {
    name: "Education",
    icon: BookOpen,
    description: "Teaching and course creation",
    count: 24,
    color: "bg-primary-glow/10 text-primary-glow"
  },
  {
    name: "Passive Income",
    icon: DollarSign,
    description: "Earn while you sleep",
    count: 19,
    color: "bg-accent/10 text-accent"
  },
  {
    name: "Social Media",
    icon: Users,
    description: "Content creation and influence",
    count: 22,
    color: "bg-primary/10 text-primary"
  },
  {
    name: "Apps & Tech",
    icon: Smartphone,
    description: "Software and app development",
    count: 17,
    color: "bg-success/10 text-success"
  },
  {
    name: "Photography",
    icon: Camera,
    description: "Visual content and stock photos",
    count: 15,
    color: "bg-primary-glow/10 text-primary-glow"
  }
];

interface CategorySectionProps {
  onCategorySelect: (category: string) => void;
}

export const CategorySection = ({ onCategorySelect }: CategorySectionProps) => {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Browse by Category</h2>
          <p className="text-muted-foreground text-lg">
            Find opportunities that match your interests and skills
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.name}
                className="group cursor-pointer hover:shadow-hover transition-all duration-300 animate-fade-in bg-gradient-card border-border/50"
                onClick={() => onCategorySelect(category.name.toLowerCase())}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-3 rounded-full ${category.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <div className="text-xs text-primary font-medium">
                    {category.count} opportunities
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};