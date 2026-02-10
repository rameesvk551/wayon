import React, { useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows, fonts } from '../../theme';

type Message = {
    id: string;
    type: 'ai' | 'user';
    content: string;
    time: string;
};

const initialMessages: Message[] = [
    {
        id: 'm1',
        type: 'ai',
        content: "Hi! 👋 I'm your AI travel assistant. Ask me anything about destinations, tours, hotels, or trip planning!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
];

const quickActions = [
    'Recommend a destination',
    'Best hotels in Paris',
    'Plan a weekend trip',
    'Budget travel tips',
];

export default function BotScreen() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const scrollRef = useRef<ScrollView>(null);

    const sendEnabled = input.trim().length > 0;

    const currentTime = useMemo(() => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, []);

    const handleSend = () => {
        if (!sendEnabled) return;
        const userMsg: Message = {
            id: `u-${Date.now()}`,
            type: 'user',
            content: input.trim(),
            time: currentTime,
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            const aiMsg: Message = {
                id: `a-${Date.now()}`,
                type: 'ai',
                content: "That's a great question! Let me look into that for you. I can help with tours, hotels, and travel planning. 🌍",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, aiMsg]);
            scrollRef.current?.scrollToEnd({ animated: true });
        }, 1200);

        scrollRef.current?.scrollToEnd({ animated: true });
    };

    const handleQuickAction = (action: string) => {
        setInput(action);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.botAvatar}>
                        <Ionicons name="sparkles" size={20} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Travel Bot</Text>
                        <Text style={styles.headerSubtitle}>Always here to help</Text>
                    </View>
                </View>

                {/* Messages */}
                <ScrollView
                    ref={scrollRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageBubble,
                                msg.type === 'user' ? styles.userBubble : styles.aiBubble,
                            ]}
                        >
                            {msg.type === 'ai' && (
                                <View style={styles.aiIcon}>
                                    <Ionicons name="sparkles" size={14} color="#F97316" />
                                </View>
                            )}
                            <Text
                                style={[
                                    styles.messageText,
                                    msg.type === 'user' && styles.userMessageText,
                                ]}
                            >
                                {msg.content}
                            </Text>
                            <Text
                                style={[
                                    styles.messageTime,
                                    msg.type === 'user' && styles.userMessageTime,
                                ]}
                            >
                                {msg.time}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Quick Actions */}
                {messages.length <= 1 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.quickActionsContainer}
                    >
                        {quickActions.map((action) => (
                            <TouchableOpacity
                                key={action}
                                style={styles.quickActionChip}
                                onPress={() => handleQuickAction(action)}
                            >
                                <Text style={styles.quickActionText}>{action}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask me anything..."
                        placeholderTextColor={colors.text.muted}
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, sendEnabled && styles.sendButtonActive]}
                        onPress={handleSend}
                        disabled={!sendEnabled}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={sendEnabled ? '#fff' : colors.text.muted}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0ECE3',
    },
    botAvatar: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#F97316',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text.primary,
    },
    headerSubtitle: {
        fontSize: 13,
        color: colors.text.muted,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: spacing.lg,
        gap: 12,
    },
    messageBubble: {
        maxWidth: '82%',
        padding: 14,
        borderRadius: 18,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#F0ECE3',
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#F97316',
        borderBottomRightRadius: 4,
    },
    aiIcon: {
        marginBottom: 6,
    },
    messageText: {
        fontSize: 15,
        color: colors.text.primary,
        lineHeight: 22,
    },
    userMessageText: {
        color: '#fff',
    },
    messageTime: {
        fontSize: 11,
        color: colors.text.muted,
        marginTop: 6,
        alignSelf: 'flex-end',
    },
    userMessageTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    quickActionsContainer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 12,
        gap: 10,
    },
    quickActionChip: {
        backgroundColor: '#F0ECE3',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5DFD5',
    },
    quickActionText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.text.primary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: spacing.lg,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0ECE3',
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#F0ECE3',
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 12,
        fontSize: 15,
        color: colors.text.primary,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E5DFD5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonActive: {
        backgroundColor: '#F97316',
    },
});
