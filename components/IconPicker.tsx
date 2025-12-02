// components/IconPicker.tsx
import { Coffee, Home, Utensils, Zap, ShoppingCart, Heart, Briefcase, TrendingUp, Bus, ShoppingBag, Smartphone } from "lucide-react";
import React, { useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
  coffee: <Coffee size={20} />,
  home: <Home size={20} />,
  food: <Utensils size={20} />,
  transport: <Bus size={20} />,
  shopping: <ShoppingCart size={20} />,
  heart: <Heart size={20} />,
  work: <Briefcase size={20} />,
  income: <TrendingUp size={20} />,
};

// ✅ เพิ่ม Bus import และแก้ ShoppingBag
export const iconOptions = [
  { name: "food", icon: Utensils },
  { name: "transport", icon: Bus },
  { name: "home", icon: Home },
  { name: "shopping", icon: ShoppingCart },
  { name: "coffee", icon: Coffee },
  { name: "heart", icon: Heart },
  { name: "work", icon: Briefcase },
  { name: "income", icon: TrendingUp },
];

// ✅ เพิ่ม className prop support
export function CategoryIcon({ iconName, size = 20, className = "" }: { iconName?: string | null; size?: number; className?: string }) {
  const icon = iconName || undefined;
  if (!icon) return <div className={className}><ShoppingCart size={size} /></div>;
  
  return (
    <div className={className}>
      {iconMap[icon.toLowerCase()] || <ShoppingCart size={size} />}
    </div>
  );
}

export function IconPicker({ selectedIcon, onSelect }: { selectedIcon: string; onSelect: (icon: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {iconOptions.map(option => (
        <button
          key={option.name}
          onClick={() => onSelect(option.name)}
          className={`p-3 rounded-xl border-2 transition flex items-center justify-center ${
            selectedIcon === option.name
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
          }`}
        >
          <option.icon size={24} />
        </button>
      ))}
    </div>
  );
}
