import { useState, useMemo } from "react";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { SideHustleCard } from "@/components/SideHustleCard";
import { sideHustles } from "@/data/sideHustles";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  const filteredAndSortedHustles = useMemo(() => {
    let filtered = sideHustles.filter((hustle) => {
      const matchesSearch = searchTerm === "" || 
        hustle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hustle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hustle.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hustle.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "" || 
        hustle.category.toLowerCase().includes(selectedCategory.toLowerCase());
      
      const matchesDifficulty = selectedDifficulty === "all" || 
        hustle.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.popularityScore - a.popularityScore;
        case "popularity":
          return b.popularityScore - a.popularityScore;
        case "rating":
          return b.rating - a.rating;
        case "earnings":
          // Simple comparison based on max earnings (extract number from string)
          const aMax = parseInt(a.earningsPotential.match(/\$[\d,]+/g)?.[1]?.replace(/[$,]/g, '') || '0');
          const bMax = parseInt(b.earningsPotential.match(/\$[\d,]+/g)?.[1]?.replace(/[$,]/g, '') || '0');
          return bMax - aMax;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      toast({
        title: "Search Results",
        description: `Found ${filteredAndSortedHustles.length} opportunities matching "${searchTerm}"`,
      });
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm("");
    toast({
      title: "Category Selected",
      description: `Showing ${category} opportunities`,
    });
  };

  const handleLearnMore = (id: number) => {
    const hustle = sideHustles.find(h => h.id === id);
    toast({
      title: "Learn More",
      description: `Opening details for ${hustle?.title}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
      />
      
      <CategorySection onCategorySelect={handleCategorySelect} />
      
      {/* Filters and Sort */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="earnings">Earnings</SelectItem>
                </SelectContent>
              </Select>
              
              {(selectedCategory || selectedDifficulty !== "all") && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedDifficulty("all");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredAndSortedHustles.length} opportunities
              </span>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {filteredAndSortedHustles.map((hustle) => (
              <SideHustleCard
                key={hustle.id}
                sideHustle={hustle}
                onLearnMore={handleLearnMore}
              />
            ))}
          </div>
          
          {filteredAndSortedHustles.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-foreground mb-2">No opportunities found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedDifficulty("all");
                }}
              >
                Show All Opportunities
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
