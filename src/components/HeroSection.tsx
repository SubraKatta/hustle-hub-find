import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
}

export const HeroSection = ({ searchTerm, setSearchTerm, onSearch }: HeroSectionProps) => {
  return (
    <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          Discover Your Next
          <span className="block bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
            Side Hustle
          </span>
        </h1>
        
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
          Explore hundreds of proven online business opportunities. From passive income to active ventures,
          find the perfect side hustle that fits your skills and schedule.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto animate-scale-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search opportunities (e.g., 'freelancing', 'passive income')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              className="pl-10 py-3 text-base border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/70"
            />
          </div>
          <Button 
            onClick={onSearch}
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8"
          >
            Search
          </Button>
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in">
          {["Remote Work", "Passive Income", "Creative", "Tech", "E-commerce"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag.toLowerCase())}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};