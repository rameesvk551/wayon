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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, shadows, fonts, gradients } from '../../theme';

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
        content: "Hey there! ✨ I'm your AI travel companion. Let's plan your perfect trip together!",
        time: '09:24',
    },
];

const suggestions = [
    'Plan a 5-day trip',
    'Beach destinations',
    'Budget under $800',
    'Family friendly ideas',
];

export default function PlannerScreen() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [focused, setFocused] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    const sendEnabled = input.trim().length > 0;
    const currentTime = useMemo(() => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }, [messages.length]);

    const handleSend = () => {
        if (!sendEnabled) return;
        const trimmed = input.trim();
        const newMessage: Message = {
            id: `${Date.now()}`,
            type: 'user',
            content: trimmed,
            time: currentTime,
        };
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    };

    const handleSuggestion = (text: string) => {
        setInput(text);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <LinearGradient colors={gradients.primaryStrong} style={styles.header}>
                    <View style={styles.headerBg} />
                    <View style={styles.headerContent}>
                        <View style={styles.avatarWrap}>
                            <View style={styles.avatarRing} />
                            <View style={styles.avatarInner}>
                                <Ionicons name="sparkles" size={22} color={colors.white} />
                            </View>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusBadgeText}>AI</Text>
                            </View>
                        </View>

                        <View style={styles.headerInfo}>
                            <Text style={styles.headerTitle}>Trip Planner AI</Text>
                            <View style={styles.headerStatus}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>Online • Ready to help</Text>
                            </View>
                        </View>

                        <View style={styles.headerActions}>
                            <TouchableOpacity
                                style={styles.headerActionBtn}
                                onPress={() => router.push('/(tabs)/favorites')}
                            >
                                <Ionicons name="heart" size={18} color={colors.white} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.headerActionBtn}
                                onPress={() => router.push('/(tabs)/profile')}
                            >
                                <Ionicons name="ellipsis-vertical" size={18} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

                <ScrollView
                    ref={scrollRef}
                    style={styles.messages}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageRow,
                                msg.type === 'user' ? styles.messageRowUser : styles.messageRowAi,
                            ]}
                        >
                            {msg.type === 'ai' ? (
                                <View style={styles.aiAvatar}>
                                    <Ionicons name="sparkles" size={14} color={colors.white} />
                                </View>
                            ) : null}
                            <View
                                style={[
                                    styles.bubble,
                                    msg.type === 'user' ? styles.bubbleUser : styles.bubbleAi,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bubbleText,
                                        msg.type === 'user' ? styles.bubbleTextUser : styles.bubbleTextAi,
                                    ]}
                                >
                                    {msg.content}
                                </Text>
                            </View>
                            <Text style={styles.timeText}>{msg.time}</Text>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.inputSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.suggestions}
                    >
                        {suggestions.map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={styles.suggestionChip}
                                onPress={() => handleSuggestion(item)}
                            >
                                <Ionicons name="sparkles" size={12} color="#047857" />
                                <Text style={styles.suggestionText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={[styles.inputContainer, focused && styles.inputFocused]}>
                        <TouchableOpacity style={styles.inputAction}>
                            <Ionicons name="add" size={18} color="#94A3B8" />
                        </TouchableOpacity>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Ask anything about your trip..."
                            placeholderTextColor="#94A3B8"
                            style={styles.input}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, sendEnabled && styles.sendBtnActive]}
                            onPress={handleSend}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="send" size={18} color={sendEnabled ? colors.white : '#94A3B8'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT,
    },
    header: {
        padding: 16,
        paddingBottom: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        overflow: 'hidden',
    },
    headerBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        opacity: 0.9,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    avatarWrap: {
        width: 52,
        height: 52,
        position: 'relative',
    },
    avatarRing: {
        position: 'absolute',
        top: -3,
        right: -3,
        bottom: -3,
        left: -3,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    avatarInner: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    statusBadge: {
        position: 'absolute',
        bottom: -6,
        right: -6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        backgroundColor: '#10B981',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.white,
    },
    statusBadgeText: {
        fontSize: 9,
        fontFamily: fonts.bodyBold,
        color: colors.white,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: fonts.bodyBold,
        color: colors.white,
    },
    headerStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
    },
    statusText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.85)',
        fontFamily: fonts.body,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerActionBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    messages: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
        gap: 14,
    },
    messageRow: {
        maxWidth: '90%',
    },
    messageRowAi: {
        alignSelf: 'flex-start',
    },
    messageRowUser: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    aiAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary.DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    bubble: {
        borderRadius: 18,
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    bubbleAi: {
        backgroundColor: colors.white,
        ...shadows.sm,
    },
    bubbleUser: {
        backgroundColor: colors.primary.DEFAULT,
    },
    bubbleText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: fonts.body,
    },
    bubbleTextAi: {
        color: colors.text.primary,
    },
    bubbleTextUser: {
        color: colors.white,
    },
    timeText: {
        fontSize: 11,
        color: colors.text.light,
        marginTop: 4,
        fontFamily: fonts.body,
    },
    inputSection: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: 'rgba(226,232,240,0.8)',
        ...shadows.sm,
    },
    suggestions: {
        paddingBottom: 12,
        gap: 8,
    },
    suggestionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: '#F0FDFA',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    suggestionText: {
        fontSize: 13,
        fontFamily: fonts.bodyMedium,
        color: '#047857',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    inputFocused: {
        backgroundColor: colors.white,
        borderColor: colors.primary.DEFAULT,
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 2,
    },
    inputAction: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: fonts.body,
        color: '#1E293B',
        paddingVertical: 6,
    },
    sendBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E2E8F0',
    },
    sendBtnActive: {
        backgroundColor: colors.primary.DEFAULT,
        ...shadows.sm,
    },
});
