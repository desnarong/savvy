// components/IconPicker.tsx
import { Coffee, Home, Utensils, Zap, ShoppingCart, Heart, Briefcase, TrendingUp } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  coffee: <Coffee size={20} />,
  home: <Home size={20} />,
  food: <Utensils size={20} />,
  electric: <Zap size={20} />,
  shopping: <ShoppingCart size={20} />,
  heart: <Heart size={20} />,
  work: <Briefcase size={20} />,
  income: <TrendingUp size={20} />,
};

export function CategoryIcon({ iconName, size = 20 }: { iconName?: string | null; size?: number }) {
  const icon = iconName || undefined;
  if (!icon) return <ShoppingCart size={size} />;
  return iconMap[icon.toLowerCase()] || <ShoppingCart size={size} />;
}

export const iconOptions = [
  { name: "food", icon: Utensils },
  { name: "transport", icon: Bus },
  { name: "home", icon: Home },
  { name: "shopping", icon: ShoppingBag },
  { name: "coffee", icon: Coffee },
  { name: "entertainment", icon: Film },
  { name: "gift", icon: Gift },
  { name: "health", icon: Heart },
  { name: "game", icon: Gamepad2 },
  { name: "education", icon: Book },
  { name: "phone", icon: Smartphone },
  { name: "medical", icon: Stethoscope },
  { name: "travel", icon: Plane },
  { name: "other", icon: MoreHorizontal },
];

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}

export const IconPicker = ({ selectedIcon, onSelect }: IconPickerProps) => {
  return (
    <div className="grid grid-cols-7 gap-2 p-2 border border-slate-200 rounded-2xl bg-slate-50 max-h-48 overflow-y-auto custom-scrollbar">
      {iconOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedIcon === option.name;
        return (
          <button
            key={option.name}
            onClick={() => onSelect(option.name)}
            className={`p-3 rounded-xl flex justify-center items-center transition duration-200 ${
              isSelected 
                ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105" // <-- สีน้ำเงินที่ถูกต้อง
                : "bg-white text-slate-400 hover:bg-blue-50 hover:text-blue-500 border border-slate-100"
            }`}
            type="button"
          >
            <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
          </button>
        );
      })}
    </div>
  );
};
