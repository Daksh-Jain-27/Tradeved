import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Header } from '../components/Header';

export default function Achievement() {
    const router = useRouter();

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <SafeAreaView style={styles.container}>
                {/* Fixed Main Header */}
                <Header
                    onProfilePress={() => {/* Handle profile press */ }}
                    onSearchPress={() => {/* Handle search press */ }}
                />

                {/* Content */}
                <View style={styles.content}>
                    {/* Sub Header */}
                    <View style={styles.subHeader}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Quest Header Info */}
                    <View style={styles.questHeaderWrapper}>
                        <View style={styles.questHeaderContent}>
                            <View style={styles.questTitleRow}>
                                <Text style={styles.questTitle}>Example Quest</Text>
                                <View style={styles.questTimeContainer}>
                                    <Text style={styles.questTime}>10min</Text>
                                    <Text style={styles.questType}>QnA</Text>
                                </View>
                            </View>
                            <View style={styles.contentSection}>
                                <View style={styles.questPoints}>
                                    <View style={styles.pointsAvatars}>
                                        <Image source={require('../assets/images/profile.png')} style={[styles.pointAvatar, { zIndex: 1 }]} />
                                        <Image source={require('../assets/images/profile.png')} style={[styles.pointAvatar, { marginLeft: -8, zIndex: 2 }]} />
                                        <Image source={require('../assets/images/profile.png')} style={[styles.pointAvatar, { marginLeft: -8, zIndex: 3 }]} />
                                        <Image source={require('../assets/images/profile.png')} style={[styles.pointAvatar, { marginLeft: -8, zIndex: 4 }]} />
                                    </View>
                                    <Text style={styles.pointsText}>240</Text>
                                    <Text style={styles.totalPointsText}>/4k</Text>
                                </View>
                                <View style={styles.metricsRow}>
                                    <View style={styles.questRewards}>
                                        <View style={styles.rewardItem}>
                                            <Image
                                                source={require('../assets/images/hexagon.png')}
                                                style={styles.statIcon}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.rewardText}>Reward</Text>
                                        </View>
                                        <Text style={styles.rewardPoints}>100 pts</Text>
                                    </View>
                                    <View style={styles.verticalDivider} />
                                    <View style={styles.questTimeInfo}>
                                        <View style={styles.timeItem}>
                                            <Image
                                                source={require('../assets/images/champion.png')}
                                                style={styles.statIcon}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.timeText}>Record time</Text>
                                        </View>
                                        <Text style={styles.timeDate}>21 Oct, 24</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Image
                            source={require('../assets/images/quest-header.jpg')}
                            style={styles.questHeaderBg}
                            resizeMode="cover"
                        />
                        <View style={styles.progressBar}>
                            <View style={styles.progressFill} />
                        </View>
                    </View>

                    {/* Achievement Section */}
                    <View style={styles.achievementContainer}>
                        <View style={[styles.confettiRow, { justifyContent: 'space-between' }]}>
                            <Image
                                source={require('../assets/images/confetti.png')}
                                style={styles.confettiImage}
                                resizeMode="contain"
                            />
                            <Image
                                source={require('../assets/images/confetti.png')}
                                style={styles.confettiImage}
                                resizeMode="contain"
                            />
                        </View>

                        <Text style={styles.congratsTitle}>Congratulations</Text>

                        <View style={styles.recordContainer}>
                            <Text style={styles.recordText}>New Record : <Text style={styles.recordTime}>5min 10sec</Text></Text>
                            <Text style={styles.personalBestText}>Personal Best : <Text style={styles.recordTime}>5min 10sec</Text></Text>
                        </View>

                        <View style={styles.stopwatchContainer}>
                            <Image
                                source={require('../assets/images/stopwatch.png')}
                                style={styles.stopwatchImage}
                                resizeMode="contain"
                            />
                        </View>

                        <Text style={styles.achievementText}>
                            You unlocked an achievement : <Text style={styles.achievementName}>Flash</Text>
                        </Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.shareButton}>
                                <Text style={styles.shareButtonText}>Share Achievement</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.continueButton}
                            // onPress={() => router.replace('/explorequest')}
                            >
                                <Text style={styles.continueButtonText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
        paddingTop: 40,
        paddingBottom: 12,
    },
    logo: {
        width: 37,
        height: 37,
        marginRight: 10,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginRight: 12,
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: '#FFF',
        fontSize: 16,
        paddingHorizontal: 25,
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
        borderRadius: 32,
    },
    content: {
        flex: 1,
    },
    subHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 82,
    },
    backButton: {
        padding: 8,
    },
    questHeaderWrapper: {
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 0,
        backgroundColor: '#666666',
    },
    questHeaderContent: {
        width: '75%',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    questHeaderBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '25%',
        height: '100%',
    },
    questTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 12,
    },
    questTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    questTimeContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFbdbd',
        borderRadius: 4,
        padding: 4,
        alignItems: 'center',
    },
    questTime: {
        color: '#000',
        fontSize: 10,
        marginRight: 4,
    },
    questType: {
        color: '#000',
        fontSize: 12,
        fontWeight: '600',
    },
    contentSection: {
        gap: 2,
    },
    questPoints: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -8,
    },
    pointsAvatars: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    pointAvatar: {
        width: 14,
        height: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },
    pointsText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    totalPointsText: {
        color: '#a2aba9',
        fontSize: 12,
        marginLeft: 2,
        fontWeight: '600',
    },
    questRewards: {
        alignItems: 'flex-start',
    },
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    statIcon: {
        width: 10,
        height: 10,
        marginRight: 4,
    },
    rewardText: {
        color: '#a2aba9',
        fontSize: 11,
    },
    rewardPoints: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    questTimeInfo: {
        alignItems: 'flex-start',
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    timeText: {
        color: '#a2aba9',
        fontSize: 11,
        marginLeft: 4,
    },
    timeDate: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    progressBar: {
        height: 6,
        marginTop: 16,
    },
    progressFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: '#9BEC00',
        borderRadius: 6,
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'flex-end',
        marginBottom: -22,
        alignItems: 'center',
    },
    verticalDivider: {
        width: 0.5,
        height: 28,
        backgroundColor: '#a2aba9',
        marginHorizontal: 4,
    },
    achievementContainer: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 26,
    },
    confettiRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },
    confettiImage: {
        width: 110,
        height: 110,
    },
    congratsTitle: {
        color: '#FFF',
        fontSize: 26,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 20,
    },
    recordContainer: {
        alignItems: 'center',
        gap: 4,
        marginBottom: 18,
    },
    recordText: {
        color: '#FFF',
        fontSize: 22,
        // fontWeight: '400',
    },
    personalBestText: {
        color: '#fff',
        fontSize: 18,
    },
    recordTime: {
        fontWeight: '600',
    },
    stopwatchContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    stopwatchImage: {
        width: 110,
        height: 110,
    },
    achievementText: {
        color: '#a2aba9',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
    },
    achievementName: {
        color: '#a2aba9',
        fontWeight: '700',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#FFFbfb',
    },
    shareButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    continueButton: {
        paddingHorizontal: 30,
        paddingVertical: 8,
        borderRadius: 4,
        backgroundColor: '#9BEC00',
    },
    continueButtonText: {
        color: '#0f1209',
        fontSize: 14,
        fontWeight: '700',
    },
}); 