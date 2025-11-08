import type { NutritionInfo } from "@/components/nutrition-display";

// Updated database to match Food101 classes more accurately
const foodDatabase: Record<string, NutritionInfo> = {
  "apple_pie": {
    foodName: "Apple Pie",
    calories: 237,
    proteins: 2.4,
    carbs: 34,
    fats: 11,
    vitamins: [
      { name: "Vitamin A", amount: "1% DV" },
      { name: "Vitamin C", amount: "2% DV" }
    ],
    confidence: 0.93
  },
  "pizza": {
    foodName: "Pizza",
    calories: 266,
    proteins: 11,
    carbs: 33,
    fats: 10,
    vitamins: [
      { name: "Vitamin A", amount: "5% DV" },
      { name: "Vitamin C", amount: "2% DV" }
    ],
    minerals: [
      { name: "Calcium", amount: "20% DV" },
      { name: "Iron", amount: "10% DV" }
    ],
    confidence: 0.89
  },
  "sushi": {
    foodName: "Sushi",
    calories: 200,
    proteins: 7,
    carbs: 38,
    fats: 1,
    vitamins: [
      { name: "Vitamin B12", amount: "12% DV" },
      { name: "Vitamin D", amount: "15% DV" }
    ],
    minerals: [
      { name: "Selenium", amount: "10% DV" },
      { name: "Iodine", amount: "12% DV" }
    ],
    confidence: 0.92
  },
  "ramen": {
    foodName: "Ramen",
    calories: 380,
    proteins: 14,
    carbs: 56,
    fats: 7,
    vitamins: [
      { name: "Vitamin B1", amount: "15% DV" },
      { name: "Vitamin B3", amount: "20% DV" }
    ],
    minerals: [
      { name: "Iron", amount: "8% DV" },
      { name: "Zinc", amount: "6% DV" }
    ],
    confidence: 0.88
  },
  "steak": {
    foodName: "Steak",
    calories: 271,
    proteins: 29,
    carbs: 0,
    fats: 17,
    vitamins: [
      { name: "Vitamin B12", amount: "50% DV" },
      { name: "Vitamin B6", amount: "25% DV" }
    ],
    minerals: [
      { name: "Iron", amount: "15% DV" },
      { name: "Zinc", amount: "30% DV" }
    ],
    confidence: 0.91
  }
};

export function getFoodNutrition(foodName: string): NutritionInfo | null {
  const normalizedName = foodName.toLowerCase();
  return foodDatabase[normalizedName] || null;
}

// Returns possible matches if exact match not found
export function findSimilarFood(foodName: string): NutritionInfo | null {
  const normalizedName = foodName.toLowerCase();
  
  // Try exact match first
  if (foodDatabase[normalizedName]) {
    return foodDatabase[normalizedName];
  }
  
  // Try partial match
  for (const key of Object.keys(foodDatabase)) {
    if (key.includes(normalizedName) || normalizedName.includes(key)) {
      return {
        ...foodDatabase[key],
        confidence: foodDatabase[key].confidence * 0.9 // Reduce confidence for partial match
      };
    }
  }
  
  // Default to returning something if no match found
  // In a real application, you'd return null or handle this differently
  const randomIndex = Math.floor(Math.random() * Object.keys(foodDatabase).length);
  const randomFood = Object.keys(foodDatabase)[randomIndex];
  return {
    ...foodDatabase[randomFood],
    confidence: 0.6 // Low confidence for fallback
  };
}
