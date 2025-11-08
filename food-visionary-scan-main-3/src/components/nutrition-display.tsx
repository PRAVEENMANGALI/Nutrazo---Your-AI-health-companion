
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface NutritionInfo {
  foodName: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  vitamins?: { name: string; amount: string }[];
  minerals?: { name: string; amount: string }[];
  confidence: number;
}

interface NutritionDisplayProps {
  nutritionInfo: NutritionInfo | null;
  isLoading: boolean;
}

export function NutritionDisplay({ nutritionInfo, isLoading }: NutritionDisplayProps) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-4">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nutritionInfo) {
    return null;
  }

  const { foodName, calories, proteins, carbs, fats, vitamins, minerals, confidence } = nutritionInfo;
  
  // Calculate macronutrient percentages
  const totalMacros = proteins + carbs + fats;
  const proteinPercentage = Math.round((proteins / totalMacros) * 100);
  const carbPercentage = Math.round((carbs / totalMacros) * 100);
  const fatPercentage = Math.round((fats / totalMacros) * 100);

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{foodName}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {Math.round(confidence * 100)}% confidence
          </Badge>
        </div>
        <CardDescription>{calories} calories per serving</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Proteins</span>
            <span className="text-sm font-medium">{proteins}g</span>
          </div>
          <Progress value={proteinPercentage} className="h-2 bg-scanify-100" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Carbs</span>
            <span className="text-sm font-medium">{carbs}g</span>
          </div>
          <Progress value={carbPercentage} className="h-2 bg-scanify-100" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Fats</span>
            <span className="text-sm font-medium">{fats}g</span>
          </div>
          <Progress value={fatPercentage} className="h-2 bg-scanify-100" />
        </div>

        {vitamins && vitamins.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Vitamins</h4>
            <div className="grid grid-cols-2 gap-2">
              {vitamins.map((vitamin, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{vitamin.name}</span>
                  <span className="text-muted-foreground">{vitamin.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {minerals && minerals.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Minerals</h4>
            <div className="grid grid-cols-2 gap-2">
              {minerals.map((mineral, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{mineral.name}</span>
                  <span className="text-muted-foreground">{mineral.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
