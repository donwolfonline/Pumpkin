import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PumpkinTheme } from '@/lib/theme';
import { useAuth } from '@/lib/auth-context';
import { Bell, Lock, HelpCircle, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
    const { user, signOut } = useAuth();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.sectionHeader}>ACCOUNT</Text>

            <View style={styles.profileCard}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.name?.[0]?.toUpperCase() || 'JD'}
                    </Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{user?.name || 'John Doe'}</Text>
                    <Text style={styles.email}>{user?.email || 'john@example.com'}</Text>
                </View>
            </View>

            <Text style={styles.sectionHeader}>PREFERENCES</Text>

            <SettingItem icon={Bell} title="Notifications" subtitle="On" />
            <SettingItem icon={Lock} title="Privacy & Security" subtitle="Managed by Organization" />
            <SettingItem icon={HelpCircle} title="Help & Support" subtitle="FAQ & Contact" />

            <View style={styles.spacer} />

            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <Text style={styles.logoutText}>LOG OUT</Text>
            </TouchableOpacity>

            <Text style={styles.version}>Version 1.0.0 (Expo)</Text>
        </ScrollView>
    );
}

function SettingItem({ icon: Icon, title, subtitle }: any) {
    return (
        <TouchableOpacity style={styles.settingItem}>
            <Icon size={24} color={PumpkinTheme.colors.textSecondary} />
            <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{title}</Text>
                <Text style={styles.settingSubtitle}>{subtitle}</Text>
            </View>
            <ChevronRight size={20} color={PumpkinTheme.colors.textSecondary} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PumpkinTheme.colors.background,
    },
    content: {
        padding: 24,
        flexGrow: 1,
    },
    sectionHeader: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 10,
        color: PumpkinTheme.colors.textSecondary,
        letterSpacing: 2,
        marginBottom: 16,
        marginTop: 8,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PumpkinTheme.colors.surface,
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 40,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: PumpkinTheme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    avatarText: {
        color: 'white',
        fontFamily: 'Outfit_700Bold',
        fontSize: 24,
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 20,
        color: 'white',
        marginBottom: 4,
    },
    email: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        color: PumpkinTheme.colors.textSecondary,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(10, 44, 40, 0.5)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    settingText: {
        flex: 1,
        marginLeft: 16,
    },
    settingTitle: {
        color: 'white',
        fontFamily: 'Outfit_700Bold',
        fontSize: 14,
    },
    settingSubtitle: {
        color: PumpkinTheme.colors.textSecondary,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
    },
    spacer: {
        flex: 1,
    },
    logoutButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
        marginBottom: 24,
    },
    logoutText: {
        color: '#ef4444',
        fontFamily: 'Inter_700Bold',
        fontSize: 12,
        letterSpacing: 2,
    },
    version: {
        textAlign: 'center',
        color: PumpkinTheme.colors.textSecondary,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
    },
});
