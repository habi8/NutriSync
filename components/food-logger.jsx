"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from 'lucide-react'
import { bangladeshiFoods } from "@/lib/food-database"
import { calculatePortionGrams } from "@/lib/portion-calculator"
import { translations } from "@/lib/translations"

const portionSizes = [
  { value: "half-plate", en: "Half Plate", bn: "অর্ধেক প্লেট" },
  { value: "full-plate", en: "Full Plate", bn: "পূর্ণ প্লেট" },
  { value: "small-bowl", en: "Small Bowl", bn: "ছোট বাটি" },
  { value: "large-bowl", en: "Large Bowl", bn: "বড় বাটি" },
  { value: "tablespoon", en: "Tablespoon", bn: "টেবিল চামচ" },
  { value: "teaspoon", en: "Teaspoon", bn: "চা চামচ" },
  { value: "cup", en: "Cup", bn: "কাপ" },
  { value: "half-cup", en: "Half Cup", bn: "অর্ধেক কাপ" },
  { value: "small-piece", en: "Small Piece", bn: "ছোট টুকরা" },
  { value: "medium-piece", en: "Medium Piece", bn: "মাঝারি টুকরা" },
  { value: "large-piece", en: "Large Piece", bn: "বড় টুকরা" },
  { value: "slice", en: "Slice", bn: "স্লাইস" },
  { value: "scoop", en: "Scoop", bn: "স্কুপ" },
]

export function FoodLogger({ onEntriesUpdate, entries, language }) {
  const t = (key) => translations[key][language]

  const [selectedFood, setSelectedFood] = useState("")
  const [selectedPortion, setSelectedPortion] = useState("")
  const [portionCount, setPortionCount] = useState("1")

  const addFoodEntry = () => {
    if (!selectedFood || !selectedPortion) return

    const food = bangladeshiFoods.find((f) => f.id === selectedFood)
    if (!food) return

    const count = Number.parseFloat(portionCount) || 1
    const estimatedGrams = calculatePortionGrams(food, selectedPortion, count)

    const newEntry = {
      id: Date.now().toString(),
      name: food.name[language], // Use translated food name
      portion: `${count} ${portionSizes.find((p) => p.value === selectedPortion)?.[language]}`,
      portionSize: selectedPortion,
      estimatedGrams,
      timestamp: new Date(),
    }

    const updatedEntries = [...entries, newEntry]
    onEntriesUpdate(updatedEntries)

    // Reset form
    setSelectedFood("")
    setSelectedPortion("")
    setPortionCount("1")
  }

  const removeEntry = (id) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    onEntriesUpdate(updatedEntries)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("logFoodTitle")}</CardTitle>
          <CardDescription>{t("logFoodDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="food-name">{t("foodName")}</Label>
              <Select value={selectedFood} onValueChange={setSelectedFood}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectFood")} />
                </SelectTrigger>
                <SelectContent>
                  {bangladeshiFoods.map((food) => (
                    <SelectItem key={food.id} value={food.id}>
                      {food.name[language]} ({food.category[language]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("portionSize")}</Label>
                <Select value={selectedPortion} onValueChange={setSelectedPortion}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectPortionSize")} />
                  </SelectTrigger>
                  <SelectContent>
                    {portionSizes.map((portion) => (
                      <SelectItem key={portion.value} value={portion.value}>
                        {portion[language]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portion-count">{t("quantity")}</Label>
                <Input
                  id="portion-count"
                  type="number"
                  step="0.5"
                  min="0.1"
                  max="10"
                  value={portionCount}
                  onChange={(e) => setPortionCount(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={addFoodEntry} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {t("addFoodItem")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("todaysFoodLog")}</CardTitle>
            <CardDescription>
              {entries.length} {t("itemsLogged")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{entry.name}</div>
                    <div className="text-sm text-gray-500">
                      {entry.portion} • ~{entry.estimatedGrams}
                      {t("grams")}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">
                {t("totalEstimatedWeight")}: {entries.reduce((sum, entry) => sum + entry.estimatedGrams, 0).toFixed(0)}
                {t("grams")}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
