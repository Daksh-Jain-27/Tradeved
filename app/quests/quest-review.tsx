import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Type for the API response
type QuestDetails = {
    id: string;
    title: string;
    description: string;
    content: string;
    content_type: string;
    logo_url: string;
    max_reward_point: number;
    participant_limit: number;
    participants: any[];
    questQNA: {
        id: string;
        total_question: number;
        questions: Array<{
            id: string;
            questionText: string;
            options: Array<{
                id: string;
                content: string;
                description: string;
                isCorrect: boolean;
            }>;
        }>;
    };
    quest_time: number;
    template: string;
    status: string;
    created_at: string;
    updated_at: string;
    is_lock: boolean;
    end_date: string;
};

const removeHtmlTags = (htmlContent: string) => {
    if (!htmlContent) return '';
    return htmlContent
      .replace(/<h3>(.*?)<\/h3>/g, '\n$1\n') // Convert h3 to new lines
      .replace(/<p>(.*?)<\/p>/g, '$1\n') // Convert p to new lines
      .replace(/<ul>(.*?)<\/ul>/g, '$1\n') // Convert ul to new lines
      .replace(/<li>(.*?)<\/li>/g, '• $1\n') // Convert li to bullet points
      .replace(/<br\s*\/?>/g, '\n') // Convert br to new lines
      .replace(/&nbsp;/g, ' ') // Convert &nbsp; to space
      .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
      .trim();
  };

export default function QuestReview() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [questDetails, setQuestDetails] = React.useState<QuestDetails | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [userAnswers, setUserAnswers] = React.useState<Record<string, string | string[]>>({});

    const fetchQuestDetails = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                setError('Authentication required');
                return;
            }

            const response = await fetch(`https://api.dev.tradeved.com/quest/get/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
        },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch quest details');
            }

            const data = await response.json();
            setQuestDetails(data.data);
            
            // Get user's answers from AsyncStorage
            const savedAnswers = await AsyncStorage.getItem(`quest_answers_${id}`);
            if (savedAnswers) {
                setUserAnswers(JSON.parse(savedAnswers));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching quest details:', err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchQuestDetails();
    }, [id]);

    const isOptionCorrect = (option: { id: string; content: string; description: string; isCorrect: boolean }) => {
        return Boolean(option.description && option.description.trim() !== '');
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#9BEC00" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchQuestDetails}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

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
                        source={require('../../assets/images/Tradeved-icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <TouchableOpacity style={styles.profileButton}>
                        <Image
                            source={require('../../assets/images/profile.png')}
                            style={styles.profileImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.subHeader}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Quest Review</Text>
                    </View>

                    {questDetails?.questQNA.questions.map((question, index) => {
                        const userAnswersForQuestion = userAnswers[question.id];
                        const isSkipped = !userAnswersForQuestion || (Array.isArray(userAnswersForQuestion) && userAnswersForQuestion.length === 0);
                        const correctOptions = question.options.filter(opt => isOptionCorrect(opt));
                        
                        let isCorrectForThisQuestion = false;
                        if (!isSkipped) {
                            if (Array.isArray(userAnswersForQuestion)) { // Multi-correct
                                const correctOptionIds = new Set(correctOptions.map(o => o.id));
                                const userAnswerIds = new Set(userAnswersForQuestion);
                                isCorrectForThisQuestion = correctOptionIds.size === userAnswerIds.size && [...userAnswerIds].every(id => correctOptionIds.has(id));
                            } else { // Single-correct
                                const userSelectedOption = question.options.find(opt => opt.id === userAnswersForQuestion);
                                isCorrectForThisQuestion = userSelectedOption ? isOptionCorrect(userSelectedOption) : false;
                            }
                        }

                        const explanation = correctOptions.map(opt => removeHtmlTags(opt.description)).join('\n');

                        return (
                        <View key={question.id} style={styles.questionContainer}>
                            <Text style={styles.questionText}>
                                    Question {index + 1}: {question.questionText}
                            </Text>
                            
                            {!isSkipped && (
                            <View style={[
                                styles.statusIndicator,
                                        !isCorrectForThisQuestion ? styles.wrongIndicator : styles.correctIndicator
                            ]}>
                                <Ionicons 
                                            name={!isCorrectForThisQuestion ? "close" : "checkmark"} 
                                    size={16} 
                                            color={!isCorrectForThisQuestion ? "#e32f2f" : "#82c71d"}
                                />
                                <Text style={[
                                    styles.indicatorText,
                                            { color: !isCorrectForThisQuestion ? '#e32f2f' : '#82c71d' }
                                ]}>
                                            {!isCorrectForThisQuestion ? "Wrong" : "Correct"}
                                </Text>
                            </View>
                            )}

                                {question.options.map((option) => {
                                    const isUserAnswer = Array.isArray(userAnswersForQuestion)
                                        ? userAnswersForQuestion.includes(option.id)
                                        : userAnswersForQuestion === option.id;
                                    
                                    const isCorrectAnswer = isOptionCorrect(option);
                                    const showAsWrong = isUserAnswer && !isCorrectAnswer;
                                    const showAsCorrect = isCorrectAnswer;

                                    return (
                                <View
                                            key={option.id}
                                    style={[
                                        styles.optionContainer,
                                                showAsWrong && styles.wrongOption,
                                                showAsCorrect && styles.correctOption,
                                                !showAsWrong && !showAsCorrect && styles.defaultOption,
                                    ]}
                                >
                                    <Text style={[
                                        styles.optionText,
                                                showAsWrong && styles.wrongOptionText,
                                                showAsCorrect && styles.correctOptionText,
                                                !showAsWrong && !showAsCorrect && styles.defaultOptionText,
                                    ]}>
                                                {option.content}
                                    </Text>
                                </View>
                                    );
                                })}

                                {explanation.trim() !== '' && (
                                    <View style={styles.explanationContainer}>
                                        <Text style={styles.explanationTitle}>Explanation</Text>
                                        <Text style={styles.explanationText}>{explanation}</Text>
                                    </View>
                                )}
                        </View>
                        );
                    })}

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
    explanationContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#2c2e27',
        borderRadius: 6,
    },
    explanationTitle: {
        color: '#9BEC00',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    explanationText: {
        color: '#FFF',
        fontSize: 14,
        lineHeight: 20,
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
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#9BEC00',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#242620',
        fontSize: 16,
        fontWeight: '600',
    },
}); 