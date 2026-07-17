import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native'; 

import {
  useAudioPlayer,
  useAudioPlayerStatus,
   setAudioModeAsync,
} from 'expo-audio';

import {
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { Theme } from '../constants/theme';

type CalmSound = {
  title: string;
  audio: number;
};

const sounds: CalmSound[] = [
  {
    title: 'Ocean Waves',
    audio: require('../../assets/sounds/ocean-waves.mp3'),
  },
  {
    title: 'Forest Ambiance',
        audio: require('../../assets/sounds/forest-ambiance.mp3'),
    },
    {
        title: 'Gentle Wind',
        audio: require('../../assets/sounds/gentle-wind.mp3'),
    },
  {
    title: 'Rain Sounds',
    audio: require('../../assets/sounds/rain.mp3'),
  },
];

export default function MusicScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selectedSound, setSelectedSound] =
    useState<CalmSound | null>(null);

    const scrollViewRef = useRef<ScrollView>(null);
const durationSectionY = useRef(0);

  const [selectedDuration, setSelectedDuration] =
    useState<number>(20);
    const [playing, setPlaying] = useState(false);
const [showPlayer, setShowPlayer] = useState(false);
const [sessionSeconds, setSessionSeconds] = useState(0);
const [breathingGuideEnabled, setBreathingGuideEnabled] =
  useState(false);
  const [breathingGuideEndSeconds, setBreathingGuideEndSeconds] =
  useState(60);

const [showBreathingChoice, setShowBreathingChoice] =
  useState(false);
  const breathingOpacity = useRef(new Animated.Value(1)).current;
  const breathingScale = useRef(new Animated.Value(1)).current;
  const breathingRingScale = useRef(
  new Animated.Value(1)
).current;

const soundPlayer = useAudioPlayer(
  require('../../assets/sounds/ocean-waves.mp3')
);

const soundStatus = useAudioPlayerStatus(soundPlayer);

useFocusEffect(
  useCallback(() => {
    return () => {
      soundPlayer.pause();
      setPlaying(false);
    };
  }, [soundPlayer])
);

useEffect(() => {
  const configureAudio = async () => {
    await setAudioModeAsync({
      playsInSilentMode: true,
    });
  };

  configureAudio();
}, []);


