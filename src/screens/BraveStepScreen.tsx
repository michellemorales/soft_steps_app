import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
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
    onPress={() => {
      setSteps(braveSteps);
      setSelectedStep(null);
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

      <Button
        title="Continue"
        // onPress={() => console.log(selectedStep)}
        onPress={() => navigation.navigate('Home')}
        disabled={!selectedStep}
      />
    </ScrollView>
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
});