import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function QuestReview() {
    const router = useRouter();

    const questions = [
        {
            id: 1,
            question: 'Lorem ipsum dolor sit amet consectetur?',
            options: [
                'Lorem ipsum dolor sit amet consectetur',
                'Lorem ipsum dolor sit amet consectetur',
                'Lorem ipsum dolor sit amet consectetur',
            ],
            selectedOption: 0, // 0-based index
            correctOption: 1,
        },
        {
            id: 2,
            question: 'Lorem ipsum dolor sit amet consectetur?',
            options: [
                'Lorem ipsum dolor sit amet consectetur',
                'Lorem ipsum dolor sit amet consectetur',
                'Lorem ipsum dolor sit amet consectetur',
            ],
            selectedOption: 1,
            correctOption: 1,
        },
        {
            id: 3,
            question: 'Lorem ipsum dolor sit amet consectetur?',
            options: [
                'Lorem ipsum dolor sit amet consectetur',
                'Lorem ipsum dolor sit amet consectetur',
                'Lorem ipsum dolor sit amet consectetur',
            ],
            selectedOption: 1,
            correctOption: 1,
        },
    ];

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <SafeAreaView style={styles.container}>
                {/* Fixed Main Header */}
                <View style={styles.fixedHeader}>
                    <Image
                        source={require('../assets/images/Tradeved-icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <TouchableOpacity style={styles.profileButton}>
                        <Image
                            source={require('../assets/images/profile.png')}
                            style={styles.profileImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    {/* Sub Header */}
                    <View style={styles.subHeader}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Quest preview</Text>
                    </View>

                    {/* Questions List */}
                    {questions.map((question, index) => (
                        <View key={question.id} style={styles.questionContainer}>
                            <Text style={styles.questionText}>
                                Question {question.id}: {question.question}
                            </Text>
                            
                            {/* Correct/Wrong Indicator */}
                            <View style={[
                                styles.statusIndicator,
                                question.selectedOption !== question.correctOption ? styles.wrongIndicator : styles.correctIndicator
                            ]}>
                                <Ionicons 
                                    name={question.selectedOption !== question.correctOption ? "close" : "checkmark"} 
                                    size={16} 
                                    color={question.selectedOption !== question.correctOption ? "#e32f2f" : "#82c71d"}
                                />
                                <Text style={[
                                    styles.indicatorText,
                                    { color: question.selectedOption !== question.correctOption ? '#e32f2f' : '#82c71d' }
                                ]}>
                                    {question.selectedOption !== question.correctOption ? "Wrong" : "Correct"}
                                </Text>
                            </View>

                            {/* Options */}
                            {question.options.map((option, optionIndex) => (
                                <View
                                    key={optionIndex}
                                    style={[
                                        styles.optionContainer,
                                        optionIndex === question.selectedOption && optionIndex !== question.correctOption && styles.wrongOption,
                                        optionIndex === question.correctOption && styles.correctOption,
                                        optionIndex !== question.selectedOption && optionIndex !== question.correctOption && styles.defaultOption,
                                    ]}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        optionIndex === question.selectedOption && optionIndex !== question.correctOption && styles.wrongOptionText,
                                        optionIndex === question.correctOption && styles.correctOptionText,
                                        optionIndex !== question.selectedOption && optionIndex !== question.correctOption && styles.defaultOptionText,
                                    ]}>
                                        Option {optionIndex + 1}: {option}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}

                    {/* Done Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity 
                            style={styles.doneButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242620',
    },
    fixedHeader: {
        backgroundColor: '#242620',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingBottom: 12,
    },
    logo: {
        width: 37,
        height: 37,
        marginRight: 10,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    subHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    backButton: {
        // padding: 8,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        left: '25%',
    },
    content: {
        flex: 1,
        paddingHorizontal: 14,
        // paddingTop: 20,
    },
    questionContainer: {
        marginBottom: 24,
        marginTop: 8,
        paddingTop: 14,
        paddingBottom: 4,
        paddingHorizontal: 12,
        backgroundColor: '#3b3b3b',
    },
    questionText: {
        color: '#FFF',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        // alignSelf: 'flex-start',
        marginBottom: 12,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 1,
        marginBottom: 8,
    },
    defaultOption: {
        backgroundColor: '#656565',
        borderColor: '#383838',
        borderWidth: 1,
    },
    wrongOption: {
        backgroundColor: '#F2a3a3',
        borderWidth: 1,
        borderColor: '#e32f2f',
    },
    correctOption: {
        backgroundColor: '#cfee95',
        borderWidth: 1,
        borderColor: '#5c850f',
    },
    optionText: {
        flex: 1,
        fontSize: 13,
    },
    defaultOptionText: {
        color: '#FFF',
    },
    wrongOptionText: {
        color: '#FFf',
    },
    correctOptionText: {
        color: '#FFF',
    },
    wrongIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#FF4D4D',
        // color: '#e32f2f',
        paddingHorizontal: 4,
        // paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 4,
    },
    correctIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#9BEC00',
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 4,
        // marginLeft: 8,
        marginBottom: 4,
    },
    indicatorText: {
        // color: '#e32f2f',
        fontSize: 12,
        marginLeft: 4,
        fontWeight: '600',
    },
    footer: {
        padding: 16,
        // borderTopWidth: 1,
        // borderTopColor: '#333333',
        marginBottom: 16,
        marginTop: -16,
    },
    doneButton: {
        backgroundColor: '#9BEC00',
        paddingVertical: 8,
        borderRadius: 4,
        alignItems: 'center',
        width: '70%',
        alignSelf: 'center',
    },
    doneButtonText: {
        color: '#0f1209',
        fontSize: 16,
        fontWeight: '600',
    },
}); 