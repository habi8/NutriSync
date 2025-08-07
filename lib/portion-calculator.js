const portionGrams = {
  "half-plate": 150,
  "full-plate": 300,
  "small-bowl": 100,
  "large-bowl": 200,
  tablespoon: 15,
  teaspoon: 5,
  cup: 240,
  "half-cup": 120,
  "small-piece": 50,
  "medium-piece": 100,
  "large-piece": 150,
  slice: 30,
  scoop: 60,
}

export function calculatePortionGrams(food, portionType, count) {
  const baseGrams = portionGrams[portionType] || 100

  // Adjust for food density
  const adjustedGrams = baseGrams * food.density * count

  // Food-specific adjustments
  switch (
    food.category.en // Use English key for switch for consistency
  ) {
    case "Rice & Grains":
      return Math.round(adjustedGrams * 1.2) // Rice expands when cooked
    case "Fish & Meat":
      return Math.round(adjustedGrams * 0.9) // Protein foods are denser
    case "Vegetables":
      return Math.round(adjustedGrams * 0.8) // Vegetables are lighter
    case "Lentils & Legumes":
      return Math.round(adjustedGrams * 1.1) // Lentils expand when cooked
    case "Fruits":
      return Math.round(adjustedGrams * 0.9) // Fruits have water content
    case "Dairy":
      return Math.round(adjustedGrams * 1.0) // Standard density
    case "Oils & Fats":
      return Math.round(adjustedGrams * 0.5) // Very small portions
    default:
      return Math.round(adjustedGrams)
  }
}
