import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

interface EventCardProps {
  title: string;
  image: ImageSourcePropType;
  brandName?: string;
  points?: string;
  multiplier?: string;
  isLive?: boolean;
  onPress?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  image,
  brandName,
  points,
  multiplier,
  isLive = false,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={image} style={styles.image} />
      {/* <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      /> */}
      
      {/* {(points || multiplier) && (
        <View style={styles.pointsContainer}>
          <View style={styles.pointsPill}>
            <Text style={styles.pointsText}>{points}</Text>
          </View>
          <Text style={styles.multiplierText}>{multiplier}</Text>
        </View>
      )} */}

      <View style={styles.centerContent}>
        {isLive && (
          <Shadow
            distance={16}
            startColor={'#9BEC0040'}
            endColor={'#9BEC0000'}
            offset={[0, 0]}
          >
            <View style={styles.liveContainer}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </Shadow>
        )}

        {brandName && (
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
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 340,
    borderRadius: 4,
    backgroundColor: '#242620',
    position: 'relative',
    overflow: 'visible',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 4,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  pointsContainer: {
    position: 'absolute',
    top: -12,
    right: -16,
    backgroundColor: '#2F8EFF',
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
  pointsText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  multiplierText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 16,
    right: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242620',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#9BEC00',
    shadowColor: '#9BEC00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9BEC00',
    marginRight: 8,
  },
  liveText: {
    color: '#9BEC00',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242620CF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 26,
    gap: 6,
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
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ReemKufiFun-Regular',
  },
}); 