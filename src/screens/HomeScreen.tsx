import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Theme } from '../constants/theme';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const [braveStep, setBraveStep] = useState('Say hello to a classmate');
const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
const [progressDays, setProgressDays] = useState(0);
useEffect(() => {
  loadBraveStep();
}, []);
const loadBraveStep = async () => {
  const savedStep = await AsyncStorage.getItem('selectedBraveStep');
  const savedStartDate = await AsyncStorage.getItem('braveStepStartDate');
  console.log('Saved start date:', savedStartDate);
console.log('Today:', new Date().toISOString());

  if (savedStep) {
    setBraveStep(savedStep);
    setIsFirstTimeUser(false);

    if (savedStartDate) {
      const startDate = new Date(savedStartDate);
      const today = new Date();

      const startDay = new Date(
  startDate.getFullYear(),
  startDate.getMonth(),
  startDate.getDate()
);

const todayDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);

const differenceInTime = todayDay.getTime() - startDay.getTime();

const differenceInDays =
  Math.floor(differenceInTime / (1000 * 60 * 60 * 24)) + 1;

setProgressDays(Math.min(differenceInDays, 7));
    }
  } else {
    setIsFirstTimeUser(true);
    setProgressDays(0);
  }
};

  return (
  
    <ScrollView
  contentContainerStyle={styles.container}
  showsVerticalScrollIndicator={false}
>
      <Text style={styles.week}>
  {isFirstTimeUser ? 'Welcome!' : 'Welcome back!'}
</Text>
<Text style={styles.welcomeSubtitle}>
  You're not alone in this
</Text>

      {isFirstTimeUser ? (
  <View style={styles.braveCard}>
  <Text style={styles.braveStep}>
    Welcome!
  </Text>

  <Text style={styles.reminderText}>
    We're excited to help you begin your journey toward building confidence.
  </Text>

  <View style={styles.reminderBox}>
    <Text style={styles.reminderText}>
      Choose your first brave step to get started. We'll help you stay on track throughout the week.
    </Text>
  </View>

  <TouchableOpacity
    style={styles.outlineButton}
    onPress={() => navigation.navigate('BraveStep')}
  >
    <Text style={styles.outlineButtonText}>
      Choose My Brave Step
    </Text>
  </TouchableOpacity>
  </View>
) : (
  <View style={styles.braveCard}>

    <View style={styles.cornerDecoration} />
    <View style={styles.cornerDecorationSmall} />

  <Text style={styles.label}>This week’s brave step</Text>

  <Text style={styles.braveStep}>{braveStep}</Text>

  <View style={styles.quoteBox}>
    <Text
  style={styles.quoteText}
  numberOfLines={1}
  adjustsFontSizeToFit
>
  Small steps today, big changes tomorrow
</Text>
  </View>

  <View style={styles.reminderBox}>
  <Text style={styles.reminderText}>
    Remember: Every effort, no matter{"\n"}
    how small, matters.
  </Text>
</View>

  <TouchableOpacity
    style={styles.outlineButton}
    onPress={() => navigation.navigate('BraveStep')}
  >
    <Text style={styles.outlineButtonText}>Change My Step</Text>
  </TouchableOpacity>
</View>
)}

{!isFirstTimeUser && (
  <View style={styles.progressCard}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressTitle}>Your Progress</Text>
      <Text style={styles.progressDays}>{progressDays}/7 days</Text>
    </View>

    <View style={styles.progressBarBackground}>
  <View
    style={[
      styles.progressBarFill,
      { width: `${(progressDays / 7) * 100}%` },
    ]}
  />
</View>
  </View>
)}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.lg,
    paddingTop: 70,
  },
  
week: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 31,
  color: Theme.colors.text,
  marginBottom: 2,
},
  
braveCard: {
  backgroundColor: Theme.colors.card,
  borderRadius: 28,
  paddingHorizontal: 20,
  paddingVertical: 24,
  marginBottom: Theme.spacing.xl,
  alignItems: 'center',
  position: 'relative',
overflow: 'hidden',
},

  label: {
  fontFamily: 'CormorantRegular',
  fontSize: 24,
  color: Theme.colors.textSecondary,
  marginBottom: 6,
  textAlign: 'left',
  alignSelf: 'flex-start',
  marginLeft: 12,
},

  braveStep: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 24,
  color: Theme.colors.text,
  textAlign: 'center',
  marginBottom: 18,
},
 reminderBox: {
   backgroundColor: Theme.colors.accentSoft,
  borderRadius: 22,
  width: '98%',
  paddingVertical: 14,
  paddingHorizontal: 12,
  marginBottom: 24,
  justifyContent: 'center',
  alignItems: 'center',
},
 reminderText: {
  fontSize: 16,
  color: Theme.colors.textSecondary,
  textAlign: 'center',
  lineHeight: 24,
  fontStyle: 'italic',
},

  outlineButton: {
  borderWidth: 1.5,
  borderColor: Theme.colors.primary,
  borderRadius: 40,

  width: '68%',
  height: 62,

  justifyContent: 'center',
  alignItems: 'center',

  marginTop: 10,
},

outlineButtonText: {
  fontFamily: 'CormorantSemiBold',
  color: Theme.colors.primary,
  fontSize: 18,
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
  quoteBox: {
  backgroundColor: Theme.colors.accentSoft,
  borderRadius: 30,

  width: '96%',

  paddingVertical: 14,

  marginBottom: 18,

  justifyContent: 'center',
  alignItems: 'center',
},

quoteText: {
  fontFamily: 'CormorantRegular',
  fontSize: 18,
  fontStyle: 'italic',
  color: Theme.colors.textSecondary,
  textAlign: 'center',
},

progressCard: {
  backgroundColor: Theme.colors.card,
  borderRadius: 20,
  padding: Theme.spacing.lg,
  marginBottom: Theme.spacing.xl,
},

progressHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: Theme.spacing.md,
},

progressTitle: {
  fontSize: Theme.fontSize.md,
  color: Theme.colors.text,
  fontWeight: '600',
},

progressDays: {
  fontSize: Theme.fontSize.sm,
  color: Theme.colors.textSecondary,
},

progressBarBackground: {
  width: '100%',
  height: 10,
  backgroundColor: '#E6E6E6',
  borderRadius: 10,
  overflow: 'hidden',
},

progressBarFill: {
  height: '100%',
  backgroundColor: Theme.colors.primary,
  borderRadius: 10,
},
welcomeSubtitle: {
  fontSize: Theme.fontSize.md,
  color: Theme.colors.textSecondary,
  marginBottom: Theme.spacing.xl,
  alignSelf: 'flex-start',
  marginLeft: 5,
},
reminderTitle: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 20,
  color: Theme.colors.text,
},
cornerDecoration: {
  position: 'absolute',

  top: -35,
  right: -35,

  width: 120,
  height: 120,

  borderRadius: 60,

  backgroundColor: '#FFF3D6',

  opacity: 0.7,
},
cornerDecorationSmall: {
  position: 'absolute',

  top: 15,
  right: -18,

  width: 70,
  height: 70,

  borderRadius: 35,

  backgroundColor: '#FFE9B5',

  opacity: 0.6,
},
});