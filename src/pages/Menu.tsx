import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MenuItem, MenuItemType, convertMenuItem } from "@/components/MenuItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoryAPI, menuItemAPI } from "@/services/api";
import { Loader2 } from "lucide-react";
import { ItemDetailsModal } from "@/components/ItemDetailsModal";

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
  const [quantity, setQuantity] = useState(1);

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
      existing.quantity += quantity;
    } else {
      cartItems.push({ ...item, quantity });
    }
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart-updated"));
  
    onAddToCart(item);
  };

  const filteredItems =
    activeTab === "all"
      ? menuItems
      : menuItems.filter(
          (item) => item.category.toLowerCase().replace(/\s+/g, "") === activeTab
        );

  const allTabs = [
    { value: "all", label: "All" },
    ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
  ];

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
            Our Menu
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our delicious selection of burgers, sides, ice cream, and refreshing drinks
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 mb-12 h-auto p-1 bg-secondary/50 overflow-x-auto">
            {allTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-sm md:text-base py-3 whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No items found in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="cursor-pointer hover:scale-105 transition-transform"
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

      <ItemDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};