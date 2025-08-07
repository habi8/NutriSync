"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { translations } from "@/lib/translations"

const healthConditions = [
  { en: "Diabetes", bn: "ডায়াবেটিস" },
  { en: "Hypertension", bn: "উচ্চ রক্তচাপ" },
  { en: "Heart Disease", bn: "হৃদরোগ" },
  { en: "Kidney Disease", bn: "কিডনি রোগ" },
  { en: "Liver Disease", bn: "লিভার রোগ" },
  { en: "Anemia", bn: "রক্তশূন্যতা" },
  { en: "Osteoporosis", bn: "হাড়ক্ষয়" },
  { en: "Food Allergies", bn: "খাদ্য এলার্জি" },
]

const divisions = [
  { en: "Dhaka", bn: "ঢাকা" },
  { en: "Chattogram", bn: "চট্টগ্রাম" },
  { en: "Rajshahi", bn: "রাজশাহী" },
  { en: "Khulna", bn: "খুলনা" },
  { en: "Barishal", bn: "বরিশাল" },
  { en: "Sylhet", bn: "সিলেট" },
  { en: "Rangpur", bn: "রংপুর" },
  { en: "Mymensingh", bn: "ময়মনসিংহ" },
]

const districtsByDivision = {
  Dhaka: [
    { en: "Dhaka", bn: "ঢাকা" },
    { en: "Faridpur", bn: "ফরিদপুর" },
    { en: "Gazipur", bn: "গাজীপুর" },
    { en: "Gopalganj", bn: "গোপালগঞ্জ" },
    { en: "Kishoreganj", bn: "কিশোরগঞ্জ" },
    { en: "Madaripur", bn: "মাদারীপুর" },
    { en: "Manikganj", bn: "মানিকগঞ্জ" },
    { en: "Munshiganj", bn: "মুন্সিগঞ্জ" },
    { en: "Narayanganj", bn: "নারায়ণগঞ্জ" },
    { en: "Narsingdi", bn: "নরসিংদী" },
    { en: "Rajbari", bn: "রাজবাড়ী" },
    { en: "Shariatpur", bn: "শরীয়তপুর" },
    { en: "Tangail", bn: "টাঙ্গাইল" },
  ],
  Chattogram: [
    { en: "Chattogram", bn: "চট্টগ্রাম" },
    { en: "Bandarban", bn: "বান্দরবান" },
    { en: "Brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া" },
    { en: "Chandpur", bn: "চাঁদপুর" },
    { en: "Cox's Bazar", bn: "কক্সবাজার" },
    { en: "Cumilla", bn: "কুমিল্লা" },
    { en: "Feni", bn: "ফেনী" },
    { en: "Khagrachhari", bn: "খাগড়াছড়ি" },
    { en: "Lakshmipur", bn: "লক্ষ্মীপুর" },
    { en: "Noakhali", bn: "নোয়াখালী" },
    { en: "Rangamati", bn: "রাঙ্গামাটি" },
  ],
  Rajshahi: [
    { en: "Rajshahi", bn: "রাজশাহী" },
    { en: "Bogura", bn: "বগুড়া" },
    { en: "Joypurhat", bn: "জয়পুরহাট" },
    { en: "Naogaon", bn: "নওগাঁ" },
    { en: "Natore", bn: "নাটোর" },
    { en: "Nawabganj", bn: "নবাবগঞ্জ" },
    { en: "Pabna", bn: "পাবনা" },
    { en: "Sirajganj", bn: "সিরাজগঞ্জ" },
  ],
  Khulna: [
    { en: "Khulna", bn: "খুলনা" },
    { en: "Bagerhat", bn: "বাগেরহাট" },
    { en: "Chuadanga", bn: "চুয়াডাঙ্গা" },
    { en: "Jashore", bn: "যশোর" },
    { en: "Jhenaidah", bn: "ঝিনাইদহ" },
    { en: "Kushtia", bn: "কুষ্টিয়া" },
    { en: "Magura", bn: "মাগুরা" },
    { en: "Meherpur", bn: "মেহেরপুর" },
    { en: "Narail", bn: "নড়াইল" },
    { en: "Satkhira", bn: "সাতক্ষীরা" },
  ],
  Barishal: [
    { en: "Barishal", bn: "বরিশাল" },
    { en: "Bhola", bn: "ভোলা" },
    { en: "Jhalokati", bn: "ঝালকাঠি" },
    { en: "Patuakhali", bn: "পটুয়াখালী" },
    { en: "Pirojpur", bn: "পিরোজপুর" },
    { en: "Barguna", bn: "বরগুনা" },
  ],
  Sylhet: [
    { en: "Sylhet", bn: "সিলেট" },
    { en: "Habiganj", bn: "হবিগঞ্জ" },
    { en: "Moulvibazar", bn: "মৌলভীবাজার" },
    { en: "Sunamganj", bn: "সুনামগঞ্জ" },
  ],
  Rangpur: [
    { en: "Rangpur", bn: "রংপুর" },
    { en: "Dinajpur", bn: "দিনাজপুর" },
    { en: "Gaibandha", bn: "গাইবান্ধা" },
    { en: "Kurigram", bn: "কুড়িগ্রাম" },
    { en: "Lalmonirhat", bn: "লালমনিরহাট" },
    { en: "Nilphamari", bn: "নীলফামারী" },
    { en: "Panchagarh", bn: "পঞ্চগড়" },
    { en: "Thakurgaon", bn: "ঠাকুরগাঁও" },
  ],
  Mymensingh: [
    { en: "Mymensingh", bn: "ময়মনসিংহ" },
    { en: "Jamalpur", bn: "জামালপুর" },
    { en: "Netrokona", bn: "নেত্রকোনা" },
    { en: "Sherpur", bn: "শেরপুর" },
  ],
}

