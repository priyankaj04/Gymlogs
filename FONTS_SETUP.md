# 📱 Custom Fonts Setup Guide

## 📋 Font Files Needed

Place the following font files in `/assets/fonts/` directory:

### **Poppins (For Headings)**
- `Poppins-Regular.ttf`
- `Poppins-Medium.ttf`
- `Poppins-SemiBold.ttf`
- `Poppins-Bold.ttf`

### **Alan Sans (For General UI)**
- `AlanSans-Regular.ttf`
- `AlanSans-Medium.ttf`
- `AlanSans-SemiBold.ttf`
- `AlanSans-Bold.ttf`

### **Montserrat (For Descriptions)**
- `Montserrat-Regular.ttf`
- `Montserrat-Medium.ttf`
- `Montserrat-SemiBold.ttf`

## 🎯 Font Usage Guide

### **Import Typography in your components:**
```typescript
import { Typography, CustomFonts, Colors } from '@/constants/theme';
```

### **Usage Examples:**

#### **Headings (Poppins)**
```typescript
<Text style={[Typography.h1, { color: Colors.light.text }]}>
  Gym Logs
</Text>

<Text style={[Typography.h3, { color: Colors.light.text }]}>
  Today's Workout
</Text>
```

#### **General UI Text (Alan Sans)**
```typescript
<Text style={[Typography.body, { color: Colors.light.text }]}>
  Start Workout
</Text>

<Text style={[Typography.bodyBold, { color: Colors.light.tint }]}>
  150 lbs
</Text>
```

#### **Descriptions (Montserrat)**
```typescript
<Text style={[Typography.description, { color: Colors.light.text }]}>
  A compound exercise that primarily targets the chest, shoulders, and triceps.
</Text>
```

## 🔧 Available Typography Styles

### **Headings (Poppins)**
- `Typography.h1` - Large titles
- `Typography.h2` - Section headers
- `Typography.h3` - Subsection headers
- `Typography.h4` - Card titles
- `Typography.h5` - Small headings
- `Typography.h6` - Micro headings

### **Body Text (Alan Sans)**
- `Typography.body` - Regular body text
- `Typography.bodyLarge` - Larger body text
- `Typography.bodySmall` - Smaller body text
- `Typography.bodyMedium` - Medium weight
- `Typography.bodySemiBold` - Semi-bold weight
- `Typography.bodyBold` - Bold weight

### **Descriptions (Montserrat)**
- `Typography.description` - Regular descriptions
- `Typography.descriptionLarge` - Larger descriptions
- `Typography.descriptionSmall` - Smaller descriptions
- `Typography.descriptionMedium` - Medium weight
- `Typography.descriptionSemiBold` - Semi-bold weight

### **Special Purpose**
- `Typography.button` - Button text
- `Typography.numbers` - Statistics and numbers
- `Typography.exerciseName` - Exercise titles
- `Typography.workoutPlanName` - Workout plan titles

## 🚀 Installation Steps

1. **Copy your font files** to `assets/fonts/` directory
2. **Install required packages**:
   ```bash
   npx expo install expo-font expo-splash-screen
   ```
3. **Clear cache and restart**:
   ```bash
   npx expo start --clear
   ```

## 📁 Expected Folder Structure

```
your-project/
├── assets/
│   └── fonts/
│       ├── Poppins-Regular.ttf
│       ├── Poppins-Medium.ttf
│       ├── Poppins-SemiBold.ttf
│       ├── Poppins-Bold.ttf
│       ├── AlanSans-Regular.ttf
│       ├── AlanSans-Medium.ttf
│       ├── AlanSans-SemiBold.ttf
│       ├── AlanSans-Bold.ttf
│       ├── Montserrat-Regular.ttf
│       ├── Montserrat-Medium.ttf
│       └── Montserrat-SemiBold.ttf
├── constants/
│   ├── Fonts.ts
│   ├── Typography.ts
│   └── theme.ts
└── app/
    └── _layout.tsx (Updated with font loading)
```

## ✅ Testing Your Fonts

Create a test component to verify fonts are working:

```typescript
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Typography, Colors } from '@/constants/theme';

export default function FontTest() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={[Typography.h1, { color: Colors.light.text, marginBottom: 10 }]}>
        H1 - Poppins Bold
      </Text>
      <Text style={[Typography.body, { color: Colors.light.text, marginBottom: 10 }]}>
        Body - Alan Sans Regular
      </Text>
      <Text style={[Typography.description, { color: Colors.light.text, marginBottom: 10 }]}>
        Description - Montserrat Regular
      </Text>
      <Text style={[Typography.numbers, { color: Colors.light.tint }]}>
        Numbers - Alan Sans Bold
      </Text>
    </ScrollView>
  );
}
```

## 🎨 Font Personality

- **Poppins**: Modern, geometric, perfect for strong headings
- **Alan Sans**: Clean, readable, excellent for UI elements
- **Montserrat**: Elegant, readable, ideal for longer text content

Your fonts are now ready to use throughout your Gym Logs app! 💪