import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';

type HeaderProps = {
    onProfilePress?: () => void;
    onSearchPress?: () => void;
    searchPlaceholder?: string;
    containerStyle?: ViewStyle;
    value?: string;
    onChangeText?: (text: string) => void;
    recommendations?: string[];
    onRecommendationPress?: (recommendation: string) => void;
};

export const Header = ({
    onProfilePress,
    onSearchPress,
    searchPlaceholder = "Explore Quest",
    containerStyle,
    value = '',
    onChangeText,
    recommendations = [],
    onRecommendationPress
}: HeaderProps) => {
    return (
        <View style={[styles.fixedHeader, containerStyle]}>
            <Image
                source={require('../assets/images/Tradeved-icon.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.searchWrapper}>
                <Ionicons name="search" size={20} color="#a2aba9" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={searchPlaceholder}
                    placeholderTextColor="#a2aba9"
                    textAlign="left"
                    value={value}
                    onChangeText={onChangeText}
                    onPressIn={onSearchPress}
                />
                <View style={styles.searchUnderline} />
                {recommendations.length > 0 && (
                    <View style={styles.dropdown}>
                        {recommendations.map((rec, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.dropdownItem}
                                onPress={() => onRecommendationPress && onRecommendationPress(rec)}
                            >
                                <Image source={require('../assets/images/search.png')} style={styles.dropdownIcon} />
                                <Text style={styles.dropdownText}>{rec}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                {recommendations.length === 0 && value && (
                    <View style={styles.dropdown}>
                        <View style={[styles.dropdownItem, { opacity: 0.7 }]}> 
                            <Image source={require('../assets/images/search.png')} style={styles.dropdownIcon} />
                            <Text style={[styles.dropdownText, { color: '#aaa' }]}>No quest found</Text>
                        </View>
                    </View>
                )}
            </View>
            <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/quests/profile')}>
                <Image
                    source={require('../assets/images/profile.png')}
                    style={styles.profileImage}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    fixedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
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
    searchWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 22,
        position: 'relative',
        marginLeft: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: '#FFF',
        fontSize: 14,
        paddingVertical: 8,
        paddingRight: 8,
    },
    searchUnderline: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 6,
        height: 0.5,
        backgroundColor: '#a2aba9',
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
    dropdown: {
        position: 'absolute',
        top: 44,
        left: 0,
        right: 0,
        backgroundColor: '#242620',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 200,
        paddingVertical: 4,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    dropdownIcon: {
        width: 18,
        height: 18,
        marginRight: 8,
        tintColor: '#a2aba9',
    },
    dropdownText: {
        color: '#fff',
        fontSize: 14,
    },
}); 