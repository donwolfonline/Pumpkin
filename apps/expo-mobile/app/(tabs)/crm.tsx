import { View, Text, StyleSheet } from 'react-native';
import { PumpkinTheme } from '@/lib/theme';

export default function PlaceholderScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Coming Soon 🚧</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PumpkinTheme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'Outfit_700Bold',
        color: PumpkinTheme.colors.textSecondary,
        fontSize: 24,
    }
});
