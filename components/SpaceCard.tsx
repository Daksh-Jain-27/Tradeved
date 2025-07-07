import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SpaceCardProps {
  id: string;
  title: string;
  quests: string;
  spaceIcon: ImageSourcePropType;
  categories?: string[];
}

export const SpaceCard = ({ id, title, quests, spaceIcon, categories = ['Edu', 'Options'] }: SpaceCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/quests/space-details/[id]',
      params: { id }
    });
  };

  // Truncate title if too long
  const MAX_TITLE_LENGTH = 15;
  const displayTitle = title.length > MAX_TITLE_LENGTH ? title.slice(0, MAX_TITLE_LENGTH) + '...' : title;

  return (
    <TouchableOpacity style={styles.spaceCard} onPress={handlePress}>
      <Image source={spaceIcon} style={styles.spaceIcon} />
      <Text style={styles.spaceTitle}>{displayTitle}</Text>
      <Text style={styles.spaceQuests}>{quests}</Text>
      <Text style={styles.categoriesLabel}>Categories</Text>
      <View style={styles.categoryContainer}>
        {categories.slice(0, 4).map((category, index) => (
          <View key={index} style={styles.categoryPill}>
            <Text style={styles.categoryText} >{category}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  spaceCard: {
    width: 144,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#D3DEC8',
    borderWidth: 1,
    padding: 16,
    paddingBottom: 12,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  spaceIcon: {
    marginTop: -12,
    width: 47,
    height: 47,
    resizeMode: 'cover',
  },
  spaceTitle: {
    marginTop: -5,
    color: '#242620',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: -20,
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
    marginHorizontal: -10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
    marginHorizontal: -10,
  },
  categoryPill: {
    backgroundColor: '#9BEC00',
    paddingHorizontal: 4,
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