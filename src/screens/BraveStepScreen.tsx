import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Theme } from '../constants/theme';
import { Button } from '../components/ui';

// Navigation
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// TODO: UPDATE THESE HARD-CODED STEPS
const braveSteps = [
  'Say hello to a classmate',
  'Sit with a group in class',
  'Ask a question in discussion',
  'Join a study group',
  'Introduce myself to someone new',
];

export default function BraveStepScreen() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [steps, setSteps] = useState(braveSteps);
  const [customStep, setCustomStep] = useState('');
  const [showSuggestionArea, setShowSuggestionArea] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    const savedSteps = await AsyncStorage.getItem('braveSteps');

    if (savedSteps) {
      setSteps(JSON.parse(savedSteps));
    }
  };

 return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={20}
  >
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Your Brave Step</Text>

      <Text style={styles.subtitle}>
        What small social step would you like to try this week?
      </Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Suggested Steps</Text>

  {steps.length < braveSteps.length && (
  <TouchableOpacity
    onPress={async () => {
  const restoredSteps = [
    ...steps,
    ...braveSteps.filter((step) => !steps.includes(step)),
  ];

  setSteps(restoredSteps);
  setSelectedStep(null);

  await AsyncStorage.setItem(
    'braveSteps',
    JSON.stringify(restoredSteps)
  );
}}
  >
    <Text style={styles.restoreText}>↺ Restore</Text>
  </TouchableOpacity>
)}
</View>

        {steps.map((step) => {
          const isSelected = selectedStep === step;

          return (
           <View
  key={step}
  style={[
    styles.stepCard,
    isSelected && styles.selectedCard,
  ]}
>

  <TouchableOpacity
    style={{ flex: 1 }}
    onPress={() => setSelectedStep(step)}
  >
    <Text
      style={[
        styles.stepText,
        isSelected && styles.selectedText,
      ]}
    >
      {step}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={async () => {
  const updatedSteps = steps.filter((item) => item !== step);

  setSteps(updatedSteps);
  await AsyncStorage.setItem('braveSteps', JSON.stringify(updatedSteps));
}}
  >
    <Text style={styles.deleteIcon}>✕</Text>
  </TouchableOpacity>

</View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>
  Don't see one that fits? Write your own!
</Text>

<TextInput
  style={styles.input}
  placeholder="Type your own brave step..."
  placeholderTextColor={Theme.colors.textSecondary}
  value={customStep}
  onChangeText={setCustomStep}
/>
<View style={styles.customButtonsRow}>
  <TouchableOpacity
    style={styles.suggestionsButton}
    onPress={() => {
      setIsGenerating(true);

      setTimeout(() => {
        setIsGenerating(false);
        setShowSuggestionArea(true);
      }, 1000);
    }}
  >
    <Text style={styles.suggestionsButtonText}>
      {isGenerating ? '⏳ Generating...' : '✨ Get suggestions'}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.addStepButton}
    onPress={async () => {
      if (!customStep.trim()) {
        return;
      }

      const newStep = customStep.trim();
      const updatedSteps = [...steps, newStep];

      setSteps(updatedSteps);
      setSelectedStep(newStep);
      setCustomStep('');

      await AsyncStorage.setItem(
        'braveSteps',
        JSON.stringify(updatedSteps)
      );
    }}
  >
    <Text style={styles.addStepButtonText}>+ Add step</Text>
  </TouchableOpacity>
</View>


{showSuggestionArea && (
  <View style={styles.suggestionArea}>
    <Text style={styles.similarTitle}>
      Similar steps based on your input...
    </Text>

    <View style={styles.placeholderCard}>
  <Text style={styles.placeholderText}>
 Finding similar brave steps...
  </Text>
   </View>
  </View>
)}

      <Button
  title="Continue"
  onPress={async () => {
    if (selectedStep) {
      await AsyncStorage.setItem(
        'selectedBraveStep',
        selectedStep
      );

      const existingStartDate = await AsyncStorage.getItem(
        'braveStepStartDate'
      );

      if (!existingStartDate) {
        await AsyncStorage.setItem(
          'braveStepStartDate',
          new Date().toISOString()
        );
      }
    }

    navigation.navigate('Home');
  }}
  disabled={!selectedStep}
/>
       </ScrollView>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
  },

  title: {
    fontSize: Theme.fontSize.xxl,
    color: Theme.colors.text,
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },

  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    lineHeight: 28,
    marginBottom: Theme.spacing.xl,
  },

  section: {
    marginBottom: Theme.spacing.xl,
  },

  sectionTitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },

  stepCard: {
    backgroundColor:  Theme.colors.card,
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: Theme.spacing.md,
     flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  },

  selectedCard: {
    backgroundColor: Theme.colors.primary,
  },

  stepText: {
    fontSize: Theme.fontSize.lg,
    color: Theme.colors.text,
  },

  selectedText: {
    color: Theme.colors.white,
  },
  deleteIcon: {
  fontSize: 22,
  color: Theme.colors.textSecondary,
  marginLeft: 10,
},
sectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: Theme.spacing.md,
},

restoreText: {
  color: Theme.colors.primary,
  fontSize: Theme.fontSize.md,
  fontWeight: '600',
},
input: {
  backgroundColor: Theme.colors.card,
  borderRadius: 22,
  paddingHorizontal: 20,
  paddingVertical: 18,
  fontSize: Theme.fontSize.md,
  color: Theme.colors.text,
  marginBottom: Theme.spacing.xl,
},
suggestionsButton: {
  borderWidth: 1.5,
  borderColor: Theme.colors.primary,
  borderRadius: 22,
  backgroundColor: Theme.colors.card,
  height: 42,
  paddingHorizontal: 18,
  justifyContent: 'center',
  alignItems: 'center',
},

suggestionsButtonText: {
  color: Theme.colors.textSecondary,
  fontSize: Theme.fontSize.sm,
  fontStyle: 'italic',
},
suggestionArea: {
  marginBottom: Theme.spacing.lg,
},

similarTitle: {
  fontSize: Theme.fontSize.md,
  color: Theme.colors.text,
  marginBottom: Theme.spacing.md,
},

placeholderText: {
  color: Theme.colors.textSecondary,
  fontSize: Theme.fontSize.md,
  fontStyle: 'italic',
},
placeholderCard: {
  backgroundColor: '#ECECEC',
  borderRadius: 22,
  paddingVertical: 18,
  paddingHorizontal: 20,
},
customButtonsRow: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 12,
  marginTop: -12,
  marginBottom: Theme.spacing.lg,
},

addStepButton: {
  backgroundColor: Theme.colors.primary,
  borderRadius: 22,
  height: 42,
  paddingHorizontal: 20,
  justifyContent: 'center',
  alignItems: 'center',
},

addStepButtonText: {
  color: Theme.colors.white,
  fontSize: Theme.fontSize.sm,
  fontWeight: '600',
},
});