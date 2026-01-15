import { useOutletContext } from "react-router-dom";
import { Home } from "./Home";
import { MenuItem } from "@/services/api";

interface IndexContext {
  onAddToCart: (item: MenuItem) => void;
}

const Index = () => {
  const { onAddToCart } = useOutletContext<IndexContext>();
  
  return <Home onAddToCart={onAddToCart} />;
};

export default Index;