export function UserProfile({ onSubmit, language }) {
  const t = (key) => translations[key][language]

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    activityLevel: "",
    division: "",
    district: "",
    monthlyBudget: "",
    healthConditions: [],
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const userData = {
      age: Number.parseInt(formData.age),
      gender: formData.gender,
      weight: Number.parseFloat(formData.weight),
      height: Number.parseFloat(formData.height),
      activityLevel: formData.activityLevel,
      division: formData.division,
      district: formData.district,
      monthlyBudget: Number.parseFloat(formData.monthlyBudget),
      healthConditions: formData.healthConditions,
    }

    onSubmit(userData)
  }

  const handleHealthConditionChange = (condition, checked) => {
    setFormData((prev) => ({
      ...prev,
      healthConditions: checked
        ? [...prev.healthConditions, condition]
        : prev.healthConditions.filter((c) => c !== condition),
    }))
  }

  const handleDivisionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      division: value,
      district: "", // Reset district when division changes
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("personalInfoTitle")}</CardTitle>
        <CardDescription>{t("personalInfoDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">{t("age")}</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                required
                min="1"
                max="18"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">{t("gender")}</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectGender")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("male")}</SelectItem>
                  <SelectItem value="female">{t("female")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">{t("weightKg")}</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                required
                min="5"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">{t("heightCm")}</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                required
                min="50"
                max="200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">{t("activityLevel")}</Label>
              <Select
                value={formData.activityLevel}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, activityLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectActivityLevel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("activityLow")}</SelectItem>
                  <SelectItem value="moderate">{t("activityModerate")}</SelectItem>
                  <SelectItem value="high">{t("activityHigh")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="division">{t("division")}</Label>
              <Select value={formData.division} onValueChange={handleDivisionChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectDivision")} />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((division) => (
                    <SelectItem key={division.en} value={division.en}>
                      {division[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">{t("district")}</Label>
              <Select
                value={formData.district}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, district: value }))}
                disabled={!formData.division} // Disable until a division is selected
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectDistrict")} />
                </SelectTrigger>
                <SelectContent>
                  {formData.division &&
                    districtsByDivision[formData.division]?.map((district) => (
                      <SelectItem key={district.en} value={district.en}>
                        {district[language]}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">{t("monthlyFoodBudget")}</Label>
              <Input
                id="budget"
                type="number"
                value={formData.monthlyBudget}
                onChange={(e) => setFormData((prev) => ({ ...prev, monthlyBudget: e.target.value }))}
                required
                min="2000"
                max="50000"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t("healthConditions")}</Label>
            <div className="grid grid-cols-2 gap-3">
              {healthConditions.map((condition) => (
                <div key={condition.en} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition.en}
                    checked={formData.healthConditions.includes(condition.en)}
                    onCheckedChange={(checked) => handleHealthConditionChange(condition.en, checked)}
                  />
                  <Label htmlFor={condition.en} className="text-sm font-normal">
                    {condition[language]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            {t("continueToFoodLogging")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
