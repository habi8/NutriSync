import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request) {
  try {
    const { analysisResult, userData, budget } = await request.json()

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a nutrition expert and budget-conscious meal planner. Create optimized shopping lists that:
      1. Address specific nutritional deficiencies
      2. Stay within budget constraints
      3. Consider local food availability and prices
      4. Prioritize nutrient-dense, affordable foods
      5. Include variety and practical meal options
      
      Return a JSON object with this structure:
      {
        "items": [
          {
            "category": "Proteins",
            "items": [
              {"name": "Food name", "quantity": "amount", "price": number, "nutrients": "key nutrients provided"}
            ]
          }
        ],
        "totalCost": number,
        "mealSuggestions": ["suggestion1", "suggestion2"]
      }`,
      prompt: `Create a budget-optimized shopping list for:

      User Profile:
      - Location: ${userData.location}
      - Monthly Budget: $${budget}
      - Age: ${userData.age}, Gender: ${userData.gender}
      - Health Conditions: ${userData.healthConditions.join(", ") || "None"}

      Nutritional Analysis:
      - Risk Level: ${analysisResult.malnutritionRisk}
      - Deficiencies: ${analysisResult.deficiencies.join(", ")}
      - Current Intake vs Needs: Calories ${analysisResult.currentIntake.calories}/${analysisResult.dailyNeeds.calories}

      Focus on:
      1. Foods that address the identified deficiencies
      2. Affordable, nutrient-dense options
      3. Local availability in ${userData.location}
      4. Weekly shopping budget of approximately $${(budget / 4).toFixed(0)}

      Prioritize foods that provide the missing nutrients while staying within budget.`,
    })

    const shoppingList = JSON.parse(text)
    return NextResponse.json(shoppingList)
  } catch (error) {
    console.error("Shopping list generation error:", error)
    return NextResponse.json({ error: "Failed to generate shopping list" }, { status: 500 })
  }
}
