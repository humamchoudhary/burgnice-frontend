import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MenuItem, MenuItemType } from "@/components/MenuItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoryAPI, menuItemAPI } from "@/services/api";
import { Loader2, Search, Filter, Sparkles } from "lucide-react";
import { ItemDetailsModal } from "@/components/ItemDetailsModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MenuProps {
  onAddToCart: (item: MenuItemType) => void;
}

export const Menu = ({ onAddToCart }: MenuProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "under10" | "under20" | "over20">("all");

  // Fetch categories and menu items from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesData, menuData] = await Promise.all([
          categoryAPI.getAll(),
          menuItemAPI.getAll(),
        ]);

        const mappedCategories = categoriesData.map((cat) => ({
          _id: cat._id,
          name: cat.name,
          slug: cat.name.toLowerCase().replace(/\s+/g, ""),
        }));

        const convertedItems = menuData.map((item) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image || '/placeholder-image.jpg',
          category: typeof item.category === 'string' ? item.category : item.category.name,
        }));

        setCategories(mappedCategories);
        setMenuItems(convertedItems);
      } catch (err) {
        console.error("Error fetching menu data:", err);
        setError("Failed to load menu. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Set active tab from URL
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setActiveTab(category);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", value);
    }
    setSearchParams(searchParams);
  };

  const handleItemClick = (item: MenuItemType) => {
    setSelectedItem(item);
  };

  const handleAddToCart = (item: MenuItemType) => {
    const existingCart = sessionStorage.getItem("cart");
    const cartItems: (MenuItemType & { quantity: number })[] = existingCart
      ? JSON.parse(existingCart)
      : [];
    const existing = cartItems.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart-updated"));

    onAddToCart(item);
  };

  // Filter items based on active tab, search query, and price filter
  const filteredItems = menuItems.filter((item) => {
    // Category filter
    const categoryMatch = activeTab === "all" || 
      item.category.toLowerCase().replace(/\s+/g, "") === activeTab;
    
    // Search filter
    const searchMatch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Price filter
    let priceMatch = true;
    switch (priceFilter) {
      case "under10":
        priceMatch = item.price < 10;
        break;
      case "under20":
        priceMatch = item.price < 20;
        break;
      case "over20":
        priceMatch = item.price >= 20;
        break;
    }
    
    return categoryMatch && searchMatch && priceMatch;
  });

  const allTabs = [
    { value: "all", label: "All" },
    ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
            <Sparkles className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Crafting Your Menu</h2>
            <p className="text-muted-foreground">Loading delicious options...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10">
        <div className="text-center max-w-md p-8 rounded-3xl bg-gradient-to-br from-background to-accent/5 border border-accent/20 shadow-2xl">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Menu Unavailable</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            size="lg"
            className="rounded-full px-8 bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl hover:scale-105 transition-all"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/20">
        {/* Simple pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(251,146,60,0.3),transparent_40%)]"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Manchester's Finest</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
              OUR MENU
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Handcrafted perfection in every bite. Explore our signature burgers, premium sides, artisan ice cream, and refreshing drinks.
            </p>
            
            {/* Search and Filter Bar */}
            <div className="max-w-4xl mx-auto space-y-4 mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for burgers, ice cream, drinks..."
                  className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Price Filter */}
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="text-sm font-medium text-muted-foreground flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter by price:
                </span>
                {[
                  { value: "all", label: "All Prices" },
                  { value: "under10", label: "Under £10" },
                  { value: "under20", label: "Under £20" },
                  { value: "over20", label: "Premium (£20+)" },
                ].map((filter) => (
                  <Badge
                    key={filter.value}
                    variant={priceFilter === filter.value ? "default" : "outline"}
                    className="px-4 py-2 rounded-full cursor-pointer transition-all hover:scale-105"
                    onClick={() => setPriceFilter(filter.value as any)}
                  >
                    {filter.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Category Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="sticky top-20 z-30 bg-background/95 backdrop-blur-sm py-4 -mt-4 mb-8">
              <div className="max-w-6xl mx-auto">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 mb-4 h-auto p-1 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-2xl border border-border/50 overflow-x-auto">
                  {allTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="py-3 px-4 text-sm md:text-base font-medium rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {/* Results Counter */}
                <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
                  <span>
                    Showing <span className="font-bold text-foreground">{filteredItems.length}</span> of {menuItems.length} items
                  </span>
                  {searchQuery && (
                    <span className="flex items-center gap-2">
                      <Search className="h-3 w-3" />
                      Searching: "{searchQuery}"
                    </span>
                  )}
                </div>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {filteredItems.length === 0 ? (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">No Items Found</h3>
                    <p className="text-muted-foreground mb-8">
                      {searchQuery 
                        ? `No items match "${searchQuery}" in ${activeTab === "all" ? "all categories" : activeTab}. Try a different search.`
                        : `No items available in ${activeTab === "all" ? "all categories" : activeTab}.`}
                    </p>
                    {(searchQuery || priceFilter !== "all") && (
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          setSearchQuery("");
                          setPriceFilter("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {filteredItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="group animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => handleItemClick(item)}
                    >
                      <MenuItem
                        item={item}
                        onAddToCart={() => handleAddToCart(item)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Featured Items Section */}
      {menuItems.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">Must Try</span>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Customer <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Favorites</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These are the dishes our customers keep coming back for
              </p>
            </div>
            
            {/* Show top 4 items by category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {menuItems
                .filter(item => ["burgers", "icecream"].includes(item.category.toLowerCase().replace(/\s+/g, "")))
                .slice(0, 4)
                .map((item, index) => (
                  <div 
                    key={item.id} 
                    className="relative group animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative">
                      <MenuItem
                        item={item}
                        onAddToCart={() => handleAddToCart(item)}
                      />
                      {index === 0 && (
                        <div className="absolute -top-3 -right-3 z-10">
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full shadow-lg animate-pulse">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-background to-accent/5 rounded-3xl p-12 border border-accent/20 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Hungry for <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">More?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't decide? Order our Burger & Ice Cream Combo and save 15%!
            </p>
            <Button
              size="lg"
              className="rounded-full px-12 py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 font-semibold group"
              onClick={() => {
                // Find combo items or trigger special offer
                const burger = menuItems.find(item => item.category.toLowerCase().includes('burger'));
                const icecream = menuItems.find(item => item.category.toLowerCase().includes('ice'));
                if (burger && icecream) {
                  handleAddToCart(burger);
                  handleAddToCart(icecream);
                }
              }}
            >
              <span className="flex items-center gap-2">
                Order Combo Deal
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </span>
            </Button>
            <p className="text-sm text-muted-foreground mt-6">
              <span className="line-through">£24.98</span> → <span className="text-primary font-bold">£21.23</span> (Save 15%)
            </p>
          </div>
        </div>
      </section>

      <ItemDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};