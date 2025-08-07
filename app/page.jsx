"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/user-profile"
import { FoodLogger } from "@/components/food-logger"
import { NutritionAnalysis } from "@/components/nutrition-analysis"
import { DietRecommendations } from "@/components/diet-recommendations"
import { Progress } from "@/components/ui/progress"
import { User, Utensils, BarChart3, ShoppingCart, RotateCcw } from 'lucide-react'
import { calculateNutritionalValues } from "@/lib/nutrition-calculator"
import { assessMalnutritionRisk } from "@/lib/malnutrition-assessment"
import { calculateDailyNeeds } from "@/lib/daily-requirements"
import { translations } from "@/lib/translations"

export default function BangladeshMalnutritionDetector() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState(null)
  const [foodEntries, setFoodEntries] = useState([])
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [language, setLanguage] = useState("bn") // Default to Bengali

  const t = (key) => translations[key][language]

  const steps = [
    { id: 1, title: t("profileSetup"), icon: User },
    { id: 2, title: t("foodLogging"), icon: Utensils },
    { id: 3, title: t("analysis"), icon: BarChart3 },
    { id: 4, title: t("recommendations"), icon: ShoppingCart },
  ]

  const handleUserDataSubmit = (data) => {
    setUserData(data)
    setCurrentStep(2)
  }

  const handleFoodEntriesUpdate = (entries) => {
    setFoodEntries(entries)
  }

  const handleAnalyze = () => {
    if (!userData || foodEntries.length === 0) return

    setIsAnalyzing(true)
    setCurrentStep(3)

    // Simulate analysis delay
    setTimeout(() => {
      const result = calculateNutritionAnalysis(userData, foodEntries, language)
      setAnalysisResult(result)
      setIsAnalyzing(false)
      setCurrentStep(4)
    }, 3000)
  }

  const handleReset = () => {
    setCurrentStep(1)
    setUserData(null)
    setFoodEntries([])
    setAnalysisResult(null)
    setIsAnalyzing(false)
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "bn" ? "en" : "bn"))
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white/30 backdrop-blur-sm p-6 rounded-lg shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-emerald-600 mb-2">{t("appTitle")}</h1>
            <p className="text-lg text-gray-600">{t("appDescription")}</p>
            <div className="flex justify-center space-x-4 mt-4">
              <Button variant="outline" onClick={toggleLanguage}>
                {language === "bn" ? "English" : "বাংলা"}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("resetApp")}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          isActive
                            ? "bg-emerald-600 text-white"
                            : isCompleted
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isActive ? "text-emerald-600" : isCompleted ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  )
                })}
              </div>
              <Progress value={progress} className="w-full" />
            </CardContent>
          </Card>

          {/* Step Content */}
          {currentStep === 1 && <UserProfile onSubmit={handleUserDataSubmit} language={language} />}

          {currentStep === 2 && userData && (
            <div className="space-y-6">
              <FoodLogger onEntriesUpdate={handleFoodEntriesUpdate} entries={foodEntries} language={language} />
              {foodEntries.length > 0 && (
                <div className="flex justify-center">
                  <Button onClick={handleAnalyze} size="lg" className="px-8">
                    {t("analyzeNutrition")}
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <NutritionAnalysis
              isAnalyzing={isAnalyzing}
              userData={userData}
              foodEntries={foodEntries}
              language={language}
            />
          )}

          {currentStep === 4 && analysisResult && userData && (
            <DietRecommendations analysisResult={analysisResult} userData={userData} language={language} />
          )}

          {/* Navigation */}
          {currentStep > 1 && currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                {t("previousStep")}
              </Button>
              {currentStep === 2 && foodEntries.length > 0 && (
                <Button onClick={handleAnalyze}>{t("analyzeNutrition")}</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Custom algorithm to calculate nutrition analysis
function calculateNutritionAnalysis(userData, foodEntries, language) {
  const currentIntake = calculateNutritionalValues(foodEntries)
  const dailyNeeds = calculateDailyNeeds(userData)
  const assessment = assessMalnutritionRisk(userData, currentIntake, dailyNeeds, language)
  return {
    malnutritionRisk: assessment.malnutritionRisk,
    riskScore: assessment.riskScore,
    stunting: assessment.stunting,
    wasting: assessment.wasting,
    underweight: assessment.underweight,
    deficiencies: assessment.deficiencies,
    recommendations: assessment.recommendations,
    dailyNeeds,
    currentIntake,
    bmi: assessment.bmi,
    zScores: assessment.zScores,
  }
}
