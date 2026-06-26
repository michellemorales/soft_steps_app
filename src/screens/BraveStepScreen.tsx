import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
        <Text style={styles.sectionTitle}>Suggested Steps</Text>

        {braveSteps.map((step) => {
          const isSelected = selectedStep === step;

          return (
            <TouchableOpacity
              key={step}
              style={[
                styles.stepCard,
                isSelected && styles.selectedCard,
              ]}
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
});