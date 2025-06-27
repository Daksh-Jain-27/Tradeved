import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Learn Trading Through Quests',
        description: 'Complete interactive quests to master trading concepts, from basic to advanced strategies.',
        image: require('../assets/images/quest1.jpg')
    },
    {
        id: '2',
        title: 'Earn While You Learn',
        description: 'Get rewarded with points and achievements as you complete trading challenges and improve your skills.',
        image: require('../assets/images/champion.png')
    },
    {
        id: '3',
        title: 'Join Trading Communities',
        description: 'Connect with fellow traders in specialized spaces, share insights, and participate in live market discussions.',
        image: require('../assets/images/lazadaquest.png')
    }
];

export default function Onboarding() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = React.useRef(new Animated.Value(0)).current;

    const viewableItemsChanged = React.useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = React.useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const slidesRef = React.useRef(null);

    const scrollTo = (index: number) => {
        if (slidesRef.current) {
            (slidesRef.current as any).scrollToOffset({
                offset: index * width,
            });
        }
    };

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            scrollTo(currentIndex + 1);
        }
    };

    const handleSkip = () => {
        scrollTo(slides.length - 1);
    };

    const handleGetStarted = () => {
        router.push('/(tabs)/Quest');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Animated.FlatList
                data={slides}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <View style={styles.contentContainer}>
                            <Image
                                source={require('../assets/images/TradeVed LOGO.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <View style={styles.imageContainer}>
                                <Image source={item.image} style={styles.image} resizeMode="contain" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                            <View style={styles.footer}>
                                <View style={styles.paginationDots}>
                                    {slides.map((_, index) => {
                                        const inputRange = [
                                            (index - 1) * width,
                                            index * width,
                                            (index + 1) * width,
                                        ];

                                        const dotWidth = scrollX.interpolate({
                                            inputRange,
                                            outputRange: [8, 20, 8],
                                            extrapolate: 'clamp',
                                        });

                                        const opacity = scrollX.interpolate({
                                            inputRange,
                                            outputRange: [0.3, 1, 0.3],
                                            extrapolate: 'clamp',
                                        });

                                        return (
                                            <Animated.View
                                                key={index}
                                                style={[
                                                    styles.dot,
                                                    { width: dotWidth, opacity },
                                                ]}
                                            />
                                        );
                                    })}
                                </View>

                                <View style={styles.buttonContainer}>
                                    {currentIndex < slides.length - 1 ? (
                                        <>
                                            <TouchableOpacity
                                                style={[styles.button, styles.skipButton]}
                                                onPress={handleSkip}
                                            >
                                                <Text style={styles.skipButtonText}>Skip</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.button, styles.nextButton]}
                                                onPress={handleNext}
                                            >
                                                <Text style={styles.nextButtonText}>Next</Text>
                                                <Ionicons name="arrow-forward" size={20} color="#242620" />
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <TouchableOpacity
                                            style={[styles.button, styles.getStartedButton]}
                                            onPress={handleGetStarted}
                                        >
                                            <Text style={styles.getStartedText}>Get Started</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
                scrollEventThrottle={32}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242620',
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        width: 170,
        height: 170,
        marginBottom: -40,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: width * 0.6,
        height: width * 0.6,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#A2AB9A',
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: '85%',
    },
    footer: {
        width: '100%',
        paddingHorizontal: 16,
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#9BEC00',
        marginHorizontal: 3,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    skipButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#A2AB9A',
    },
    skipButtonText: {
        color: '#A2AB9A',
        fontSize: 14,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: '#9BEC00',
        gap: 6,
    },
    nextButtonText: {
        color: '#242620',
        fontSize: 14,
        fontWeight: '600',
    },
    getStartedButton: {
        backgroundColor: '#9BEC00',
        width: '100%',
    },
    getStartedText: {
        color: '#242620',
        fontSize: 14,
        fontWeight: '600',
    },
}); 