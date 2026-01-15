import { useOutletContext } from "react-router-dom";
import { Menu } from "./Menu";
import { MenuItem } from "@/services/api";

type LayoutContext = {
  onAddToCart: (item: MenuItem) => void;
};

export const MenuWrapper = () => {
  const { onAddToCart } = useOutletContext<LayoutContext>();
  return <Menu onAddToCart={onAddToCart} />;
};
