import { useOutletContext } from "react-router-dom";
import { Home } from "./Home";
import { MenuItemType } from "@/components/MenuItem";

interface IndexContext {
  onAddToCart: (item: MenuItemType) => void;
}

const Index = () => {
  const { onAddToCart } = useOutletContext<IndexContext>();
  
  return <Home onAddToCart={onAddToCart} />;
};

export default Index;
