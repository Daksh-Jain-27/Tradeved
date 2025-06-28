import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack } from 'expo-router';

interface TradeData {
    amount: string;
    type: 'profit' | 'loss';
    trades: number;
}

const tradeData: TradeData[] = [
    { amount: '27.3k', type: 'profit', trades: 4 },
    { amount: '19.2k', type: 'loss', trades: 2 },
    { amount: '26.3k', type: 'profit', trades: 3 },
    { amount: '26.3k', type: 'loss', trades: 1 },
];

const tags = [
    'User Management',
    'Transaction Monitor',
    'Marketing Tools',
    'Analytics and Reporting',
    'Security',
    'CRM'
];

export default function JournalEntry() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const router = useRouter();

    const handleTagPress = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const getTagColor = (tag: string) => {
        const colorMap: { [key: string]: string } = {
            'User Management': '#9bec00',
            'Transaction Monitor': '#ff9eb6',
            'Marketing Tools': '#ffd600',
            'Analytics and Reporting': '#9bec00',
            'Security': '#ff9eb6',
            'CRM': '#00b4d8'
        };
        return colorMap[tag] || '#9bec00';
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                        <Text style={styles.headerTitle}>My Data Journal</Text>
                    </TouchableOpacity>
                </View>

                {/* Date Section */}
                <Text style={styles.dateText}>July, 2024</Text>

                {/* Trade Cards */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tradeCardsContainer}>
                    {tradeData.map((data, index) => (
                        <View
                            key={index}
                            style={[
                                styles.tradeCard,
                                { backgroundColor: data.type === 'profit' ? '#9bec00' : '#ff9eb6' }
                            ]}
                        >
                            <Text style={styles.tradeAmount}>{data.amount}</Text>
                            <Text style={styles.tradeCount}>{data.trades} Trades</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Title Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Add Title</Text>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Type your title"
                        placeholderTextColor="#666"
                    />
                </View>

                {/* Tags Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Add tags</Text>
                    <TextInput
                        style={styles.tagsInput}
                        placeholder="Type new tags to add new tags"
                        placeholderTextColor="#666"
                    />
                    <View style={styles.tagsContainer}>
                        {tags.map((tag, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleTagPress(tag)}
                                style={[
                                    styles.tagButton,
                                    {
                                        backgroundColor: selectedTags.includes(tag) ? getTagColor(tag) : 'transparent',
                                        borderColor: getTagColor(tag)
                                    }
                                ]}
                            >
                                <Text style={[
                                    styles.tagText,
                                    { color: selectedTags.includes(tag) ? '#000' : getTagColor(tag) }
                                ]}>
                                    {tag}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Notes Section */}
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Notes</Text>
                    <TextInput
                        style={styles.notesInput}
                        placeholder="Fill this in later"
                        placeholderTextColor="#666"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                {/* Bottom Buttons */}
                <View style={styles.bottomButtons}>
                    <TouchableOpacity style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.moreButton}>
                        <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242620',
        padding: 16,
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    dateText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 16,
    },
    tradeCardsContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    tradeCard: {
        padding: 12,
        borderRadius: 8,
        marginRight: 12,
        minWidth: 100,
        alignItems: 'center',
    },
    tradeAmount: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tradeCount: {
        color: '#000',
        fontSize: 12,
    },
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
    },
    titleInput: {
        backgroundColor: '#31332b',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 14,
    },
    tagsInput: {
        backgroundColor: '#31332b',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 14,
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagButton: {
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
    },
    tagText: {
        fontSize: 12,
    },
    notesInput: {
        backgroundColor: '#31332b',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 14,
        height: 100,
        textAlignVertical: 'top',
    },
    bottomButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
        marginBottom: 40,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#9bec00',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    moreButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#31332b',
        alignItems: 'center',
        justifyContent: 'center',
    },
}); 