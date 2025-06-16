import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuestCardItemProps {
  id: string;
  questName: string;
  currentPoints: string;
  totalPoints: string;
  reward: string;
  endDate: string;
  multiplier: string;
  image: ImageSourcePropType;
  brandName: string;
}

export const QuestCardItem = ({
  id,
  questName,
  currentPoints,
  totalPoints,
  reward,
  endDate,
  multiplier,
  image,
  brandName,
}: QuestCardItemProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/quest-details/[id]',
        params: { id },
      })}
      style={styles.questCard}
    >
      <View style={styles.questHeader}>
        <View style={styles.questNameContainer}>
          <View style={styles.brandContainer}>
            <View style={styles.brandIconWrapper}>
              <Image
                source={require('../assets/images/brandicon.png')}
                style={styles.brandIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandText}>{questName}</Text>
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
            <Text style={styles.progressText}>
              {currentPoints} / {totalPoints}
            </Text>
          </View>
        </View>
        <View style={styles.rewardRow}>
          <Image
            source={require('../assets/images/hexagon.png')}
            style={[styles.statIcon, { width: 12, height: 12, marginRight: 4 }]}
            resizeMode="contain"
          />
          <Text style={styles.questRewardText}>Reward</Text>
          <Text style={styles.questPointsText}>{reward} pts</Text>
        </View>
        <View style={styles.questDateContainer}>
          {/* <Text style={styles.questDateText}>{endDate}</Text> */}
        </View>
      </View>

      <View style={styles.questImageContainer}>
        <Image source={image} style={styles.questImage} />
        {/* <View style={styles.multiplierBadge}>
          <View style={styles.pointsPill}>
            <Text style={styles.badgePointsText}>1k</Text>
          </View>
          <Text style={styles.multiplierText}>{multiplier}</Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  questCard: {
    width: 310,
    height: 160,
    backgroundColor: '#2c2e27',
    borderRadius: 6,
    marginRight: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  questHeader: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    padding: 12,
  },
  questNameContainer: {
    gap: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D3DEC8',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
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
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questRewardText: {
    color: '#ccc',
    fontSize: 12,
    marginRight: 4,
  },
  questPointsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questDateContainer: {
    marginTop: 4,
  },
  questDateText: {
    color: '#ccc',
    fontSize: 12,
  },
  questImageContainer: {
    width: 120,
    height: '100%',
    position: 'relative',
    overflow: 'visible',
  },
  questImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 6,
  },
  multiplierBadge: {
    position: 'absolute',
    top: -3,
    right: -16,
    backgroundColor: '#FDE900',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
    elevation: 6,
  },
  pointsPill: {
    backgroundColor: '#242620',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgePointsText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  multiplierText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '600',
  },
  statIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
}); 