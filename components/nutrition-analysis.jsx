"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Brain } from 'lucide-react'
import { translations } from "@/lib/translations"

export function NutritionAnalysis({ isAnalyzing, userData, foodEntries, language }) {
  const t = (key) => translations[key][language]

  if (!isAnalyzing) return null

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-emerald-600" />
        </div>
        <CardTitle>{t("analyzingNutritionTitle")}</CardTitle>
        <CardDescription>{t("analyzingNutritionDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-lg font-medium">{t("processing")}...</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("convertingPortions")}</span>
              <span>100%</span>
            </div>
            <Progress value={100} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("calculatingNutritionalValues")}</span>
              <span>85%</span>
            </div>
            <Progress value={85} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("assessingMalnutritionRisk")}</span>
              <span>60%</span>
            </div>
            <Progress value={60} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("generatingRecommendations")}</span>
              <span>30%</span>
            </div>
            <Progress value={30} />
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">{t("analysisSummary")}</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• {t("processingFoodItems").replace("{count}", foodEntries.length)}</li>
            <li>
              •{" "}
              {t("analyzingFor")
                .replace("{age}", userData?.age)
                .replace("{gender}", userData?.gender === "male" ? t("male") : t("female"))}
            </li>
            <li>
              • {t("activityLevel")}:{" "}
              {userData?.activityLevel === "low"
                ? t("activityLow")
                : userData?.activityLevel === "moderate"
                  ? t("activityModerate")
                  : t("activityHigh")}
            </li>
            <li>
              • {t("budget")}: ৳{userData?.monthlyBudget}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
