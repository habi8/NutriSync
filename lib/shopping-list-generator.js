import { translations } from "./translations"

export function generateShoppingList(analysisResult, userData, language) {
  // Make the translation lookup more robust
  const t = (key) => {
    const translatedObject = translations[key]
    // If the key itself is missing from translations, return a fallback string
    if (!translatedObject) {
      return `[Missing Key: ${key}]`
    }
    // If the specific language property is missing, fallback to English or the key
    return translatedObject[language] ?? translatedObject.en ?? `[Missing Lang: ${key}.${language}]`
  }

  const weeklyBudget = userData.monthlyBudget / 4
  const { deficiencies } = analysisResult

  const categories = []

  // Protein sources
  const proteinItems = []
  if (deficiencies.includes("protein") || analysisResult.underweight) {
    proteinItems.push(
      { name: t("egg"), quantity: t("10_pieces"), price: 120, nutrients: t("protein_vitaminA") },
      { name: t("small_fish"), quantity: t("1_kg"), price: 300, nutrients: t("protein_calcium") },
      { name: t("chicken_meat"), quantity: t("500_grams"), price: 280, nutrients: t("protein_iron") },
      { name: t("red_lentil"), quantity: t("1_kg"), price: 140, nutrients: t("protein_folate") },
    )
  } else {
    proteinItems.push(
      { name: t("egg"), quantity: t("6_pieces"), price: 72, nutrients: t("protein") },
      { name: t("red_lentil"), quantity: t("500_grams"), price: 70, nutrients: t("protein") },
    )
  }
  categories.push({ name: t("proteins"), items: proteinItems })

  // Vegetables
  const vegetableItems = []
  if (deficiencies.includes("vitaminA")) {
    vegetableItems.push(
      { name: t("carrot"), quantity: t("1_kg"), price: 60, nutrients: t("vitaminA") },
      { name: t("spinach"), quantity: t("500_grams"), price: 30, nutrients: t("vitaminA_iron") },
      { name: t("sweet_potato"), quantity: t("1_kg"), price: 50, nutrients: t("vitaminA") },
    )
  }

  if (deficiencies.includes("vitaminC")) {
    vegetableItems.push(
      { name: t("tomato"), quantity: t("500_grams"), price: 40, nutrients: t("vitaminC") },
      { name: t("lemon"), quantity: t("10_pieces"), price: 50, nutrients: t("vitaminC") },
    )
  }

  vegetableItems.push(
    { name: t("potato"), quantity: t("2_kg"), price: 60, nutrients: t("carbohydrates") },
    { name: t("onion"), quantity: t("1_kg"), price: 80, nutrients: t("fiber") },
  )
  categories.push({ name: t("vegetables"), items: vegetableItems })

  // Fruits
  const fruitItems = []
  if (deficiencies.includes("vitaminC")) {
    fruitItems.push(
      { name: t("guava"), quantity: t("1_kg"), price: 80, nutrients: t("vitaminC") },
      { name: t("orange"), quantity: t("1_kg"), price: 120, nutrients: t("vitaminC") },
    )
  }

  fruitItems.push(
    { name: t("banana"), quantity: t("1_dozen"), price: 60, nutrients: t("potassium_fiber") },
    { name: t("mango_seasonal"), quantity: t("1_kg"), price: 100, nutrients: t("vitaminA_C") },
  )
  categories.push({ name: t("fruits"), items: fruitItems })

  // Dairy
  const dairyItems = []
  if (deficiencies.includes("calcium")) {
    dairyItems.push(
      { name: t("milk"), quantity: t("1_liter_daily"), price: 420, nutrients: t("calcium_protein") },
      { name: t("yogurt"), quantity: t("500_grams"), price: 80, nutrients: t("calcium_probiotic") },
    )
  } else {
    dairyItems.push({ name: t("milk"), quantity: t("500_ml_daily"), price: 210, nutrients: t("calcium") })
  }
  categories.push({ name: t("dairy"), items: dairyItems })

  // Grains
  const grainItems = [
    { name: t("rice"), quantity: t("5_kg"), price: 300, nutrients: t("carbohydrates") },
    { name: t("flour"), quantity: t("2_kg"), price: 120, nutrients: t("carbohydrates_fiber") },
  ]
  categories.push({ name: t("grains"), items: grainItems })

  // Cooking essentials
  const essentialItems = [
    { name: t("mustard_oil"), quantity: t("1_liter"), price: 180, nutrients: t("healthy_fats") },
    { name: t("salt"), quantity: t("1_kg"), price: 25, nutrients: t("sodium") },
    { name: t("turmeric_powder"), quantity: t("200_grams"), price: 60, nutrients: t("antioxidants") },
  ]
  categories.push({ name: t("cooking_essentials"), items: essentialItems })

  // Calculate total cost and adjust if over budget
  const totalCost = categories.reduce(
    (total, category) => total + category.items.reduce((catTotal, item) => catTotal + item.price, 0),
    0,
  )

  // If over budget, prioritize essential items
  if (totalCost > weeklyBudget) {
    // Remove expensive items and suggest alternatives
    categories.forEach((category) => {
      category.items = category.items.filter((item) => {
        if (item.price > weeklyBudget * 0.2) {
          // Remove items over 20% of budget
          return false
        }
        return true
      })
    })

    // Add budget-friendly alternatives
    if (deficiencies.includes("protein")) {
      categories[0].items.push({ name: t("chickpea"), quantity: t("1_kg"), price: 80, nutrients: t("protein_fiber") })
    }
  }

  return { categories }
}
