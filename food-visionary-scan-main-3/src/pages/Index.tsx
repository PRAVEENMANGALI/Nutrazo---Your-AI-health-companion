
import { useState } from "react";
import { CameraCapture } from "@/components/camera-capture";
import { NutritionDisplay, type NutritionInfo } from "@/components/nutrition-display";
import { recognizeFood } from "@/lib/food-recognizer";
import { simpleFoodRecognizer } from "@/lib/simple-model";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Info, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showScanner, setShowScanner] = useState(true);
  const { toast } = useToast();

  const handleImageCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setIsAnalyzing(true);
    
    try {
      // First try the advanced model
      let result;
      try {
        console.log("Attempting to recognize food with Hugging Face model...");
        // Try using the Hugging Face model first
        result = await recognizeFood(imageData);
        console.log("Recognition result:", result);
      } catch (error) {
        console.warn("Advanced food recognition failed, falling back to simple model:", error);
        toast({
          title: "Using basic recognition",
          description: "Advanced food recognition unavailable. Using simplified detection.",
          variant: "default",
        });
        // Fall back to the simple model if the advanced one fails
        result = await simpleFoodRecognizer(imageData);
      }
      
      // Make sure we have a valid result
      if (!result || !result.foodName || result.foodName === "Unknown Food") {
        console.warn("Got unknown food result, trying simple model as backup");
        result = await simpleFoodRecognizer(imageData);
      }
      
      setNutritionInfo(result);
    } catch (error) {
      console.error("Error analyzing food:", error);
      toast({
        title: "Recognition failed",
        description: "Could not analyze your food image. Please try again.",
        variant: "destructive",
      });
      // Handle error state
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
    setNutritionInfo(null);
    setShowScanner(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-scanify-50 px-4 py-6">
      {/* Header */}
      <div className="container mx-auto max-w-md text-center mb-6">
        <h1 className="text-3xl font-bold text-scanify-800">Scanify Food Mentor</h1>
        <p className="text-scanify-600 mt-1">Scan, analyze, and understand your food</p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-md">
        {!nutritionInfo ? (
          <>
            {showScanner && <CameraCapture onImageCapture={handleImageCapture} />}
            
            {isAnalyzing && (
              <Card className="mt-4">
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="rounded-full bg-scanify-200 h-16 w-16 flex items-center justify-center mb-3">
                      <Info className="h-8 w-8 text-scanify-600" />
                    </div>
                    <p className="text-lg font-medium">Analyzing your food...</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Identifying ingredients and nutrients
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            <div className="mb-4">
              <Button 
                onClick={resetScan} 
                variant="outline" 
                className="w-full bg-white border-scanify-300 hover:bg-scanify-50 text-scanify-800"
              >
                <Camera className="mr-2 h-5 w-5" />
                Scan New Food
              </Button>
            </div>
            <NutritionDisplay nutritionInfo={nutritionInfo} isLoading={isAnalyzing} />
          </>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-scanify-100 p-4">
        <div className="container mx-auto max-w-md flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center" onClick={resetScan}>
            <Camera className="mb-1 h-5 w-5 text-scanify-600" />
            <span className="text-xs">Scanner</span>
          </Button>
          
          <Button variant="ghost" className="flex flex-col items-center" disabled>
            <History className="mb-1 h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">History</span>
          </Button>
          
          <Button variant="ghost" className="flex flex-col items-center" disabled>
            <Info className="mb-1 h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Tips</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
