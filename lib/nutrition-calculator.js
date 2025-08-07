import { bangladeshiFoods } from "./food-database"

export function calculateNutritionalValues(foodEntries) {
  const totalNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    calcium: 0,
    iron: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    zinc: 0,
    folate: 0,
  }

  foodEntries.forEach((entry) => {
    // Find food by its English name (as stored in FoodEntry.name after translation)
    const food = bangladeshiFoods.find((f) => f.name.en === entry.name || f.name.bn === entry.name)
    if (!food) return

    const gramsRatio = entry.estimatedGrams / 100 // Nutrition values are per 100g

    totalNutrition.calories += food.nutrition.calories * gramsRatio
    totalNutrition.protein += food.nutrition.protein * gramsRatio
    totalNutrition.carbs += food.nutrition.carbs * gramsRatio
    totalNutrition.fat += food.nutrition.fat * gramsRatio
    totalNutrition.fiber += food.nutrition.fiber * gramsRatio
    totalNutrition.calcium += food.nutrition.calcium * gramsRatio
    totalNutrition.iron += food.nutrition.iron * gramsRatio
    totalNutrition.vitaminA += food.nutrition.vitaminA * gramsRatio
    totalNutrition.vitaminC += food.nutrition.vitaminC * gramsRatio
    totalNutrition.vitaminD += food.nutrition.vitaminD * gramsRatio
    totalNutrition.zinc += food.nutrition.zinc * gramsRatio
    totalNutrition.folate += food.nutrition.folate * gramsRatio
  })

  // Round all values
  Object.keys(totalNutrition).forEach((key) => {
    totalNutrition[key] = Math.round(totalNutrition[key] * 100) / 100
  })

  return totalNutrition
}
