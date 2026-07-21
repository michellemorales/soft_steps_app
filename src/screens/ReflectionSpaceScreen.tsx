import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Theme } from '../constants/theme';
import api from '../services/api';
import { ChatMessage, ReflectionChatResponse } from '../types';

// Navigation
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function ReflectionSpaceScreen() {
    
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi, I’m here to help you reflect. How did your brave step feel today?',
      sender: 'bot',
    },
  ]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const route = useRoute<RouteProp<RootStackParamList, 'ReflectionSpace'>>();

const {
  stepId,
  stepTitle,
  stepStatus,
  stepType,
} = route.params;

  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);

    try {
      const response = await api.post<ReflectionChatResponse>('/reflection/chat', {
        message: userMessage.text,
      });

      const botMessage: ChatMessage = {
        id: `${Date.now()}-bot`,
        text: response.data.reply,
        sender: 'bot',
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `${Date.now()}-error`,
        text: 'Something went wrong, but your reflection still matters. Please try again.',
        sender: 'bot',
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
  onPress={() => navigation.navigate('Home')}
  style={styles.backButton}
>
  <Text style={styles.backButtonText}>← Home</Text>
</TouchableOpacity>
        <Text style={styles.title}>Reflection Space</Text>
        <Text style={styles.subtitle}>
          A gentle place to think through your experience.
        </Text>
        <View style={styles.currentStepCard}>
  <Text style={styles.currentStepLabel}>
    {stepStatus === 'completed'
      ? 'Reflecting on'
      : 'Current Brave Step'}
  </Text>

  <Text style={styles.currentStepTitle}>
    {stepTitle}
  </Text>
</View>
      </View>

      <ScrollView
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map(message => {
          const isUser = message.sender === 'user';

          return (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                isUser ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isUser ? styles.userText : styles.botText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          );
        })}

        {isSending && (
          <Text style={styles.typingText}>Soft Steps is reflecting...</Text>
        )}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Write your reflection..."
          placeholderTextColor={Theme.colors.textSecondary}
          multiline
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isSending}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },

  header: {
    padding: Theme.spacing.lg,
    paddingTop: 70,
  },

  title: {
    fontSize: Theme.fontSize.xxl,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },

  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    lineHeight: 24,
  },

  chat: {
    flex: 1,
  },

  chatContent: {
    padding: Theme.spacing.lg,
  },

  messageBubble: {
    maxWidth: '82%',
    borderRadius: 22,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },

  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.card,
  },

  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Theme.colors.primary,
  },

  messageText: {
    fontSize: Theme.fontSize.md,
    lineHeight: 24,
  },

  botText: {
    color: Theme.colors.text,
  },

  userText: {
    color: Theme.colors.white,
  },

  typingText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.fontSize.sm,
    marginTop: Theme.spacing.sm,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: Theme.colors.background,
    borderRadius: 18,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    color: Theme.colors.text,
    fontSize: Theme.fontSize.md,
  },

  sendButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 18,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginLeft: Theme.spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  sendButtonText: {
    color: Theme.colors.white,
    fontSize: Theme.fontSize.md,
  },
  backButton: {
  marginBottom: Theme.spacing.md,
},

backButtonText: {
  color: Theme.colors.primary,
  fontSize: Theme.fontSize.md,
},

currentStepCard: {
  backgroundColor: Theme.colors.card,
  borderRadius: 18,
  padding: Theme.spacing.md,
  marginTop: Theme.spacing.md,
},

currentStepLabel: {
  color: Theme.colors.textSecondary,
  fontSize: Theme.fontSize.sm,
  marginBottom: 4,
},

currentStepTitle: {
  color: Theme.colors.text,
  fontSize: Theme.fontSize.lg,
  fontWeight: '600',
},
});