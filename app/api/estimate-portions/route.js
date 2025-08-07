import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request) {
  try {
    const { foodName, portionType, portionCount, baseGrams } = await request.json()

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a nutrition expert. Convert food portions to accurate gram measurements. 
      Consider the density, typical serving sizes, and preparation methods of different foods.
      Return only a number representing the estimated grams.`,
      prompt: `Food: ${foodName}
      Portion: ${portionCount} ${portionType}
      Base estimate: ${baseGrams}g
      
      Provide a more accurate gram estimate for this food and portion size. Consider:
      - Food density and composition
      - Typical serving sizes for this food
      - Cooking method (if applicable)
      
      Return only the number of grams as an integer.`,
    })

    const estimatedGrams = Number.parseInt(text.trim()) || baseGrams

    return NextResponse.json({ estimatedGrams })
  } catch (error) {
    console.error("Portion estimation error:", error)
    return NextResponse.json({ error: "Failed to estimate portions" }, { status: 500 })
  }
}
