import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

const PumpkinTheme = {
    background: '#051c1c',
    surface: '#0a2c28',
    primary: '#f97316',
    textPrimary: '#FFFFFF',
    textSecondary: '#9ca3af',
};

export default function LoginScreen() {
    const { signIn, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }
        try {
            await signIn(email, password);
        } catch (e) {
            Alert.alert('Login Failed', 'Invalid credentials or server error');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.emoji}>🎃</Text>
                <Text style={styles.title}>Welcome to Pumpkin</Text>
                <Text style={styles.subtitle}>Your mobile companion for freelancing</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>EMAIL</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="hello@pumpkin.io"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>PASSWORD</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, isLoading && { opacity: 0.7 }]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>SIGN IN</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>✨ Pumpkin Mobile Beta ✨</Text>
                <Text style={styles.footerSubtext}>Manage your freelance business on the go</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PumpkinTheme.background,
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    emoji: {
        fontSize: 80,
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: PumpkinTheme.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: PumpkinTheme.textSecondary,
        textAlign: 'center',
    },
    form: {
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        color: PumpkinTheme.primary,
        letterSpacing: 2,
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(10, 44, 40, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        color: 'white',
        fontSize: 16,
    },
    button: {
        backgroundColor: PumpkinTheme.primary,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    footer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    footerText: {
        color: PumpkinTheme.primary,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    footerSubtext: {
        color: PumpkinTheme.textSecondary,
        fontSize: 12,
    },
});