useEffect(() => {
  if (!soundStatus.playing || !showPlayer) return;

  const timer = setInterval(() => {
    setSessionSeconds((previousSeconds) => {
      const nextSeconds = previousSeconds + 1;
      const sessionLimit = selectedDuration * 60;

      if (nextSeconds >= sessionLimit) {
        soundPlayer.pause();
        setPlaying(false);
        setShowPlayer(false);

        return 0;
      }

      return nextSeconds;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [
  soundStatus.playing,
  showPlayer,
  selectedDuration,
  soundPlayer,
]);  

const remainingSeconds = Math.max(
  selectedDuration * 60 - sessionSeconds,
  0
);

const remainingMinutes = Math.floor(remainingSeconds / 60);
const remainingSecondsDisplay = remainingSeconds % 60;

const formattedTimeRemaining =
  `${remainingMinutes}:${remainingSecondsDisplay
    .toString()
    .padStart(2, '0')}`;

    useEffect(() => {
  if (
    !breathingGuideEnabled ||
    !soundStatus.playing ||
    !showPlayer ||
    sessionSeconds >= breathingGuideEndSeconds
  ) {
    return;
  }

  const isBreathingIn =
    Math.floor(sessionSeconds / 4) % 2 === 0;

  Animated.parallel([
    Animated.sequence([
      Animated.timing(breathingOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(breathingOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]),

    Animated.timing(breathingScale, {
      toValue: isBreathingIn ? 1.04 : 0.98,
      duration: 3500,
      useNativeDriver: true,
    }),
    Animated.timing(breathingRingScale, {
  toValue: isBreathingIn ? 1.2 : 0.95,
  duration: 3500,
  useNativeDriver: true,
}),
  ]).start();
}, [
  Math.floor(sessionSeconds / 4),
  breathingGuideEnabled,
  soundStatus.playing,
  showPlayer,
  breathingGuideEndSeconds
]);

useEffect(() => {
  if (
    showPlayer &&
    selectedSound &&
    soundStatus.isLoaded &&
    !soundStatus.playing
  ) {
    soundPlayer.loop = true;
    soundPlayer.play();
  }
}, [
  showPlayer,
  selectedSound,
  soundStatus.isLoaded,
]);

useEffect(() => {
  if (
    breathingGuideEnabled &&
    showPlayer &&
    sessionSeconds >= breathingGuideEndSeconds &&
    !showBreathingChoice
  ) {
    setShowBreathingChoice(true);
  }
}, [
  sessionSeconds,
  breathingGuideEnabled,
  showPlayer,
  breathingGuideEndSeconds,
  showBreathingChoice,
]);

useEffect(() => {
  if (
    !breathingGuideEnabled ||
    sessionSeconds >= breathingGuideEndSeconds
  ) {
    Animated.timing(breathingRingScale, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
}, [
  breathingGuideEnabled,
  sessionSeconds,
  breathingGuideEndSeconds,
]); 

  return (
    <ScrollView
     ref={scrollViewRef}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backButtonText}>← Back </Text>
      </TouchableOpacity>

     <View style={styles.featureCard}>
  <View style={styles.featureCircleTop} />
  <View style={styles.featureCircleBottom} />
  <View style={styles.featureOutlineCircle} />

  <Text style={styles.featureTitle}>
    Take a Moment{'\n'}for You
  </Text>

  <View style={styles.featureDivider}>
    <View style={styles.dividerLine} />
    <View style={styles.dividerDiamond} />
    <View style={styles.dividerLine} />
  </View>

  <Text style={styles.featureText}>
    Choose a sound that matches your mood and give yourself the space to relax,
    breathe, and reset.
  </Text>
</View>
<Text style={styles.sectionTitle}>Relaxing Sounds</Text>

{sounds.map((sound) => (
  <TouchableOpacity
    key={sound.title}
    style={styles.musicCard}
    onPress={() => {
  setSelectedSound(sound);
  setShowPlayer(false);

  setTimeout(() => {
    scrollViewRef.current?.scrollTo({
      y: durationSectionY.current,
      animated: true,
    });
  }, 100);
}}
  >
    <View>
      <Text style={styles.musicTitle}>{sound.title}</Text>

      <Text style={styles.musicSubtitle}>
        Choose your listening time
      </Text>
    </View>

    <View style={styles.playButton}>
      <Text style={styles.playButtonText}>▶</Text>
    </View>
  </TouchableOpacity>
))}

{selectedSound && !showPlayer && (
  <View
    style={styles.durationCard}
    onLayout={(event) => {
      durationSectionY.current = event.nativeEvent.layout.y;
    }}
  >
    <Text style={styles.durationTitle}>
      {selectedSound.title}
    </Text>

    <Text style={styles.durationSubtitle}>
      How long would you like to listen?
    </Text>

    <View style={styles.durationRow}>
      {[10, 20, 30].map((minutes) => (
        <TouchableOpacity
          key={minutes}
          style={[
            styles.durationButton,
            selectedDuration === minutes &&
              styles.selectedDurationButton,
          ]}
          onPress={() => setSelectedDuration(minutes)}
        >
          <Text
            style={[
              styles.durationButtonText,
              selectedDuration === minutes &&
                styles.selectedDurationButtonText,
            ]}
          >
            {minutes} min
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <TouchableOpacity
  style={styles.breathingOption}
  onPress={() =>
    setBreathingGuideEnabled(!breathingGuideEnabled)
  }
>
  <View
    style={[
      styles.breathingCircle,
      breathingGuideEnabled && styles.breathingCircleSelected,
    ]}
  >
    {breathingGuideEnabled && (
      <Text style={styles.breathingCheck}>✓</Text>
    )}
  </View>

  <Text style={styles.breathingOptionText}>
    Add a 1-minute breathing exercise
  </Text>
</TouchableOpacity>

    <TouchableOpacity
      style={styles.startListeningButton}
     onPress={() => {
  if (!selectedSound) return;

  soundPlayer.pause();
  soundPlayer.replace(selectedSound.audio);

  setSessionSeconds(0);
  setShowPlayer(true);
  setPlaying(true);
}}
    >
      <Text style={styles.startListeningButtonText}>
        Start Listening
      </Text>
    </TouchableOpacity>
  </View>
)}

{showPlayer && selectedSound && (
  <View style={styles.playerCard}>
    <View style={styles.decorCircleTop} />
<View style={styles.decorCircleRight} />
<View style={styles.decorCircleBottom} />
<View style={styles.decorOutlineCircle} />
<View style={styles.decorDotOne} />
<View style={styles.decorDotTwo} />
    <TouchableOpacity
      style={styles.closePlayerButton}
      onPress={() => {
        soundPlayer.pause();
        setPlaying(false);
        setShowPlayer(false);
        setSelectedSound(null);
        setSessionSeconds(0);
      }}
    >
      <Text style={styles.closePlayerText}>✕</Text>
    </TouchableOpacity>

    <Text style={styles.nowPlayingText}>
      Now Playing
    </Text>

    <Text style={styles.nowPlayingTitle}>
      {selectedSound.title}
    </Text>

   {breathingGuideEnabled && (
  <View style={styles.breathingArea}>
    {!showBreathingChoice ? (
      <>
        <View style={styles.breathingGuidePill}>
          <Text style={styles.breathingGuidePillText}>
            1 min breathing guide
          </Text>
        </View>

        <View style={styles.breathingGuideContainer}>
          <Animated.Text
            style={[
              styles.breathingGuideText,
              {
                opacity: breathingOpacity,
                transform: [{ scale: breathingScale }],
              },
            ]}
          >
            {Math.floor(sessionSeconds / 4) % 2 === 0
              ? 'Breathe in'
              : 'Breathe out'}
          </Animated.Text>
        </View>
      </>
    ) : (
      <View style={styles.breathingCompleteArea}>
        <Text style={styles.breathingCompleteTitle}>
          Breathing guide complete
        </Text>

        <Text style={styles.breathingCompleteQuestion}>
          Want another minute?
        </Text>

        <View style={styles.breathingChoiceButtons}>
          <TouchableOpacity
            style={styles.anotherMinuteButton}
            onPress={() => {
              setBreathingGuideEndSeconds(
                breathingGuideEndSeconds + 60
              );
              setShowBreathingChoice(false);
            }}
          >
            <Text style={styles.anotherMinuteButtonText}>
              Another Minute
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.justListenButton}
            onPress={() => {
              setBreathingGuideEnabled(false);
              setShowBreathingChoice(false);
            }}
          >
            <Text style={styles.justListenButtonText}>
              Just Listen
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  </View>
)}

    <View style={styles.playerControls}>
  <View style={styles.breathingRingContainer}>
  <Animated.View
    style={[
      styles.breathingRingOuter,
      {
        transform: [{ scale: breathingRingScale }],
      },
    ]}
  />

  <Animated.View
    style={[
      styles.breathingRingInner,
      {
        transform: [{ scale: breathingRingScale }],
      },
    ]}
  />

  <TouchableOpacity
    style={styles.mainPlayButton}
    onPress={() => {
      if (soundStatus.playing) {
        soundPlayer.pause();
        setPlaying(false);
      } else {
        soundPlayer.play();
        setPlaying(true);
      }
    }}
  >
    <Text style={styles.mainPlayButtonText}>
      {soundStatus.playing ? '❚❚' : '▶'}
    </Text>
  </TouchableOpacity>
</View>
</View>

    <Text style={styles.sessionText}>
      {selectedDuration} minute calming session
    </Text>

    <Text style={styles.timeRemaining}>
  {formattedTimeRemaining} remaining
</Text>

    <TouchableOpacity
      style={styles.changeTimeButton}
      onPress={() => {
        soundPlayer.pause();
        setPlaying(false);
        setShowPlayer(false);
        setSessionSeconds(0);
      }}
    >
      <Text style={styles.changeTimeButtonText}>
        Change Listening Time
      </Text>
    </TouchableOpacity>
  </View>
)}

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

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },

  backButtonText: {
    fontFamily: 'CormorantSemiBold',
    fontSize: 18,
    color: Theme.colors.textSecondary,
  },

featureCard: {
  backgroundColor: '#B5CBC2',
  borderRadius: 30,
  paddingHorizontal: 26,
  paddingVertical: 28,
  minHeight: 280,
  marginTop: 30,
  marginBottom: 34,
  position: 'relative',
  overflow: 'hidden',
},

featureTitle: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 36,
  color: Theme.colors.text,
  lineHeight: 40,
  marginBottom: 14,
  zIndex: 2,
},

featureDivider: {
  flexDirection: 'row',
  alignItems: 'center',
  width: '62%',
  marginBottom: 20,
  zIndex: 2,
},

dividerLine: {
  flex: 1,
  height: 1,
  backgroundColor: 'rgba(47, 95, 91, 0.25)',
},

dividerDiamond: {
  width: 8,
  height: 8,
  backgroundColor: 'rgba(47, 95, 91, 0.55)',
  transform: [{ rotate: '45deg' }],
  marginHorizontal: 10,
},

featureText: {
  fontSize: 16,
  color: Theme.colors.text,
  lineHeight: 25,
  width: '78%',
  zIndex: 2,
},

featureCircleTop: {
  position: 'absolute',
  width: 145,
  height: 145,
  borderRadius: 73,
  backgroundColor: 'rgba(255, 255, 255, 0.20)',
  top: -50,
  right: -35,
},

featureCircleBottom: {
  position: 'absolute',
  width: 190,
  height: 190,
  borderRadius: 95,
  backgroundColor: 'rgba(75, 125, 117, 0.10)',
  bottom: -100,
  right: -35,
},

featureOutlineCircle: {
  position: 'absolute',
  width: 130,
  height: 130,
  borderRadius: 65,
  borderWidth: 1.5,
  borderColor: 'rgba(47, 95, 91, 0.14)',
  bottom: -45,
  left: -45,
},

sectionTitle: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 24,
  color: Theme.colors.text,
  marginBottom: 14,
},

musicCard: {
  backgroundColor: Theme.colors.card,
  borderRadius: 20,
  paddingVertical: 16,
  paddingHorizontal: 18,
  marginBottom: 12,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

musicTitle: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 20,
  color: Theme.colors.text,
  marginBottom: 4,
},

musicSubtitle: {
  fontSize: 14,
  color: Theme.colors.textSecondary,
},

playButton: {
  width: 46,
  height: 46,
  borderRadius: 23,
  backgroundColor: Theme.colors.primary,
  justifyContent: 'center',
  alignItems: 'center',
},

playButtonText: {
  color: Theme.colors.background,
  fontSize: 17,
},
durationCard: {
  backgroundColor: Theme.colors.card,
  borderRadius: 24,
  padding: Theme.spacing.lg,
  marginTop: Theme.spacing.md,
  marginBottom: Theme.spacing.xl,
},

durationTitle: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 25,
  color: Theme.colors.text,
  textAlign: 'center',
  marginBottom: 6,
},

durationSubtitle: {
  fontSize: 15,
  color: Theme.colors.textSecondary,
  textAlign: 'center',
  marginBottom: 20,
},

durationRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 22,
},

durationButton: {
  width: '30%',
  height: 52,
  borderWidth: 1.5,
  borderColor: Theme.colors.primary,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
},

selectedDurationButton: {
  backgroundColor: Theme.colors.primary,
},

durationButtonText: {
  color: Theme.colors.primary,
  fontSize: 15,
},

selectedDurationButtonText: {
  color: Theme.colors.background,
},

startListeningButton: {
  backgroundColor: Theme.colors.primary,
  borderRadius: 30,
  paddingVertical: 15,
  alignItems: 'center',
},

startListeningButtonText: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 18,
  color: Theme.colors.background,
},
playerCard: {
  backgroundColor: Theme.colors.card,
  borderRadius: 24,
  paddingVertical: 24,
  padding: Theme.spacing.lg,
  marginBottom: Theme.spacing.xl,
  position: 'relative',
overflow: 'hidden',
},

nowPlayingText: {
  fontSize: 14,
  color: Theme.colors.textSecondary,
  textAlign: 'center',
  marginBottom: 4,
},

nowPlayingTitle: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 26,
  color: Theme.colors.text,
  textAlign: 'center',
  marginBottom: 16,
},

sessionText: {
  fontSize: 14,
  color: Theme.colors.textSecondary,
  textAlign: 'center',
  marginTop: 10,
  marginBottom: 18,
},

pauseButton: {
  borderWidth: 1.5,
  borderColor: Theme.colors.primary,
  borderRadius: 30,
  paddingVertical: 14,
  alignItems: 'center',
},

pauseButtonText: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 18,
  color: Theme.colors.primary,
},

playerControls: {
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 14,
},

mainPlayButton: {
  width: 72,
  height: 72,
  borderRadius: 36,
  backgroundColor: Theme.colors.primary,
  justifyContent: 'center',
  alignItems: 'center',
},

mainPlayButtonText: {
  fontSize: 28,
  color: Theme.colors.background,
},

closePlayerButton: {
  position: 'absolute',
  top: 16,
  right: 18,
  zIndex: 10,
},

closePlayerText: {
  fontSize: 22,
  color: Theme.colors.textSecondary,
},

changeTimeButton: {
  alignSelf: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 24,
  paddingVertical: 12,
  paddingHorizontal: 22,
  marginTop: 4,
},

changeTimeButtonText: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 17,
  color: Theme.colors.text,
},
timeRemaining: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 20,
  color: Theme.colors.text,
  textAlign: 'center',
  marginBottom: 18,
},
breathingOption: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 22,
},

breathingCircle: {
  width: 24,
  height: 24,
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: Theme.colors.primary,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},

breathingCircleSelected: {
  backgroundColor: Theme.colors.primary,
},

breathingCheck: {
  color: '#FFFFFF',
  fontSize: 14,
},

breathingOptionText: {
  fontSize: 15,
  color: Theme.colors.text,
},

breathingGuideText: {
  fontFamily: 'CormorantRegular',
  fontSize: 26,
  color: Theme.colors.textSecondary,
  textAlign: 'center',
  letterSpacing: 0.5,
},

breathingGuideContainer: {
  height: 54,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 12,
  marginBottom: 8,
},
breathingGuidePill: {
  alignSelf: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 22,
  paddingVertical: 8,
  paddingHorizontal: 18,
  marginTop: 14,
  marginBottom: 8,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.08,
  shadowRadius: 5,
  elevation: 2,
},

breathingGuidePillText: {
  fontSize: 14,
  color: Theme.colors.textSecondary,
},
breathingRingContainer: {
  width: 150,
  height: 150,
  justifyContent: 'center',
  alignItems: 'center',
},

breathingRingOuter: {
  position: 'absolute',
  width: 138,
  height: 138,
  borderRadius: 69,
  borderWidth: 1.5,
  borderColor: 'rgba(112, 166, 163, 0.25)',
},

breathingRingInner: {
  position: 'absolute',
  width: 112,
  height: 112,
  borderRadius: 56,
  borderWidth: 2,
  borderColor: 'rgba(112, 166, 163, 0.45)',
},
decorCircleTop: {
  position: 'absolute',
  width: 130,
  height: 130,
  borderRadius: 65,
  backgroundColor: 'rgba(112, 166, 163, 0.08)',
  top: -45,
  left: -55,
},

decorCircleRight: {
  position: 'absolute',
  width: 150,
  height: 150,
  borderRadius: 75,
  backgroundColor: 'rgba(112, 166, 163, 0.07)',
  top: 210,
  right: -75,
},

decorCircleBottom: {
  position: 'absolute',
  width: 120,
  height: 120,
  borderRadius: 60,
  backgroundColor: 'rgba(112, 166, 163, 0.06)',
  bottom: 100,
  left: -65,
},

decorOutlineCircle: {
  position: 'absolute',
  width: 105,
  height: 105,
  borderRadius: 53,
  borderWidth: 1.5,
  borderColor: 'rgba(112, 166, 163, 0.18)',
  top: 40,
  left: -35,
},

decorDotOne: {
  position: 'absolute',
  width: 7,
  height: 7,
  borderRadius: 4,
  borderWidth: 1.5,
  borderColor: 'rgba(112, 166, 163, 0.35)',
  top: 145,
  left: 35,
},

decorDotTwo: {
  position: 'absolute',
  width: 7,
  height: 7,
  borderRadius: 4,
  borderWidth: 1.5,
  borderColor: 'rgba(112, 166, 163, 0.35)',
  top: 260,
  right: 30,
},

breathingArea: {
  minHeight: 125,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 10,
},

breathingCompleteArea: {
  alignItems: 'center',
  justifyContent: 'center',
},

breathingCompleteTitle: {
  fontFamily: 'CormorantSemiBold',
  fontSize: 22,
  color: Theme.colors.text,
  marginBottom: 6,
},

breathingCompleteQuestion: {
  fontSize: 15,
  color: Theme.colors.textSecondary,
  marginBottom: 16,
},

breathingChoiceButtons: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},

anotherMinuteButton: {
  backgroundColor: Theme.colors.primary,
  borderRadius: 24,
  paddingVertical: 11,
  paddingHorizontal: 18,
},

anotherMinuteButtonText: {
  color: '#FFFFFF',
  fontSize: 14,
},

justListenButton: {
  backgroundColor: Theme.colors.primary,
  borderRadius: 24,
  paddingVertical: 11,
  paddingHorizontal: 18,
},

justListenButtonText: {
  color: '#FFFFFF',
  fontSize: 14,
},

}); 