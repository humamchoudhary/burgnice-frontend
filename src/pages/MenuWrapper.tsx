import { useOutletContext } from "react-router-dom";
import { Menu } from "./Menu";
import { MenuItemType } from "@/components/MenuItem";

type LayoutContext = {
  onAddToCart: (item: MenuItemType) => void;
};

export const MenuWrapper = () => {
  const { onAddToCart } = useOutletContext<LayoutContext>();
  return <Menu onAddToCart={onAddToCart} />;
};
