import { IceCream, Coffee, Leaf, Droplet, Apple } from 'lucide-react';

function Category({ icon, label, isActive, onClick }) {
  return (
    <div
      className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${
        isActive ? 'scale-110' : 'hover:scale-105'
      }`}
      onClick={onClick}
    >
      <div
        className={`w-12 h-12 rounded-full ${
          isActive ? 'bg-[#7AB32E]' : 'bg-[#8CC63F]'
        } flex items-center justify-center`}
      >
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function ProductCategorySelector({ activeCategory, onCategoryChange }) {
  const categories = [
    { icon: <IceCream className="text-white" />, label: 'ICE CREAM', value: 'ice-cream' },
    { icon: <Coffee className="text-white" />, label: 'FRUIT TEA', value: 'fruit-tea' },
    { icon: <Leaf className="text-white" />, label: 'BEST JAM', value: 'jam' },
    { icon: <Droplet className="text-white" />, label: 'JUICE', value: 'juice' },
    { icon: <Apple className="text-white" />, label: 'SNACKS', value: 'snacks' },
  ];

  return (
    <div className="grid grid-cols-5 gap-8 justify-center mb-12">
      {categories.map((category) => (
        <Category
          key={category.value}
          icon={category.icon}
          label={category.label}
          isActive={activeCategory === category.value}
          onClick={() => onCategoryChange(category.value)}
        />
      ))}
    </div>
  );
}

export { ProductCategorySelector };
