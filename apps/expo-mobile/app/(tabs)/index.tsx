import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { PumpkinTheme } from '@/lib/theme';
import { Wallet, FolderCheck, CheckCircle2, FileText, Zap } from 'lucide-react-native';

export default function Dashboard() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Good Morning,</Text>
                <Text style={styles.name}>Pumpkin Master</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Wallet size={24} color={PumpkinTheme.colors.primary} />
                    <Text style={styles.statLabel}>TOTAL REVENUE</Text>
                    <Text style={styles.statValue}>$14,250</Text>
                    <Text style={styles.statTrend}>+12.5%</Text>
                </View>
                <View style={styles.statCard}>
                    <FolderCheck size={24} color={PumpkinTheme.colors.primary} />
                    <Text style={styles.statLabel}>PROJECTS</Text>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={[styles.statTrend, { color: PumpkinTheme.colors.primary }]}>Active</Text>
                </View>
            </View>

            {/* Efficiency Card */}
            <View style={styles.efficiencyCard}>
                <View style={styles.efficiencyHeader}>
                    <Text style={styles.efficiencyLabel}>HARVEST EFFICIENCY</Text>
                    <Zap size={16} color={PumpkinTheme.colors.primary} />
                </View>
                <View style={styles.efficiencyContent}>
                    <Text style={styles.efficiencyScore}>94%</Text>
                    <View style={styles.efficiencyDetails}>
                        <Text style={styles.efficiencyTitle}>Optimizing your time</Text>
                        <Text style={styles.efficiencyDesc}>You are 5% more efficient than last month.</Text>
                    </View>
                </View>
            </View>

            {/* Recent Activity */}
            <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>

            <View style={styles.activityItem}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                    <CheckCircle2 size={20} color={PumpkinTheme.colors.secondary} />
                </View>
                <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>Invoice Paid</Text>
                    <Text style={styles.activitySubtitle}>Design System for Solaris Corp</Text>
                </View>
                <View style={styles.activityMeta}>
                    <Text style={styles.activityAmount}>$2,500.00</Text>
                    <Text style={styles.activityTime}>2h ago</Text>
                </View>
            </View>

            <View style={styles.activityItem}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
                    <FileText size={20} color={PumpkinTheme.colors.primary} />
                </View>
                <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>New Proposal</Text>
                    <Text style={styles.activitySubtitle}>Mobile App Revamp</Text>
                </View>
                <View style={styles.activityMeta}>
                    <Text style={styles.activityAmount}>Pending Sign</Text>
                    <Text style={styles.activityTime}>5h ago</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PumpkinTheme.colors.background,
    },
    content: {
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    greeting: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 14,
        color: PumpkinTheme.colors.textSecondary,
        letterSpacing: 1,
    },
    name: {
        fontFamily: 'Outfit_900Black',
        fontSize: 32,
        color: 'white',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: PumpkinTheme.colors.surface,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statLabel: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 8,
        color: PumpkinTheme.colors.textSecondary,
        letterSpacing: 1.5,
        marginTop: 16,
        marginBottom: 4,
    },
    statValue: {
        fontFamily: 'Outfit_900Black',
        fontSize: 24,
        color: 'white',
        marginBottom: 4,
    },
    statTrend: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 10,
        color: PumpkinTheme.colors.secondary,
    },
    efficiencyCard: {
        backgroundColor: PumpkinTheme.colors.surface,
        borderRadius: 32,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 48,
    },
    efficiencyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    efficiencyLabel: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 10,
        color: PumpkinTheme.colors.primary,
        letterSpacing: 2,
    },
    efficiencyContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    efficiencyScore: {
        fontFamily: 'Outfit_900Black',
        fontSize: 48,
        color: 'white',
    },
    efficiencyDetails: {
        flex: 1,
    },
    efficiencyTitle: {
        fontFamily: 'Inter_600SemiBold',
        color: 'white',
        fontSize: 13,
        marginBottom: 4,
    },
    efficiencyDesc: {
        fontFamily: 'Inter_400Regular',
        fontSize: 11,
        color: PumpkinTheme.colors.textSecondary,
    },
    sectionTitle: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 10,
        color: PumpkinTheme.colors.textSecondary,
        letterSpacing: 4,
        marginBottom: 24,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
    },
    iconBox: {
        padding: 10,
        borderRadius: 12,
        marginRight: 16,
    },
    activityInfo: {
        flex: 1,
    },
    activityTitle: {
        fontFamily: 'Inter_600SemiBold',
        color: 'white',
        fontSize: 13,
        marginBottom: 2,
    },
    activitySubtitle: {
        fontFamily: 'Inter_400Regular',
        color: PumpkinTheme.colors.textSecondary,
        fontSize: 11,
    },
    activityMeta: {
        alignItems: 'flex-end',
    },
    activityAmount: {
        fontFamily: 'Inter_600SemiBold',
        color: 'white',
        fontSize: 13,
        marginBottom: 2,
    },
    activityTime: {
        fontFamily: 'Inter_400Regular',
        color: PumpkinTheme.colors.textSecondary,
        fontSize: 10,
    },
});
