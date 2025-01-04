import { iceCream, jam, juice, snacks, tea } from '@/assets/images'

const Category = ({ icon, label, isActive, onClick }) => (
  <div
    className={`flex flex-col items-center hover:text-[#8CC63F] transition-all duration-300 ease-in-out cursor-pointer transition-all group  ${
      isActive ? 'text-[#8CC63F]' : 'text-gray-600'
    }`}
    onClick={onClick}
  >
    <div className="w-16 h-16 flex items-center justify-center">
      <img src={icon} alt={label} />
    </div>
    <span className="text-xs font-bold tracking-wider">{label}</span>
  </div>
)

export function ProductCategorySelector({ activeCategory, onCategoryChange }) {
  const categories = [
    { icon: iceCream, label: 'ICE CREAM', value: 'ice-cream' },
    { icon: tea, label: 'FRUIT TEA', value: 'fruit-tea' },
    { icon: jam, label: 'FRUIT JAM', value: 'fruit-jam' },
    { icon: juice, label: 'JUICE', value: 'juice' },
    { icon: snacks, label: 'SNACKS', value: 'snacks' },
  ]

  return (
    <div className="flex justify-center gap-12 mb-16">
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
  )
}
