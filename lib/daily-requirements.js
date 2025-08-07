export function calculateDailyNeeds(userData) {
  const { age, gender, weight, height, activityLevel } = userData

  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  // Activity multipliers
  const activityMultipliers = {
    low: 1.2,
    moderate: 1.55,
    high: 1.725,
  }

  const calories = Math.round(bmr * activityMultipliers[activityLevel])

  // Age-specific requirements for children (WHO/UNICEF standards)
  const getChildRequirements = (age, gender, calories) => {
    const baseRequirements = {
      protein: Math.max(weight * 1.2, 20), // 1.2g per kg body weight, minimum 20g
      carbs: (calories * 0.55) / 4, // 55% of calories
      fat: (calories * 0.3) / 9, // 30% of calories
      fiber: age + 5, // Age + 5 grams
      calcium: age < 9 ? 800 : 1300, // mg
      iron: age < 9 ? 10 : gender === "female" ? 15 : 12, // mg
      vitaminA: age < 9 ? 400 : 600, // mcg
      vitaminC: age < 9 ? 25 : 45, // mg
      vitaminD: 15, // mcg
      zinc: age < 9 ? 5 : 8, // mg
      folate: age < 9 ? 200 : 300, // mcg
    }

    return baseRequirements
  }

  const childReqs = getChildRequirements(age, gender, calories)

  return {
    calories,
    protein: childReqs.protein,
    carbs: childReqs.carbs,
    fat: childReqs.fat,
    fiber: childReqs.fiber,
    calcium: childReqs.calcium,
    iron: childReqs.iron,
    vitaminA: childReqs.vitaminA,
    vitaminC: childReqs.vitaminC,
    vitaminD: childReqs.vitaminD,
    zinc: childReqs.zinc,
    folate: childReqs.folate,
  }
}
