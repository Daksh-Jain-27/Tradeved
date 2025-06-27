import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// --- Custom Components ---
const Progress = ({ value, style }: { value: number; style?: any }) => (
    <View style={[styles.progressTrack, style]}>
        <View style={[styles.progressIndicator, { width: `${value}%` }]} />
    </View>
);

const Badge = ({ children, style, textStyle }: { children: React.ReactNode; style?: any; textStyle?: any }) => (
    <View style={[styles.badge, style]}>
        <Text style={[styles.badgeText, textStyle]}>{children}</Text>
    </View>
);

// --- Interfaces and State ---
interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string; // Changed from React.ReactNode to string
  count: number;
  progress: number;
  color: string;
  textColor: string;
  unlockAt: number;
}

const initialPowerUps: PowerUp[] = [
    { id: "hint", name: "Hint", description: "Reveals one incorrect answer", icon: "zap", count: 2, progress: 60, color: '#FACC15', textColor: '#000', unlockAt: 5 },
    { id: "skip", name: "Skip", description: "Skip a question without penalty", icon: "arrow-right", count: 1, progress: 40, color: '#38BDF8', textColor: '#FFF', unlockAt: 5 },
    { id: "time", name: "Extra Time", description: "Adds 15 seconds to the timer", icon: "clock", count: 0, progress: 80, color: '#A3E635', textColor: '#000', unlockAt: 3 },
    { id: "xp", name: "2x XP", description: "Doubles XP earned in a duel", icon: "zap", count: 1, progress: 20, color: '#F87171', textColor: '#FFF', unlockAt: 7 },
];

export function PowerUpProgress() {
  const [powerUps, setPowerUps] = useState<PowerUp[]>(initialPowerUps);
  const [showPopup, setShowPopup] = useState(false);
  const [newPowerUp, setNewPowerUp] = useState<PowerUp | null>(null);

  // Simulate earning a power-up
  useEffect(() => {
    const timer = setTimeout(() => {
      setPowerUps(currentPowerUps => {
        const updatedPowerUps = [...currentPowerUps];
        const timeIndex = updatedPowerUps.findIndex((p) => p.id === "time");

        if (timeIndex !== -1 && updatedPowerUps[timeIndex].progress < 100) {
          const earnedPowerUp = {
            ...updatedPowerUps[timeIndex],
            progress: 100,
            count: updatedPowerUps[timeIndex].count + 1,
          };
          updatedPowerUps[timeIndex] = earnedPowerUp;

          setNewPowerUp(earnedPowerUp);
          setShowPopup(true);

          // Reset progress after animation
          setTimeout(() => {
            setPowerUps(prev => {
                const resetPowerUps = [...prev];
                resetPowerUps[timeIndex] = { ...resetPowerUps[timeIndex], progress: 0 };
                return resetPowerUps;
            });
          }, 3000);

          return updatedPowerUps;
        }
        return currentPowerUps;
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleInfoPress = () => {
      Alert.alert("How to get Power-ups", "Win consecutive duels to fill the progress bars and earn power-ups!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Power-ups</Text>
          <TouchableOpacity onPress={handleInfoPress} style={styles.infoButton}>
            <Icon name="info" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          {powerUps.map((powerUp) => (
            <View key={powerUp.id} style={styles.powerUpRow}>
              <View style={styles.powerUpInfo}>
                <Icon name={powerUp.icon} size={16} color={powerUp.color} style={{ marginRight: 8 }} />
                <Text style={styles.powerUpName}>{powerUp.name}</Text>
              </View>
              <Badge style={styles.powerUpCountBadge} textStyle={styles.powerUpCountText}>
                  {powerUp.count}
              </Badge>
              <View style={styles.progressContainer}>
                <Progress value={powerUp.progress} style={{ height: 6 }} />
                {/* Text on top of progress is tricky in RN without absolute positioning, simplified here */}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Power-up earned popup */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showPopup}
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.popupCard}>
                <View style={[styles.popupHeader, {backgroundColor: newPowerUp?.color}]}>
                    <Text style={[styles.popupHeaderText, {color: newPowerUp?.textColor}]}>Power-up Earned!</Text>
                </View>
                <View style={styles.popupContent}>
                    <View style={[styles.popupIconContainer, {backgroundColor: `${newPowerUp?.color}30`}]}>
                       {newPowerUp && <Icon name={newPowerUp.icon} size={24} color={newPowerUp.color} />}
                    </View>
                    <Text style={styles.popupTitle}>{newPowerUp?.name}</Text>
                    <Text style={styles.popupDescription}>{newPowerUp?.description}</Text>
                    <TouchableOpacity style={[styles.popupButton, {backgroundColor: newPowerUp?.color}]} onPress={() => setShowPopup(false)}>
                        <Text style={[styles.popupButtonText, {color: newPowerUp?.textColor}]}>Awesome!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  card: { backgroundColor: '#1F2937', borderRadius: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  infoButton: { padding: 4 },
  cardContent: { padding: 16, paddingTop: 8, gap: 16 },
  powerUpRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  powerUpInfo: { flexDirection: 'row', alignItems: 'center', flex: 2 },
  powerUpName: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  powerUpCountBadge: { backgroundColor: '#374151', borderWidth: 1, borderColor: '#4B5563'},
  powerUpCountText: { color: '#D1D5DB' },
  progressContainer: { flex: 3 },
  progressTrack: { backgroundColor: '#374151', borderRadius: 999, width: '100%', overflow: 'hidden' },
  progressIndicator: { backgroundColor: '#A3E635', height: '100%' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  badgeText: { fontSize: 12 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 40 },
  popupCard: { backgroundColor: '#1F2937', borderRadius: 12, overflow: 'hidden', width: '100%', borderWidth: 2, borderColor: '#A3E635' },
  popupHeader: { padding: 8 },
  popupHeaderText: { textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  popupContent: { padding: 16, alignItems: 'center' },
  popupIconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  popupTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  popupDescription: { color: '#9CA3AF', textAlign: 'center', marginVertical: 8, marginBottom: 16 },
  popupButton: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  popupButtonText: { fontWeight: 'bold' }
}); 