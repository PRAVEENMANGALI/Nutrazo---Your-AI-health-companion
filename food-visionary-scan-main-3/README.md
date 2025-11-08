# Scanify Food Mentor

A web application that scans food images and returns nutritional information.

## Project Overview

Scanify Food Mentor uses computer vision to analyze food images and provide nutritional information. It allows users to:

1. Take pictures of food using their device camera
2. Upload existing food images
3. View detailed nutritional information about the identified food

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- Tailwind CSS
- shadcn-ui
- Hugging Face Transformers for image recognition

## Getting Started

### Installing Dependencies

```sh
# Install all dependencies
npm install
```

### Running the Application

```sh
# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`.

## How to Integrate Your Trained Model

### Option 1: Direct Integration with Hugging Face

1. Upload your trained UECFOOD256 model to Hugging Face Hub
2. Update the model ID in `src/lib/food-recognizer.ts`:

```typescript
const classifier = await pipeline(
  "image-classification",
  "YOUR_USERNAME/YOUR_MODEL_NAME", // Replace with your model's Hugging Face ID
);
```

### Option 2: Custom Model Integration

To integrate your trained UECFOOD256 model:

1. Export your model in ONNX format
2. Place the model in the `public/models` directory
3. Modify the `src/lib/food-recognizer.ts` file to use your local model:

```typescript
// Instead of using a Hugging Face model, load your model locally
const classifier = await pipeline(
  "image-classification",
  { 
    model: "/models/your-model-name.onnx",
    config: {
      // Your model configuration
    } 
  }
);
```

### Option 3: External API Integration

If you have your model deployed as an API:

1. Update the recognition function in `src/lib/food-recognizer.ts` to call your API endpoint

### Mapping Food Classes

To map the output classes from your model to food items in the database, update the `classMapping` object in `src/lib/food-recognizer.ts`:

```typescript
const classMapping: Record<string, string> = {
  "class_1": "apple",
  "class_2": "banana",
  // Add mappings for all your model's classes
};
```

## Adding New Food Items

Add new food items to the database by editing `src/lib/food-database.ts`:

```typescript
foodDatabase["new_food_name"] = {
  foodName: "Display Name",
  calories: 100,
  proteins: 5,
  carbs: 10,
  fats: 2,
  vitamins: [
    { name: "Vitamin A", amount: "10% DV" },
  ],
  minerals: [
    { name: "Iron", amount: "5% DV" },
  ],
  confidence: 0.9
};
```

## Features

- **Camera Integration**: Take photos directly from the device camera
- **Image Upload**: Upload existing food images
- **Food Recognition**: Identify food items from images
- **Nutritional Analysis**: Display detailed nutritional information
- **Visual Feedback**: Clear visual representation of nutritional content
- **Responsive Design**: Works on both desktop and mobile devices

## Known Limitations

- The current implementation uses a general food classification model, which may not match the specificity of your trained UECFOOD256 dataset.
- For optimal results, follow the integration steps to connect your specific trained model.
