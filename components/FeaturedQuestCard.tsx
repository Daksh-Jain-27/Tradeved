import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';

interface FeaturedQuestCardProps {
    title?: string;
    brandName?: string;
    description?: string;
    progress?: {
        current: string;
        total: string;
    };
    reward?: string;
    endDate?: string;
    endTime?: string;
}

export const FeaturedQuestCard: React.FC<FeaturedQuestCardProps> = ({
    title = "Featured Quests",
    brandName = "Brand Name",
    description = "Lorem ipsum dolor sit amet consectetur. In lorem diam ut sit et sed velit tincidunt.",
    progress = { current: "25k", total: "50k" },
    reward = "100",
    endDate = "23 July, 2024",
    endTime = "15:30 IST",
}) => {
    return (
        <View style={styles.shadowWrapper}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.brandContainer}>
                        <View style={styles.brandIconWrapper}>
                            <Image
                                source={require('../assets/images/brandicon.png')}
                                style={styles.brandIconImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.brandText}>{brandName}</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.avatarStack}>
                            {[...Array(4)].map((_, idx) => (
                                <Image
                                    key={idx}
                                    source={{ uri: 'https://i.pravatar.cc/40' }}
                                    style={[styles.avatar, { left: idx * 12 }]}
                                />
                            ))}
                        </View>
                        <Text style={styles.progressText}>{progress.current} / {progress.total}</Text>
                    </View>
                </View>

                {/* Title & Description */}
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                {/* Footer Section */}
                <View style={styles.footer}>
                    <View style={styles.footerRow}>
                        <View style={styles.rewardContainer}>
                            <Image
                                source={require('../assets/images/hexagon.png')}
                                style={styles.statIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.rewardLabel}>Reward</Text>
                        </View>
                        {/* <View style={styles.dateContainer}>
                            <Image
                                source={require('../assets/images/uis_calender.png')}
                                style={styles.statIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.dateText}>{endDate} | {endTime}</Text>
                        </View> */}
                    </View>
                    <View style={styles.footerRow}>
                        <Text style={styles.pointsText}>{reward} pts</Text>
                        {/* <Text style={styles.tillText}>till {endDate} | {endTime}</Text> */}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    shadowWrapper: {
        ...Platform.select({
            ios: {
                shadowColor: '#2c2e27',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
        borderRadius: 12,
        backgroundColor: '#2c2e27',
        padding: 4,
        width: 250,
        height: 340,
    },
    container: {
        backgroundColor: '#2c2e27',
        borderColor: '#2c2e27',
        borderWidth: 0,
        borderRadius: 12,
        padding: 16,
        flex: 1,
    },
    header: {
        marginTop: 27,
        marginBottom: 12,
    },
    brandContainer: {
        width: 110,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D3DEC8',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 26,
        gap: 6,
        marginBottom: 12,
    },
    brandIconWrapper: {
        width: 20,
        height: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#73786c',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#73786c',
    },
    brandIconImage: {
        width: 12,
        height: 12,
    },
    brandText: {
        color: '#242620',
        fontSize: 12,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarStack: {
        flexDirection: 'row',
        position: 'relative',
        marginRight: -10,
        height: 20,
        width: 20,
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#242620',
        position: 'absolute',
    },
    progressText: {
        color: 'white',
        fontSize: 14,
        marginLeft: 52,
    },
    title: {
        marginTop: 16,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 8,
        fontFamily: 'ReemKufiFun-Regular',
    },
    description: {
        color: '#A2AB9A',
        fontSize: 13,
        lineHeight: 16,
        marginBottom: 16,
        fontWeight: '400',
    },
    footer: {
        // borderTopWidth: 1,
        // borderTopColor: 'rgba(162, 171, 154, 0.2)',
        paddingTop: 12,
        marginTop: -10,
        gap: 0,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statIcon: {
        width: 14,
        height: 14,
        marginRight: -4,
    },
    rewardLabel: {
        color: '#a2ab9a',
        fontSize: 12,
        marginRight: 12,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        color: '#a2ab9a',
        fontSize: 12,
    },
    pointsText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        marginRight: 14,
    },
    tillText: {
        color: '#fff',
        fontSize: 12.5,
        fontWeight: '700',
    },
}); 