
import { NutritionInfo } from "@/components/nutrition-display";
import { findSimilarFood } from "./food-database";

// This is a simplified model that will always return one of our predefined foods
// In a real application, this would be replaced with the actual model integration
export async function simpleFoodRecognizer(imageData: string): Promise<NutritionInfo> {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Simple deterministic "recognition" based on image data
      // In a real implementation, this would use the actual model
      
      // Use the hash of the image data to select a food (purely for demonstration)
      const hash = simpleHash(imageData);
      const foods = [
        "apple", "banana", "pizza", "salad", "burger", 
        "rice", "pasta", "broccoli", "chicken", "salmon"
      ];
      
      // Use the hash to select a food
      const selectedFood = foods[hash % foods.length];
      
      // Get nutrition data
      const nutritionInfo = findSimilarFood(selectedFood);
      
      // Add some randomness to confidence for demo purposes
      const confidence = 0.7 + (Math.random() * 0.25);
      
      resolve({
        ...nutritionInfo,
        confidence,
      });
    }, 2000); // 2 second delay to simulate processing
  });
}

// A simple string hashing function for demo purposes
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < Math.min(str.length, 500); i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
