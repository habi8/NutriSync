import { translations } from "./translations"

export function assessMalnutritionRisk(userData, currentIntake, dailyNeeds, language) {
  const { age, gender, weight, height } = userData

  // Calculate BMI
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  // Calculate Z-scores using WHO growth standards (simplified)
  const zScores = calculateZScores(age, gender, weight, height, bmi)

  // Assess growth status
  const stunting = zScores.heightForAge < -2
  const wasting = zScores.weightForHeight < -2
  const underweight = zScores.weightForAge < -2

  // Calculate nutritional adequacy
  const adequacyRatios = {
    calories: currentIntake.calories / dailyNeeds.calories,
    protein: currentIntake.protein / dailyNeeds.protein,
    iron: currentIntake.iron / dailyNeeds.iron,
    calcium: currentIntake.calcium / dailyNeeds.calcium,
    vitaminA: currentIntake.vitaminA / dailyNeeds.vitaminA,
    vitaminC: currentIntake.vitaminC / dailyNeeds.vitaminC,
    vitaminD: currentIntake.vitaminD / dailyNeeds.vitaminD,
    zinc: currentIntake.zinc / dailyNeeds.zinc,
    folate: currentIntake.folate / dailyNeeds.folate,
  }

  // Identify deficiencies
  const deficiencies = []
  if (adequacyRatios.calories < 0.8) deficiencies.push("calories")
  if (adequacyRatios.protein < 0.8) deficiencies.push("protein")
  if (adequacyRatios.iron < 0.8) deficiencies.push("iron")
  if (adequacyRatios.calcium < 0.8) deficiencies.push("calcium")
  if (adequacyRatios.vitaminA < 0.8) deficiencies.push("vitaminA")
  if (adequacyRatios.vitaminC < 0.8) deficiencies.push("vitaminC")
  if (adequacyRatios.vitaminD < 0.8) deficiencies.push("vitaminD")
  if (adequacyRatios.zinc < 0.8) deficiencies.push("zinc")
  if (adequacyRatios.folate < 0.8) deficiencies.push("folate")

  // Calculate risk score (0-100)
  let riskScore = 0

  // Growth indicators (40% weight)
  if (stunting) riskScore += 15
  if (wasting) riskScore += 15
  if (underweight) riskScore += 10

  // Nutritional adequacy (60% weight)
  const avgAdequacy =
    Object.values(adequacyRatios).reduce((sum, ratio) => sum + ratio, 0) / Object.values(adequacyRatios).length
  riskScore += Math.max(0, (1 - avgAdequacy) * 60)

  riskScore = Math.min(100, Math.max(0, riskScore))

  // Determine risk level
  let malnutritionRisk
  if (riskScore < 25) malnutritionRisk = "low"
  else if (riskScore < 50) malnutritionRisk = "moderate"
  else if (riskScore < 75) malnutritionRisk = "high"
  else malnutritionRisk = "severe"

  // Generate recommendations
  const recommendations = generateRecommendations(userData, deficiencies, stunting, wasting, underweight, language)

  return {
    malnutritionRisk,
    riskScore: Math.round(riskScore),
    stunting,
    wasting,
    underweight,
    deficiencies,
    recommendations,
    bmi,
    zScores,
  }
}

function calculateZScores(age, gender, weight, height, bmi) {
  // Simplified Z-score calculation based on WHO standards
  // In a real application, you would use the complete WHO growth charts

  const ageInMonths = age * 12

  // These are simplified approximations - real implementation would use WHO lookup tables
  const heightForAge =
    gender === "male" ? (height - (75 + age * 6)) / (age * 0.5 + 3) : (height - (74 + age * 5.8)) / (age * 0.5 + 2.8)

  const weightForAge =
    gender === "male"
      ? (weight - (10 + age * 2.5)) / (age * 0.3 + 1.5)
      : (weight - (9.5 + age * 2.3)) / (age * 0.3 + 1.4)

  const weightForHeight = (bmi - 16) / 2

  return {
    heightForAge: Math.max(-4, Math.min(4, heightForAge)),
    weightForAge: Math.max(-4, Math.min(4, weightForAge)),
    weightForHeight: Math.max(-4, Math.min(4, weightForHeight)),
  }
}

function generateRecommendations(userData, deficiencies, stunting, wasting, underweight, language) {
  const recommendations = []
  const t = (key) => translations[key][language]

  // Growth-based recommendations
  if (stunting) {
    recommendations.push(t("recStunting"))
  }

  if (wasting) {
    recommendations.push(t("recWasting"))
  }

  if (underweight) {
    recommendations.push(t("recUnderweight"))
  }

  // Deficiency-based recommendations
  if (deficiencies.includes("protein")) {
    recommendations.push(t("recProteinDeficiency"))
  }

  if (deficiencies.includes("iron")) {
    recommendations.push(t("recIronDeficiency"))
  }

  if (deficiencies.includes("calcium")) {
    recommendations.push(t("recCalciumDeficiency"))
  }

  if (deficiencies.includes("vitaminA")) {
    recommendations.push(t("recVitaminADeficiency"))
  }

  if (deficiencies.includes("vitaminC")) {
    recommendations.push(t("recVitaminCDeficiency"))
  }

  if (deficiencies.includes("zinc")) {
    recommendations.push(t("recZincDeficiency"))
  }

  // General recommendations
  recommendations.push(t("recGeneral1"))
  recommendations.push(t("recGeneral2"))
  recommendations.push(t("recGeneral3"))

  if (userData.monthlyBudget < 5000) {
    recommendations.push(t("recBudget"))
  }

  return recommendations
}
