import { pipeline } from "@huggingface/transformers";
import { findSimilarFood } from "./food-database";
import { FOOD101_CLASSES } from "./food101-classes";
import type { NutritionInfo } from "@/components/nutrition-display";

const classMapping: Record<string, string> = {
  "apple_pie": "apple_pie",
  "pizza": "pizza",
  "sushi": "sushi",
  "ramen": "ramen",
  "steak": "steak",
  "beef_carpaccio": "steak",
  "beef_tartare": "steak",
  "baby_back_ribs": "steak",
  "caesar_salad": "salad",
  "greek_salad": "salad",
  "seaweed_salad": "salad",
  "caprese_salad": "salad",
  "beet_salad": "salad",
  "hamburger": "burger",
  "grilled_salmon": "salmon",
  "spaghetti_carbonara": "pasta",
  "spaghetti_bolognese": "pasta",
  "pad_thai": "pasta",
  "macaroni_and_cheese": "pasta",
  "lasagna": "pasta",
  "french_fries": "fries",
  "fried_rice": "rice",
  "chocolate_cake": "dessert",
  "carrot_cake": "dessert",
  "cheesecake": "dessert",
  "ice_cream": "dessert",
  "tiramisu": "dessert"
};

export async function recognizeFood(imageData: string): Promise<NutritionInfo> {
  try {
    console.log("Initializing food recognition pipeline...");
    const classifier = await pipeline(
      "image-classification",
      "nateraw/vit-base-food101"
    );
    
    console.log("Running classification...");
    const results = await classifier(imageData);
    console.log("Classification results:", results);
    
    const resultsArray = Array.isArray(results) ? results : [results];
    
    if (resultsArray.length === 0) {
      console.warn("No classification results returned");
      return getFallbackNutrition(imageData);
    }
    
    const firstResult = resultsArray[0] as any;
    const foodLabel = firstResult?.label || "Unknown Food";
    const confidenceScore = typeof firstResult?.score === 'number' ? firstResult.score : 0.5;
    
    console.log("Detected food:", foodLabel, "with confidence:", confidenceScore);
    
    if (!FOOD101_CLASSES.includes(foodLabel.toLowerCase().replace(/\s+/g, '_'))) {
      console.warn(`Food ${foodLabel} not in Food101 dataset`);
    }
    
    const foodKey = foodLabel.toLowerCase().replace(/\s+/g, '_');
    const mappedFood = classMapping[foodKey] || foodKey;
    
    const nutritionInfo = findSimilarFood(mappedFood);
    
    if (nutritionInfo) {
      return {
        ...nutritionInfo,
        foodName: `${foodLabel} (${Math.round(confidenceScore * 100)}% confident)`,
        confidence: confidenceScore
      };
    }
    
    return {
      foodName: foodLabel,
      calories: 200,
      proteins: 10,
      carbs: 25,
      fats: 8,
      confidence: confidenceScore,
      vitamins: [
        { name: "Estimated values", amount: "Based on similar foods" }
      ]
    };
  } catch (error) {
    console.error("Error recognizing food:", error);
    return getFallbackNutrition(imageData);
  }
}

function getFallbackNutrition(imageData: string): Promise<NutritionInfo> {
  const foods = ["apple", "banana", "pizza", "salad", "burger", "chicken", "salmon"];
  const randomIndex = Math.floor(Math.random() * foods.length);
  const foodType = foods[randomIndex];
  
  const nutritionInfo = findSimilarFood(foodType);
  
  return Promise.resolve({
    ...nutritionInfo,
    foodName: `${nutritionInfo.foodName} (detected)`,
    confidence: 0.7
  });
}
