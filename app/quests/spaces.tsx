import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SpaceCard } from '../../components/SpaceCard';

type SpaceCardItem = {
  id: string;
  title: string;
  quests: string;
  spaceIcon: any;
  categories: string[];
};

export default function Spaces() {
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;
  const cardWidth = 144;
  const gap = 16;
  const cardsPerRow = 2; // Fixed to 2 columns
  const totalWidth = (cardWidth * cardsPerRow) + (gap * (cardsPerRow - 1));
  const leftPadding = (windowWidth - totalWidth) / 2;

  const [spaceCards, setSpaceCards] = useState<SpaceCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaceCards = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.dev.tradeved.com/space/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch spaces');
      }

      const data = await response.json();

      // Map API data to match the SpaceCardItem structure
      const mappedSpaces: SpaceCardItem[] = data.data.map((space: any) => ({
        id: space.id,
        title: space.name || 'Unnamed Space',
        quests: `${space.quests?.length || 0} Quests`,
        spaceIcon: space.logo_url ? { uri: space.logo_url } : require('../../assets/images/lazada.png'),
        categories: space.category || ['General'],
      }));

      setSpaceCards(mappedSpaces);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaceCards();
  }, []);

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
        <TouchableOpacity style={styles.retryButton} onPress={fetchSpaceCards}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={[styles.spaceCardsContainer, { paddingLeft: leftPadding }]}>
          {spaceCards.map((space, index) => (
            <View key={space.id} style={styles.spaceCardWrapper}>
              <SpaceCard {...space} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242620',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#9BEC00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 66,
    left: 19,
    zIndex: 10,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  spaceCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 120,
    marginBottom: 10,
  },
  spaceCardWrapper: {
    width: '45%', // Slightly less than 50% to account for gap
    marginBottom: 16,
  },
  // spaceCard: {
  //   width: 144,
  //   // aspectRatio: 1,
  //   backgroundColor: '#fff',
  //   borderRadius: 12,
  //   borderColor: '#D3DEC8',
  //   borderWidth: 1,
  //   padding: 16,
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  //   gap: 8,
  // },
  spaceIcon: {
    marginTop: -12,
    width: 47,
    height: 47,
    resizeMode: 'contain',
  },
  spaceTitle: {
    marginTop: -5,
    color: '#242620',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  spaceQuests: {
    marginTop: -8,
    color: '#242620',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400',
  },
  categoriesLabel: {
    color: '#73786C',
    fontSize: 10,
    fontWeight: '400',
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: -8,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  categoryPill: {
    backgroundColor: '#9BEC00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderColor: '#000',
    borderWidth: 1,
  },
  categoryText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
  },
}); 