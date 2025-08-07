"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, ShoppingCart, TrendingUp, Heart, Activity } from 'lucide-react'
import { generateShoppingList } from "@/lib/shopping-list-generator"
import { translations } from "@/lib/translations"

export function DietRecommendations({ analysisResult, userData, language }) {
  const t = (key) => translations[key][language]

  const [shoppingList, setShoppingList] = useState([])
  const [isGeneratingList, setIsGeneratingList] = useState(false)

  const handleGenerateShoppingList = () => {
    setIsGeneratingList(true)
    setTimeout(() => {
      const list = generateShoppingList(analysisResult, userData, language)
      setShoppingList(list.categories)
      setIsGeneratingList(false)
    }, 2000)
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-100"
      case "moderate":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-orange-600 bg-orange-100"
      case "severe":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getRiskIcon = (risk) => {
    switch (risk) {
      case "low":
        return <CheckCircle className="w-5 h-5" />
      case "moderate":
        return <TrendingUp className="w-5 h-5" />
      case "high":
        return <AlertTriangle className="w-5 h-5" />
      case "severe":
        return <AlertTriangle className="w-5 h-5" />
      default:
        return null
    }
  }

  const getRiskText = (risk) => {
    switch (risk) {
      case "low":
        return t("riskLow")
      case "moderate":
        return t("riskModerate")
      case "high":
        return t("riskHigh")
      case "severe":
        return t("riskSevere")
      default:
        return t("unknown")
    }
  }

  const nutrientNames = {
    calories: t("calories"),
    protein: t("protein"),
    carbs: t("carbohydrates"),
    fat: t("fat"),
    fiber: t("fiber"),
    calcium: t("calcium"),
    iron: t("iron"),
    vitaminA: t("vitaminA"),
    vitaminC: t("vitaminC"),
    vitaminD: t("vitaminD"),
    zinc: t("zinc"),
    folate: t("folate"),
  }

  return (
    <div className="space-y-6">
      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getRiskIcon(analysisResult.malnutritionRisk)}
            <span>{t("malnutritionRiskAssessment")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Badge className={getRiskColor(analysisResult.malnutritionRisk)}>
                {getRiskText(analysisResult.malnutritionRisk)}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                {t("riskScore")}: {analysisResult.riskScore}/100
              </p>
              <Progress value={analysisResult.riskScore} className="w-full mt-2" />
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">BMI: </span>
                {analysisResult.bmi.toFixed(1)}
              </div>
              <div className="text-sm">
                <span className="font-medium">{t("heightForAge")}: </span>
                {analysisResult.zScores.heightForAge.toFixed(1)} (Z-score)
              </div>
              <div className="text-sm">
                <span className="font-medium">{t("weightForAge")}: </span>
                {analysisResult.zScores.weightForAge.toFixed(1)} (Z-score)
              </div>
            </div>
          </div>

          {/* Growth Status */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-3 rounded-lg ${analysisResult.stunting ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}
            >
              <div className="flex items-center space-x-2">
                <Activity className={`w-4 h-4 ${analysisResult.stunting ? "text-red-600" : "text-green-600"}`} />
                <span className="text-sm font-medium">{t("stunting")}</span>
              </div>
              <p className="text-xs mt-1">{analysisResult.stunting ? t("yes") : t("no")}</p>
            </div>

            <div
              className={`p-3 rounded-lg ${analysisResult.wasting ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className={`w-4 h-4 ${analysisResult.wasting ? "text-red-600" : "text-green-600"}`} />
                <span className="text-sm font-medium">{t("wasting")}</span>
              </div>
              <p className="text-xs mt-1">{analysisResult.wasting ? t("yes") : t("no")}</p>
            </div>

            <div
              className={`p-3 rounded-lg ${analysisResult.underweight ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}
            >
              <div className="flex items-center space-x-2">
                <Heart className={`w-4 h-4 ${analysisResult.underweight ? "text-red-600" : "text-green-600"}`} />
                <span className="text-sm font-medium">{t("underweight")}</span>
              </div>
              <p className="text-xs mt-1">{analysisResult.underweight ? t("yes") : t("no")}</p>
            </div>
          </div>

          {analysisResult.deficiencies.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">{t("nutritionalDeficiencies")}:</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.deficiencies.map((deficiency, index) => (
                  <Badge key={index} variant="outline" className="text-red-600 border-red-200">
                    {nutrientNames[deficiency] || deficiency}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="nutrition" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="nutrition">{t("nutritionBreakdown")}</TabsTrigger>
          <TabsTrigger value="recommendations">{t("recommendations")}</TabsTrigger>
          <TabsTrigger value="shopping">{t("shoppingList")}</TabsTrigger>
        </TabsList>

        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("dailyNutritionalIntake")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(analysisResult.currentIntake).map(([nutrient, value]) => {
                const required = analysisResult.dailyNeeds[nutrient]
                const percentage = required > 0 ? Math.min((value / required) * 100, 100) : 0
                const isDeficient = percentage < 80

                return (
                  <div key={nutrient} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{nutrientNames[nutrient] || nutrient}</span>
                      <span className={`text-sm ${isDeficient ? "text-red-600" : "text-green-600"}`}>
                        {typeof value === "number" ? value.toFixed(1) : value} /{" "}
                        {typeof required === "number" ? required.toFixed(1) : required}
                        {nutrient === "calories"
                          ? ` ${t("kcal")}`
                          : ["protein", "carbs", "fat", "fiber"].includes(nutrient)
                            ? ` ${t("grams")}`
                            : ` ${t("milligrams")}`}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className={`h-2 ${isDeficient ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`}
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>{t("personalizedRecommendations")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shopping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                <span>{t("budgetOptimizedShoppingList")}</span>
              </CardTitle>
              <CardDescription>{t("basedOnBudget").replace("{budget}", userData.monthlyBudget)}</CardDescription>
            </CardHeader>
            <CardContent>
              {shoppingList.length === 0 ? (
                <div className="text-center py-8">
                  <Button onClick={handleGenerateShoppingList} disabled={isGeneratingList} size="lg">
                    {isGeneratingList ? t("generatingList") : t("generateShoppingList")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {shoppingList.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium text-lg">{category.name}</h4>
                      <div className="grid gap-2">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm text-gray-600 ml-2">({item.quantity})</span>
                            </div>
                            <span className="font-medium">৳{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>{t("totalEstimatedCost")}:</span>
                      <span>
                        ৳
                        {shoppingList
                          .reduce(
                            (total, category) =>
                              total + category.items.reduce((catTotal, item) => catTotal + item.price, 0),
                            0,
                          )
                          .toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
