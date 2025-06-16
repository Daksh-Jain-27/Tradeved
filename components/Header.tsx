import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';

type HeaderProps = {
    onProfilePress?: () => void;
    onSearchPress?: () => void;
    searchPlaceholder?: string;
    containerStyle?: ViewStyle;
};

export const Header = ({
    onProfilePress,
    onSearchPress,
    searchPlaceholder = "Explore Quest",
    containerStyle
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
                    onPressIn={onSearchPress}
                //   editable={false}
                />
                <View style={styles.searchUnderline} />
            </View>
            <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
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
}); 