import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MenuItem as MenuItemComponent } from "@/components/MenuItem";
import { categoryAPI, menuItemAPI, MenuItem } from "@/services/api";
import {
  Loader2,
  Search,
  Filter,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ItemDetailsModal } from "@/components/ItemDetailsModal";
import { useAuth } from "@/contexts/authContext";

interface MenuProps {
  onAddToCart: (item: MenuItem) => void;
}

export const Menu = ({ onAddToCart }: MenuProps) => {
  const { addToCart } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<
    { _id: string; name: string; slug: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<
    "all" | "under10" | "under20" | "over20"
  >("all");

  // Set search query from URL params
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

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
        console.log(menuData);

        const convertedItems = menuData.map((item) => {
          let categoriesArray: string[] = [];

          if (Array.isArray(item.categories)) {
            categoriesArray = item.categories.map((cat: any) =>
              typeof cat === "object" && cat.name ? cat.name : String(cat),
            );
          } else if (item.category) {
            categoriesArray = [
              typeof item.category === "object" && item.category.name
                ? item.category.name
                : String(item.category),
            ];
          }

          return {
            id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            categories: categoriesArray,
          };
        });

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

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleAddToCart = (item: MenuItem) => {
    console.log("Menu Item", item);
    const cartItem = {
      id: item.id, // temp client id
      menuItem: {
        _id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      },
      quantity: 1,
      customizations: {},
      addedAt: new Date().toISOString(),
      total: item.price,
    };
    addToCart(cartItem);
  };
  // Filter items based on active tab, search query, and price filter
  const filteredItems = menuItems.filter((item) => {
    const categoryMatch =
      activeTab === "all" ||
      item.categories?.some(
        (cat) => cat.toLowerCase().replace(/\s+/g, "") === activeTab,
      );

    const searchMatch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categories?.some((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase()),
      );

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100/10 dark:from-gray-900 dark:to-gray-800/10">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
            <Sparkles className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Crafting Your Menu
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Loading delicious options...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100/10 dark:from-gray-900 dark:to-gray-800/10 pt-10">
        <div className="text-center max-w-md p-8 rounded-3xl bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10 border border-primary/20 dark:border-primary/30 shadow-2xl">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Menu Unavailable
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-gray-100/20 dark:to-gray-800/20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(251,146,60,0.3),transparent_40%)]"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:to-primary/10 border border-primary/30 dark:border-primary/40">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Manchester's Finest
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight bg-gradient-to-b from-gray-900 to-gray-900/80 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              OUR MENU
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Handcrafted perfection in every bite. Explore our signature
              burgers, premium sides, artisan ice cream, and refreshing drinks.
            </p>

            {/* Search and Filter Bar */}
            <div className="max-w-4xl mx-auto space-y-4 mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search for burgers, ice cream, drinks..."
                  className="w-full pl-12 pr-4 py-3 text-lg rounded-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Price Filter */}
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter by price:
                </span>
                {[
                  { value: "all", label: "All Prices" },
                  { value: "under10", label: "Under £10" },
                  { value: "under20", label: "Under £20" },
                  { value: "over20", label: "Premium (£20+)" },
                ].map((filter) => (
                  <span
                    key={filter.value}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 ${
                      priceFilter === filter.value
                        ? "bg-primary text-white border-primary"
                        : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setPriceFilter(filter.value as any)}
                  >
                    {filter.label}
                  </span>
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
          <div className="w-full">
            <div className="sticky top-20 z-30  dark:bg-gray-900/95 backdrop-blur-sm py-4 -mt-4 mb-8">
              <div className="max-w-6xl mx-auto">
                <div className="relative group mb-4">
                  {/* Left scroll button */}
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-gray-300/50 dark:border-gray-700/50  group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 hover:bg-white dark:hover:bg-gray-900"
                    onClick={(e) => {
                      const container =
                        e.currentTarget.parentElement?.querySelector(
                          ".tabs-container",
                        );
                      if (container) container.scrollLeft -= 200;
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>

                  {/* Right scroll button */}
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-gray-300/50 dark:border-gray-700/50  group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 hover:bg-white dark:hover:bg-gray-900"
                    onClick={(e) => {
                      const container =
                        e.currentTarget.parentElement?.querySelector(
                          ".tabs-container",
                        );
                      if (container) container.scrollLeft += 200;
                    }}
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>

                  <div className="tabs-container flex w-full overflow-x-auto overflow-y-hidden scroll-smooth py-3 px-8 bg-gradient-to-r from-gray-100/20 to-primary/20 dark:from-gray-800/20 dark:to-primary/20 rounded-2xl border border-gray-300/50 dark:border-gray-700/50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {allTabs.map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`flex-shrink-0 min-w-24 py-2 px-4 mx-1 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 whitespace-nowrap border ${
                          activeTab === tab.value
                            ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg border-transparent"
                            : "border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Counter */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 px-2">
                  <span>
                    Showing{" "}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {filteredItems.length}
                    </span>{" "}
                    of {menuItems.length} items
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

            <div className="mt-0">
              {filteredItems.length === 0 ? (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100/20 to-primary/20 dark:from-gray-800/20 dark:to-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      No Items Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                      {searchQuery
                        ? `No items match "${searchQuery}" in ${activeTab === "all" ? "all categories" : activeTab}. Try a different search.`
                        : `No items available in ${activeTab === "all" ? "all categories" : activeTab}.`}
                    </p>
                    {(searchQuery || priceFilter !== "all") && (
                      <button
                        className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => {
                          setSearchQuery("");
                          setPriceFilter("all");
                        }}
                      >
                        Clear Filters
                      </button>
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
                      <MenuItemComponent
                        item={item}
                        onAddToCart={() => handleAddToCart(item)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      {menuItems.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-gray-100/10 dark:from-gray-900 dark:to-gray-800/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">
                  Must Try
                </span>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Customer{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Favorites
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                These are the dishes our customers keep coming back for
              </p>
            </div>

            {/* Show top 4 items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {menuItems
                .filter((item) => {
                  return item.categories?.some((cat) => {
                    const cleanCat = cat.toLowerCase().replace(/\s+/g, "");
                    return (
                      cleanCat.includes("burger") || cleanCat.includes("ice")
                    );
                  });
                })
                .slice(0, 4)
                .map((item, index) => (
                  <div
                    key={item.id}
                    className="relative group animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/30 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative">
                      <MenuItemComponent
                        item={item}
                        onAddToCart={() => handleAddToCart(item)}
                      />
                      {index === 0 && (
                        <div className="absolute -top-3 -right-3 z-10">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg animate-pulse">
                            Most Popular
                          </span>
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10 rounded-3xl p-12 border border-primary/20 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Hungry for{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                More?
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Can't decide? Order our Burger & Ice Cream Combo and save 15%!
            </p>
            <button
              className="rounded-full px-12 py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group"
              onClick={() => {
                const burger = menuItems.find((item) =>
                  item.categories?.some((cat) =>
                    cat.toLowerCase().includes("burger"),
                  ),
                );
                const icecream = menuItems.find((item) =>
                  item.categories?.some((cat) =>
                    cat.toLowerCase().includes("ice"),
                  ),
                );
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
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
              <span className="line-through">£24.98</span> →{" "}
              <span className="text-primary font-bold">£21.23</span> (Save 15%)
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
