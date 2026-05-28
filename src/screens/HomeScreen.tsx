import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Theme } from '../constants/theme';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.week}>Week 1</Text>

      <View style={styles.braveCard}>
        <Text style={styles.label}>YOUR BRAVE STEP</Text>
        <Text style={styles.braveStep}>Say hello to a classmate</Text>

        <View style={styles.reminderBox}>
          <Text style={styles.reminderText}>
            Remember: You can try this step whenever you feel ready. There’s no deadline or pressure.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => navigation.navigate('BraveStep')}
        >
          <Text style={styles.outlineButtonText}>Change My Step</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>How can we support you today?</Text>

      {/* <TouchableOpacity style={styles.navCard}>
        <Text style={styles.navTitle}>Reflection Space</Text>
        <Text style={styles.navSubtitle}>Share your thoughts and feelings</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.navCard}
       onPress={() => navigation.navigate('ReflectionSpace')}>
        <Text style={styles.navTitle}>Reflection Space</Text>
        <Text style={styles.navSubtitle}>Share your thoughts and feelings</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.navCard}>
        <Text style={styles.navTitle}>Weekly Check-in</Text>
        <Text style={styles.navSubtitle}>Quick survey about your week</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.navCard} onPress={() => navigation.navigate('Survey')} >
        <Text style={styles.navTitle}>Weekly Check-in</Text> 
        <Text style={styles.navSubtitle}> Quick survey about your week </Text>
        </TouchableOpacity>

      <View style={styles.quoteCard}>
        
        <Text style={styles.quote}>
          {/* TODO: Make this dynamic so that the quotes are updated and pulled from DB */}
          “Progress isn’t always linear. Every small effort you make is valuable.” 
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.lg,
    paddingTop: 70,
  },
  week: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.lg,
  },
  braveCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: 24,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  label: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.primaryDark,
    marginBottom: Theme.spacing.sm,
    letterSpacing: 1,
  },
  braveStep: {
    fontSize: Theme.fontSize.xl,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.lg,
  },
  reminderBox: {
    backgroundColor: Theme.colors.accentSoft,
    borderRadius: 16,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  reminderText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.fontSize.md,
    lineHeight: 24,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
    borderRadius: 20,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: Theme.colors.primary,
    fontSize: Theme.fontSize.md,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  navCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: 20,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  navTitle: {
    fontSize: Theme.fontSize.lg,
    color: Theme.colors.text,
    marginBottom: 4,
  },
  navSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  quoteCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: 20,
    padding: Theme.spacing.lg,
    marginTop: Theme.spacing.lg,
  },
  quote: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
});