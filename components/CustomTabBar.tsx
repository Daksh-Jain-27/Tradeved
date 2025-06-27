import { useColorScheme } from '@/hooks/useColorScheme';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { HapticTab } from './HapticTab';

const tabIcons: Record<string, any> = {
  Home: require('../assets/images/home.png'),
  Quest: require('../assets/images/questicon.png'),
  Quiz: require('../assets/images/quizicon.png'),
  PaperTrading: require('../assets/images/papertradingicon.png'),
  Journal: require('../assets/images/journalicon.png'),
  Lock: require('../assets/images/lock.png'),
};

const tabNames = [
  { name: 'Home', label: 'Home', path: '/(tabs)/Home' },
  { name: 'Quest', label: 'Quest', path: '/(tabs)/Quest' },
  { name: 'Quiz', label: 'Quiz', path: '/(tabs)/Quiz' },
  { name: 'PaperTrading', label: 'Paper Trading', path: '/(tabs)/PaperTrading' },
  { name: 'Journal', label: 'Journal', path: '/(tabs)/Journal' },
];

function TabIcon({ name, focused, locked, style }: { name: string; focused: boolean; locked: boolean; style?: any }) {
  return (
    <View style={{ alignItems: 'center', ...style }}>
      <Image source={tabIcons[name]} style={{ width: 25, height: 25, tintColor: locked ? '#aaa' : (focused ? '#C6FF00' : '#fff') }} />
      {locked && (
        <Image source={tabIcons.Lock} style={{ position: 'absolute', right: -2, top: -2, width: 14, height: 14 }} />
      )}
      <Text style={{ color: locked ? '#aaa' : (focused ? '#C6FF00' : '#fff'), fontSize: 11, marginTop: 2, fontWeight: 'bold' }}>
        {name === 'PaperTrading' ? 'Paper Trading' : name}
      </Text>
    </View>
  );
}

export default function CustomTabBar() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.tabBar}>
      {tabNames.map((tab) => {
        const locked = ['PaperTrading', 'Journal'].includes(tab.name);
        // Improved focus logic for Quest tab and related pages
        let focused = false;
        if (tab.name === 'Quest') {
          focused = (
            pathname?.includes('Quest') ||
            pathname?.includes('/quest-details') ||
            pathname?.includes('/explorequest') ||
            pathname?.includes('/space-details')
          );
        } else {
          focused = pathname?.includes(tab.name);
        }
        return (
          <HapticTab
            key={tab.name}
            onPress={() => {
              if (locked) {
                Alert.alert('Locked', 'This feature is locked.');
                return;
              }
              router.push(tab.path as any);
            }}
            style={styles.tabButton}
          >
            <TabIcon name={tab.name} focused={!!focused} locked={locked} style={{ marginLeft: -20, marginRight: -20 }} />
          </HapticTab>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#33362E',
    borderTopWidth: 0,
    height: 80,
    paddingBottom: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
}); 