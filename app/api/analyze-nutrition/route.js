import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request) {
  try {
    const { userData, foodEntries } = await request.json()

    const foodList = foodEntries.map((entry) => `${entry.name}: ${entry.estimatedGrams}g`).join("\n")

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a certified nutritionist and health expert. Analyze food intake and assess malnutrition risk.
      
      Calculate nutritional values and provide a comprehensive assessment including:
      1. Total calories, protein, carbs, fat, fiber
      2. Key vitamins and minerals
      3. Malnutrition risk score (0-100)
      4. Specific deficiencies
      5. Personalized recommendations
      
      Consider the user's age, gender, weight, height, activity level, and health conditions.
      
      Return a JSON object with this exact structure:
      {
        "malnutritionRisk": "low|moderate|high",
        "riskScore": number,
        "deficiencies": ["deficiency1", "deficiency2"],
        "recommendations": ["recommendation1", "recommendation2"],
        "dailyNeeds": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "fiber": number,
          "vitamins": {"vitaminA": number, "vitaminC": number, "vitaminD": number},
          "minerals": {"iron": number, "calcium": number, "zinc": number}
        },
        "currentIntake": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "fiber": number,
          "vitamins": {"vitaminA": number, "vitaminC": number, "vitaminD": number},
          "minerals": {"iron": number, "calcium": number, "zinc": number}
        }
      }`,
      prompt: `Analyze this person's nutrition:

      User Profile:
      - Age: ${userData.age}
      - Gender: ${userData.gender}
      - Weight: ${userData.weight}kg
      - Height: ${userData.height}cm
      - Activity Level: ${userData.activityLevel}
      - Location: ${userData.location}
      - Health Conditions: ${userData.healthConditions.join(", ") || "None"}

      Food Intake Today:
      ${foodList}

      Provide a comprehensive nutritional analysis and malnutrition risk assessment.`,
    })

    const analysisResult = JSON.parse(text)
    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Nutrition analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze nutrition" }, { status: 500 })
  }
}
