import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { PumpkinTheme } from '@/lib/theme';
import { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { Users } from 'lucide-react-native';

export default function CrmScreen() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const data = await ApiClient.getContacts();
            setContacts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {item.firstName?.[0]?.toUpperCase() || '?'}
                </Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>CLIENT</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={PumpkinTheme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={contacts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Users size={48} color={PumpkinTheme.colors.surface} />
                        <Text style={styles.emptyText}>No contacts found</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PumpkinTheme.colors.background,
    },
    center: {
        flex: 1,
        backgroundColor: PumpkinTheme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PumpkinTheme.colors.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: PumpkinTheme.colors.primary,
        fontFamily: 'Outfit_700Bold',
        fontSize: 18,
    },
    info: {
        flex: 1,
    },
    name: {
        color: 'white',
        fontFamily: 'Outfit_700Bold',
        fontSize: 16,
        marginBottom: 4,
    },
    email: {
        color: PumpkinTheme.colors.textSecondary,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
    },
    badge: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    badgeText: {
        color: '#10b981',
        fontSize: 10,
        fontFamily: 'Inter_600SemiBold',
    },
    empty: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: PumpkinTheme.colors.textSecondary,
        marginTop: 16,
        fontFamily: 'Outfit_700Bold',
        fontSize: 18,
    }
});
