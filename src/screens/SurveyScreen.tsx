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

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const questions = [
  {
    id: 1,
    text: 'Fear of embarrassment causes me to avoid doing things or speaking to people.',
  },
  {
    id: 2,
    text: 'I avoid activities in which I am the center of attention.',
  },
  {
    id: 3,
    text: 'Being embarrassed or looking stupid are among my worst fears.',
  },
];

const answerOptions = [
  { label: 'Not at all', value: 0 },
  { label: 'A little bit', value: 1 },
  { label: 'Somewhat', value: 2 },
  { label: 'Very much', value: 3 },
  { label: 'Extremely', value: 4 },
];

export default function SurveyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0);
  };

  const handleSubmit = () => {
    const score = calculateScore();

    console.log('Mini-SPIN Score:', score);
    console.log('Answers:', answers);

    navigation.navigate('Home');
  };

  const allQuestionsAnswered = questions.every(
    (question) => answers[question.id] !== undefined
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Weekly Check-In</Text>

      <Text style={styles.subtitle}>
        This short check-in helps us understand how social situations have been feeling lately.
      </Text>

      {questions.map((question) => (
        <View key={question.id} style={styles.questionCard}>
          <Text style={styles.questionText}>{question.text}</Text>

          <View style={styles.optionsContainer}>
            {answerOptions.map((option) => {
              const selected = answers[question.id] === option.value;

              return (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.optionButton,
                    selected && styles.selectedOption,
                  ]}
                  onPress={() => handleAnswer(question.id, option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <Button
        title="Submit Check-In"
        onPress={handleSubmit}
        disabled={!allQuestionsAnswered}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.lg,
    paddingTop: 70,
    backgroundColor: Theme.colors.background,
  },

  title: {
    fontSize: Theme.fontSize.xxl,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },

  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: Theme.spacing.xl,
  },

  questionCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: 24,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },

  questionText: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    lineHeight: 26,
    marginBottom: Theme.spacing.lg,
  },

  optionsContainer: {
    gap: Theme.spacing.sm,
  },

  optionButton: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 16,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },

  selectedOption: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },

  optionText: {
    color: Theme.colors.text,
    fontSize: Theme.fontSize.md,
  },

  selectedOptionText: {
    color: Theme.colors.white,
  },
});