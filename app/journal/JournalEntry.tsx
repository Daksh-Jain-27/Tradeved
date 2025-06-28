import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CalendarDay {
    date: number;
    amount: string;
    trades: number;
    icon1Count: number;
    icon2Count: number;
    dayName: string;
}

const generateMonthDays = (date: Date): CalendarDay[] => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), i + 1);
        return {
            date: i + 1,
            amount: `₹${Math.floor(Math.random() * 30)}.${Math.floor(Math.random() * 9)}k`,
            trades: Math.floor(Math.random() * 5) + 1,
            icon1Count: Math.floor(Math.random() * 3),
            icon2Count: Math.floor(Math.random() * 3),
            dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' })
        };
    });
};

const currentDate = new Date(2024, 6); // July 2024
const monthDays = generateMonthDays(currentDate);

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
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
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

                {/* Calendar Day Cards */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.cardsContainer}
                    contentContainerStyle={styles.cardsContent}
                >
                    {monthDays.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dayCard,
                                selectedDay === day.date && styles.selectedDay
                            ]}
                            onPress={() => setSelectedDay(day.date)}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.amountText}>{day.amount}</Text>
                                <Text style={styles.dateNumber}>{day.date.toString().padStart(2, '0')}</Text>
                            </View>
                            <Text style={styles.tradesText}>{day.trades} Trades</Text>
                            <View style={styles.bottomRow}>
                                <View style={styles.iconsRow}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="book" size={9} color="#000" />
                                        <Text style={styles.iconCount}>{day.icon1Count}</Text>
                                    </View>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="book" size={9} color="#000" />
                                        <Text style={styles.iconCount}>{day.icon2Count}</Text>
                                    </View>
                                </View>
                                <Text style={styles.dayName}>{day.dayName}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Input sections remain the same */}
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Add Title</Text>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Type your title"
                        placeholderTextColor="#666"
                    />
                </View>

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
                    <TouchableOpacity style={styles.uploadButton}>
                        <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
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
    cardsContainer: {
        marginBottom: 24,
    },
    cardsContent: {
        paddingRight: 16,
    },
    dayCard: {
        minWidth: 97,
        minHeight: 54,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginRight: 12,
        backgroundColor: '#9bec00',
        justifyContent: 'space-between',
    },
    selectedDay: {
        borderWidth: 2,
        borderColor: '#fff',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
    },
    amountText: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
    },
    dateNumber: {
        color: '#000',
        fontSize: 9,
        fontWeight: '600',
    },
    tradesText: {
        color: '#000',
        fontSize: 9,
        // marginTop: 4,
        
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    iconCount: {
        color: '#000',
        fontSize: 9,
    },
    dayName: {
        color: '#000',
        fontSize: 9,
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
    uploadButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#31332b',
        alignItems: 'center',
        justifyContent: 'center',
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