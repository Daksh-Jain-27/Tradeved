import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EventCardProps {
  title: string;
  image: ImageSourcePropType;
  brandName?: string;
  isLive?: boolean;
  description?: string;
  progress?: {
    current: string;
    total: string;
  };
  reward?: string;
  endDate?: string;
  endTime?: string;
  onPress?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  image,
  brandName,
  isLive = false,
  description = "Lorem ipsum dolor sit amet consectetur. In lorem diam ut sit et sed velit tincidunt.",
  progress = { current: "25k", total: "50k" },
  reward = "100",
  endDate = "23 July, 2024",
  endTime = "15:30 IST",
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.contentContainer}>
        {/* Left side - Featured Quest Content (unchanged) */}
        <View style={styles.questContent}>
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

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

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
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.pointsText}>{reward} pts</Text>
            </View>
          </View>
        </View>

        {/* Right side - Event Image with overlay badges */}
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
          <View style={styles.imageOverlayContent}>
            {/* LIVE badge */}
            {isLive && (
              <View style={styles.liveBadgeCentered}>
                <View style={styles.liveBadgeGlow} />
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
            )}
            {/* Brand badge */}
            {brandName && (
              <View style={styles.brandBadgeCentered}>
                <View style={styles.brandBadge}>
                  <View style={styles.brandIconWrapper}>
                    <Image
                      source={require('../assets/images/brandicon.png')}
                      style={styles.brandIconImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.brandTextImage}>{brandName}</Text>
                </View>
              </View>
            )}
            {/* Title centered below badges */}
            <Text style={styles.titleImage}>{title}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 400,
    height: 340,
    borderRadius: 12,
    backgroundColor: '#2c2e27',
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  questContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
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
  brandTextImage: {
    color: '#FFF',
    fontSize: 13,
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
  pointsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 14,
  },
  imageContainer: {
    width: 200,
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  imageOverlayContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  liveBadgeCentered: {
    marginBottom: 10,
    alignItems: 'center',
  },
  brandBadgeCentered: {
    marginBottom: 10,
    alignItems: 'center',
  },
  titleImage: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ReemKufiFun-Regular',
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  liveBadgeGlow: {
    position: 'absolute',
    width: 70,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9BEC00',
    opacity: 0.25,
    top: 0,
    left: 0,
    zIndex: 1,
    shadowColor: '#9BEC00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242620',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#9BEC00',
    paddingHorizontal: 14,
    paddingVertical: 4,
    zIndex: 2,
    minWidth: 60,
    justifyContent: 'center',
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9BEC00',
    marginRight: 8,
  },
  liveText: {
    color: '#9BEC00',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242620CC',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
}); 