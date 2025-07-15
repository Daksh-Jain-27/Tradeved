import { Tabs } from 'expo-router';
import React from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { HapticTab } from '../../components/HapticTab';
import { useColorScheme } from '../../hooks/useColorScheme';

type TabName = 'Home' | 'Quest' | 'Quiz' | 'PaperTrading' | 'Journal';

const tabIcons: Record<TabName | 'Lock', any> = {
  Home: require('../../assets/images/home.png'), // Replace with actual image
  Quest: require('../../assets/images/questicon.png'),
  Quiz: require('../../assets/images/quizicon.png'), // Replace with actual image
  PaperTrading: require('../../assets/images/papertradingicon.png'), // Replace with actual image
  Journal: require('../../assets/images/journalicon.png'), // Replace with actual image
  Lock: require('../../assets/images/lock.png'),
};

function TabIcon({ name, focused, locked, style }: { name: TabName; focused: boolean; locked: boolean; style: any }) {
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

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Custom tab bar button to prevent navigation for locked tabs
  function CustomTabBarButton({ routeName, children, ...props }: any) {
    const locked = [''].includes(routeName);
    return (
      <HapticTab
        {...props}
        onPress={(e: any) => {
          if (locked) {
            Alert.alert('Locked', 'This feature is locked.');
            return;
          }
          props.onPress?.(e);
        }}
      >
        {children}
      </HapticTab>
    );
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#2eb086',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarButton: (props) => <CustomTabBarButton {...props} routeName={route.name} />, // Use custom button
        tabBarStyle: { backgroundColor: '#232823', borderTopWidth: 0, height: 80, paddingTop: 16, },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          const locked = [''].includes(route.name);
          return <TabIcon name={route.name as TabName} focused={focused} locked={locked} style={{ marginLeft: -20, marginRight: -20 }} />;
        },
      })}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Quest" />
      <Tabs.Screen name="Quiz" />
      <Tabs.Screen name="PaperTrading" />
      <Tabs.Screen name="Journal" />
    </Tabs>
  );
}
