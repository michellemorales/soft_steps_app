import ConfettiCannon from 'react-native-confetti-cannon';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Theme } from '../constants/theme';
import { accomplishmentAPI } from '../services/api';
type CompletedStep = {
  title: string;
  completedAt: string;
};
export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const [braveStep, setBraveStep] = useState('Say hello to a classmate');
const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
const [showCelebration, setShowCelebration] = useState(false);
const [progressDays, setProgressDays] = useState(0);
const [completedSteps, setCompletedSteps] = useState<CompletedStep[]>([]);
useEffect(() => {
  loadBraveStep();
}, []);
const loadBraveStep = async () => {
  const savedStep = await AsyncStorage.getItem('selectedBraveStep');
  const savedStartDate = await AsyncStorage.getItem('braveStepStartDate');

try{  
  const accomplishmentsResponse = await accomplishmentAPI.getAccomplishments();

  setCompletedSteps(
    accomplishmentsResponse.data.accomplishments.map((step: any) => ({
      title: step.title,
      completedAt: step.completed_at,
    }))
  );
} catch(error){
  console.error("Error loading accomplishments.", error);
  setCompletedSteps([]);
}

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

useEffect(() => {
  const handleStepCompletion = async () => {
    if (progressDays >= 7 && braveStep) {
      setShowCelebration(true);

      const accomplishmentSaved =
        await AsyncStorage.getItem('accomplishmentSaved');

      if (!accomplishmentSaved) {
        await accomplishmentAPI.saveAccomplishment({
          title: braveStep,
          completed_at: new Date().toISOString(),
        });

        const completedStep = {
          title: braveStep,
          completedAt: new Date().toISOString(),
        };

        const updatedCompletedSteps = [
          completedStep,
          ...completedSteps,
        ];

        setCompletedSteps(updatedCompletedSteps);

        await AsyncStorage.setItem(
          'completedSteps',
          JSON.stringify(updatedCompletedSteps)
        );

        await AsyncStorage.setItem(
          'accomplishmentSaved',
          'true'
        );
      }
    }
  };

  handleStepCompletion();
}, [progressDays, braveStep]);

return (
   <SafeAreaView style={{ flex: 1 }}>

   {showCelebration && (
  <View style={styles.confettiOverlay} pointerEvents="none">
    <ConfettiCannon
      count={180}
      origin={{ x: 40, y: -20 }}
      explosionSpeed={500}
      fallSpeed={6000}
      fadeOut
    />

    <ConfettiCannon
      count={180}
      origin={{ x: 350, y: -20 }}
      explosionSpeed={500}
      fallSpeed={6000}
      fadeOut
    />
  </View>
)}

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
  <View style={styles.firstTimeCard}>
  <View style={styles.cornerDecoration} />
  <View style={styles.cornerDecorationSmall} />

  <Text style={styles.firstTimeLabel}>
    LET'S BEGIN!
  </Text>

  <Text style={styles.firstTimeTitle}>
    Choose your first brave step
  </Text>

  <View style={styles.firstTimeMessageBox}>
    <Text style={styles.firstTimeMessage}>
      Start with one small step that feels possible today.
    </Text>
  </View>
<View style={styles.stepsPreview}>
  <View style={styles.previewRow}>
    <View style={styles.previewCircle} />
    <Text style={styles.previewText}>Choose a brave step</Text>
  </View>

  <View style={styles.previewRow}>
    <View style={styles.previewCircle} />
    <Text style={styles.previewText}>Practice it throughout the week</Text>
  </View>

  <View style={styles.previewRow}>
    <View style={styles.previewCircle} />
    <Text style={styles.previewText}>Celebrate your progress</Text>
  </View>
</View>
  <TouchableOpacity
    style={styles.outlineButton}
    onPress={() => navigation.navigate('BraveStep')}
  >
    <Text style={styles.outlineButtonText}>
      Choose My Step
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
   onPress={async () => {
  if (progressDays >= 7) {

  await AsyncStorage.removeItem('selectedBraveStep');
  await AsyncStorage.removeItem('braveStepStartDate');

  setProgressDays(0);
  setShowCelebration(false);
}

  navigation.navigate('BraveStep');
}}
  >
    <Text style={styles.outlineButtonText}>
  {progressDays >= 7 ? 'Choose My Next Step' : 'Change My Step'}
</Text>
  </TouchableOpacity>
</View>
)}

