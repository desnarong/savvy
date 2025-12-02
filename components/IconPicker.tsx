// components/IconPicker.tsx
import { Utensils, Bus, Home, ShoppingBag, Coffee, Film, Gift, Heart, Gamepad2, Book, Smartphone, Stethoscope, Plane, MoreHorizontal, LucideIcon } from "lucide-react";

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

export const CategoryIcon = ({ iconName, size = 20, className = "" }: { iconName?: string | null, size?: number, className?: string }) => {
  const found = iconOptions.find(opt => opt.name === iconName);
  const IconComponent = found ? found.icon : MoreHorizontal; 
  return <IconComponent size={size} className={className} />;
};

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
