import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { PumpkinTheme } from '@/lib/theme';
import { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { Receipt, CheckCircle2, Clock } from 'lucide-react-native';

export default function InvoicesScreen() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const data = await ApiClient.getInvoices();
            setInvoices(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const isPaid = item.status === 'paid';
        return (
            <View style={styles.card}>
                <View style={[styles.iconBox, { backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(249, 115, 22, 0.1)' }]}>
                    {isPaid ?
                        <CheckCircle2 size={20} color="#10b981" /> :
                        <Clock size={20} color={PumpkinTheme.colors.primary} />
                    }
                </View>
                <View style={styles.info}>
                    <Text style={styles.clientName}>{item.clientName || 'Unknown Client'}</Text>
                    <Text style={styles.number}>#{item.number || '0000'}</Text>
                </View>
                <View style={styles.amountBox}>
                    <Text style={styles.amount}>${(item.total || 0).toFixed(2)}</Text>
                    <Text style={[styles.status, { color: isPaid ? '#10b981' : PumpkinTheme.colors.primary }]}>
                        {item.status?.toUpperCase()}
                    </Text>
                </View>
            </View>
        );
    };

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
                data={invoices}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Receipt size={64} color={PumpkinTheme.colors.surface} />
                        <Text style={styles.emptyText}>No invoices found</Text>
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
    iconBox: {
        padding: 10,
        borderRadius: 12,
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    clientName: {
        color: 'white',
        fontFamily: 'Outfit_700Bold',
        fontSize: 16,
        marginBottom: 4,
    },
    number: {
        color: PumpkinTheme.colors.textSecondary,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
    },
    amountBox: {
        alignItems: 'flex-end',
    },
    amount: {
        color: 'white',
        fontFamily: 'Outfit_700Bold',
        fontSize: 16,
        marginBottom: 4,
    },
    status: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 10,
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