{isFirstTimeUser ? (
  <View style={styles.progressCard}>
    <Text style={styles.progressTitle}>Getting Started</Text>

    <Text style={styles.gettingStartedText}>
      Choose your first brave step to begin tracking your progress.
    </Text>
  </View>
) : showCelebration ? (
  <View style={styles.celebrationCard}>
    <TouchableOpacity
      style={styles.closeCelebration}
      onPress={() => setShowCelebration(false)}
    >
      <Text style={styles.closeCelebrationText}>✕</Text>
    </TouchableOpacity>

    <Text style={styles.celebrationTitle}>Look how far you've come!</Text>

    <Text style={styles.celebrationText}>
      You completed your brave step for the week.
    </Text>
  </View>
) : (
  <View style={styles.progressCard}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressTitle}>Your Progress</Text>

      <Text style={styles.progressDays}>
        {progressDays >= 7 ? '✔ Completed' : `${progressDays}/7 days`}
      </Text>
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
{completedSteps.length > 0 && (
  <View style={styles.accomplishmentsCard}>
   <Text style={styles.accomplishmentsTitle}>
    Growth Journey
</Text>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {completedSteps.map((step, index) => (
        <View key={index} style={styles.accomplishmentMiniCard}>
          <Text style={styles.accomplishmentText}>{step.title}</Text>
          <Text style={styles.accomplishmentStatus}>Completed</Text>
<Text style={styles.accomplishmentDate}>
  {new Date(step.completedAt).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})}
</Text>
        </View>
      ))}
    </ScrollView>
    {completedSteps.length > 1 && (
  <Text style={styles.swipeHint}>
    Swipe to explore your soft steps →
  </Text>
)}
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

      <TouchableOpacity
  style={styles.navCard}
  onPress={() => navigation.navigate('Music')}
>
  <Text style={styles.navTitle}>Calm Sounds</Text>

  <Text style={styles.navSubtitle}>
    Music and sounds to help you relax
  </Text>
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
  </SafeAreaView>
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
firstTimeCard: {
  backgroundColor: Theme.colors.card,
  borderRadius: 28,
  paddingHorizontal: 20,
  paddingVertical: 30,
  marginBottom: Theme.spacing.xl,
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
},

firstTimeLabel: {
  fontSize: 13,
  color: Theme.colors.textSecondary,
  letterSpacing: 1.5,
  marginBottom: 10,
},

firstTimeTitle: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 28,
  color: Theme.colors.text,
  textAlign: 'center',
  marginBottom: 22,
},

firstTimeMessageBox: {
  backgroundColor: Theme.colors.accentSoft,
  borderRadius: 22,
  width: '96%',
  paddingVertical: 16,
  paddingHorizontal: 18,
  marginBottom: 26,
  justifyContent: 'center',
  alignItems: 'center',
},

firstTimeMessage: {
  fontSize: 16,
  color: Theme.colors.textSecondary,
  textAlign: 'center',
  lineHeight: 24,
  fontStyle: 'italic',
},
stepsPreview: {
  width: '92%',
  marginBottom: 28,
},

previewRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},

previewCircle: {
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: Theme.colors.primary,
  marginRight: 12,
},

previewText: {
  color: Theme.colors.textSecondary,
  fontSize: 16,
},
gettingStartedText: {
  marginTop: 10,
  fontSize: 16,
  color: Theme.colors.textSecondary,
  lineHeight: 24,
  textAlign: 'center',
},
celebrationCard: {
  backgroundColor: Theme.colors.card,
  borderRadius: 24,
  padding: Theme.spacing.lg,
  marginBottom: Theme.spacing.xl,
  alignItems: 'center',
  position: 'relative',
},

closeCelebration: {
  position: 'absolute',
  top: 14,
  right: 16,
},

closeCelebrationText: {
  fontSize: 20,
  color: Theme.colors.textSecondary,
},

celebrationTitle: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 30,
  color: Theme.colors.text,
  marginBottom: 8,
  textAlign: 'center',
},

celebrationText: {
  fontSize: 16,
  color: Theme.colors.textSecondary,
  textAlign: 'center',
  lineHeight: 24,
  marginBottom: 20,
},

newStepButton: {
  borderWidth: 1.5,
  borderColor: Theme.colors.primary,
  borderRadius: 30,
  paddingVertical: 14,
  paddingHorizontal: 24,
},

newStepButtonText: {
  fontFamily: 'CormorantSemiBold',
  color: Theme.colors.primary,
  fontSize: 18,
},
confettiOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  elevation: 9999,
  backgroundColor: 'rgba(0,0,0,0.15)',
},
accomplishmentsCard: {
  backgroundColor: Theme.colors.card,
  borderRadius: 20,
  padding: Theme.spacing.lg,
  marginBottom: Theme.spacing.xl,
},

accomplishmentsTitle: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 22,
  color: Theme.colors.text,
  marginBottom: 14,
},

accomplishmentMiniCard: {
  backgroundColor: Theme.colors.accentSoft,
  borderRadius: 18,
  width: 150,
  padding: 14,
  marginRight: 12,
},

accomplishmentCheck: {
  fontSize: 18,
  marginBottom: 8,
},

accomplishmentText: {
  fontSize: 15,
  color: Theme.colors.text,
  lineHeight: 20,
  marginBottom: 10,
},

accomplishmentDate: {
  fontSize: 13,
  color: Theme.colors.textSecondary,
},
accomplishmentStatus: {
  fontSize: 13,
  color: Theme.colors.textSecondary,
  marginBottom: 2,
},
swipeHint: {
  alignSelf: 'flex-start',
  marginTop: 10,
  fontFamily: 'CormorantRegular',
  fontSize: 16,
  color: Theme.colors.textSecondary,
  fontStyle: 'italic',
},
});