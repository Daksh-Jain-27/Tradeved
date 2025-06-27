import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// --- MOCK DATA ---
const useUserLevel = () => 24; // Mock hook to get user level

const avatars = [
  { id: "default", src: "https://i.pravatar.cc/150?u=default", unlocked: true },
  { id: "trader1", src: "https://i.pravatar.cc/150?u=trader1", unlocked: true },
  { id: "trader2", src: "https://i.pravatar.cc/150?u=trader2", unlocked: false, unlocksAt: "Level 10" },
  { id: "trader3", src: "https://i.pravatar.cc/150?u=trader3", unlocked: false, unlocksAt: "Premium" },
];

const frames = [
  { id: "default", name: "Default", color: "#4B5563", unlocked: true },
  { id: "gold", name: "Gold", color: "#FACC15", unlocked: true },
  { id: "diamond", name: "Diamond", color: "#38BDF8", unlocked: false, unlocksAt: "Level 15" },
  { id: "elite", name: "Elite", color: "#F87171", unlocked: false, unlocksAt: "Premium" },
];

const themes = [
  { id: "dark", name: "Dark", primary: "#A3E635", bg: "#1F2937", unlocked: true },
  { id: "light", name: "Light", primary: "#A3E635", bg: "#FFFFFF", unlocked: true },
  { id: "midnight", name: "Midnight", primary: "#38BDF8", bg: "#0F172A", unlocked: false, unlocksAt: "Level 20" },
  { id: "sunset", name: "Sunset", primary: "#F472B6", bg: "#4C1D95", unlocked: false, unlocksAt: "Premium" },
];

// --- MAIN COMPONENT ---
export function ProfileCustomization() {
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0].src);
  const [selectedFrameId, setSelectedFrameId] = useState(frames[0].id);
  const [selectedThemeId, setSelectedThemeId] = useState(themes[0].id);
  const [activeTab, setActiveTab] = useState('avatar');
  const userLevel = useUserLevel();

  const selectedFrameColor = frames.find(f => f.id === selectedFrameId)?.color || '#4B5563';

  const renderAvatars = () => (
    <View style={styles.gridContainer}>
      {avatars.map(avatar => (
        <View key={avatar.id} style={styles.gridItem}>
          <TouchableOpacity
            disabled={!avatar.unlocked}
            onPress={() => setSelectedAvatar(avatar.src)}
            style={[styles.avatarOption, { borderColor: selectedAvatar === avatar.src ? '#A3E635' : '#4B5563' }]}
          >
            <Image source={{ uri: avatar.src }} style={styles.avatarImage} />
            {!avatar.unlocked && (
              <View style={styles.lockOverlay}>
                <Icon name="lock" size={20} color="#FFF" />
              </View>
            )}
            {selectedAvatar === avatar.src && (
              <View style={styles.checkBadge}>
                <Icon name="check" size={12} color="#000" />
              </View>
            )}
          </TouchableOpacity>
          {!avatar.unlocked && <Text style={styles.unlocksAtText}>{avatar.unlocksAt}</Text>}
        </View>
      ))}
    </View>
  );

  const renderFrames = () => (
    <View style={styles.gridContainerFrames}>
      {frames.map(frame => (
        <TouchableOpacity
          key={frame.id}
          disabled={!frame.unlocked}
          onPress={() => setSelectedFrameId(frame.id)}
          style={[
            styles.frameOption,
            {
              borderColor: selectedFrameId === frame.id ? '#A3E635' : '#4B5563',
              backgroundColor: selectedFrameId === frame.id ? 'rgba(163, 230, 53, 0.05)' : 'transparent'
            },
            !frame.unlocked && { opacity: 0.6 }
          ]}
        >
          <View style={styles.framePreview}>
            <Image source={{ uri: avatars[0].src }} style={[styles.framePreviewAvatar, { borderColor: frame.color }]} />
            <View>
              <Text style={styles.frameName}>{frame.name}</Text>
              {!frame.unlocked && <Text style={styles.unlocksAtTextSmall}>{frame.unlocksAt}</Text>}
            </View>
          </View>
          {!frame.unlocked && (
            <View style={styles.lockIconTopRight}><Icon name="lock" size={16} color="#FFF" /></View>
          )}
          {selectedFrameId === frame.id && (
            <View style={styles.checkBadge}><Icon name="check" size={12} color="#000" /></View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderThemes = () => (
    <View style={styles.gridContainerFrames}>
        {themes.map(theme => (
             <TouchableOpacity
                key={theme.id}
                disabled={!theme.unlocked}
                onPress={() => setSelectedThemeId(theme.id)}
                style={[
                    styles.themeOption,
                    { 
                        borderColor: selectedThemeId === theme.id ? '#A3E635' : '#4B5563',
                        backgroundColor: theme.bg
                    },
                     !theme.unlocked && { opacity: 0.6 }
                ]}
            >
                <View style={styles.themeContent}>
                    <View style={styles.themeHeader}>
                        <Text style={[styles.themeName, {color: theme.bg === '#FFFFFF' ? '#000' : '#FFF'}]}>{theme.name}</Text>
                        <View style={[styles.themeColorSwatch, {backgroundColor: theme.primary}]} />
                    </View>
                    <View style={styles.themeBarContainer}>
                        <View style={[styles.themeBar, {width: 40, backgroundColor: theme.primary, opacity: 0.2}]} />
                        <View style={[styles.themeBar, {width: 20, backgroundColor: theme.primary, opacity: 0.4}]} />
                    </View>
                </View>
                 {!theme.unlocked && (
                  <View style={styles.lockOverlayCentered}>
                    <Icon name="lock" size={24} color="#FFF" />
                    <Text style={[styles.unlocksAtText, {marginTop: 4}]}>{theme.unlocksAt}</Text>
                  </View>
                )}
                {selectedThemeId === theme.id && (
                    <View style={styles.checkBadge}><Icon name="check" size={12} color="#000" /></View>
                )}
            </TouchableOpacity>
        ))}
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Customize Profile</Text>

      {/* Preview Section */}
      <View style={styles.previewContainer}>
        <View style={[styles.previewAvatarContainer, { borderColor: selectedFrameColor }]}>
          <Image source={{ uri: selectedAvatar }} style={styles.previewAvatar} />
        </View>
        <View style={styles.previewBadge}>
          <Text style={styles.previewBadgeText}>Level {userLevel}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsList}>
            <TouchableOpacity style={[styles.tabTrigger, activeTab === 'avatar' && styles.activeTab]} onPress={() => setActiveTab('avatar')}>
                <Text style={[styles.tabText, activeTab === 'avatar' && styles.activeTabText]}>Avatar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabTrigger, activeTab === 'frame' && styles.activeTab]} onPress={() => setActiveTab('frame')}>
                <Text style={[styles.tabText, activeTab === 'frame' && styles.activeTabText]}>Frame</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabTrigger, activeTab === 'theme' && styles.activeTab]} onPress={() => setActiveTab('theme')}>
                <Text style={[styles.tabText, activeTab === 'theme' && styles.activeTabText]}>Theme</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.tabContent}>
            {activeTab === 'avatar' && renderAvatars()}
            {activeTab === 'frame' && renderFrames()}
            {activeTab === 'theme' && renderThemes()}
        </View>
      </View>
      
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#1F2937', borderRadius: 12, padding: 16 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 24 },
    previewContainer: { alignItems: 'center', marginBottom: 24 },
    previewAvatarContainer: { borderWidth: 4, borderRadius: 999 },
    previewAvatar: { width: 96, height: 96, borderRadius: 48 },
    previewBadge: { position: 'absolute', bottom: -10, backgroundColor: '#A3E635', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
    previewBadgeText: { color: '#000', fontSize: 12, fontWeight: 'bold' },
    tabsContainer: { width: '100%', marginBottom: 24 },
    tabsList: { flexDirection: 'row', backgroundColor: '#374151', borderRadius: 8, padding: 4 },
    tabTrigger: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
    activeTab: { backgroundColor: '#4B5563' },
    tabText: { color: '#D1D5DB' },
    activeTabText: { color: '#FFF' },
    tabContent: { marginTop: 16 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
    gridItem: { alignItems: 'center', width: '25%', marginBottom: 16 },
    avatarOption: { borderWidth: 2, borderRadius: 999, position: 'relative' },
    avatarImage: { width: 64, height: 64, borderRadius: 32 },
    checkBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#A3E635', borderRadius: 999, padding: 4 },
    lockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17, 24, 39, 0.7)', justifyContent: 'center', alignItems: 'center', borderRadius: 32 },
    unlocksAtText: { color: '#9CA3AF', fontSize: 12, textAlign: 'center', marginTop: 4 },
    unlocksAtTextSmall: { color: '#9CA3AF', fontSize: 12 },
    gridContainerFrames: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    frameOption: { position: 'relative', width: '48%', padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 12 },
    framePreview: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    framePreviewAvatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 3 },
    frameName: { color: '#FFF', fontWeight: '500' },
    lockIconTopRight: { position: 'absolute', top: 8, right: 8 },
    themeOption: { position: 'relative', width: '48%', height: 96, borderWidth: 1, borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
    themeContent: { flex: 1, padding: 12, justifyContent: 'space-between' },
    themeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    themeName: { fontWeight: '500' },
    themeColorSwatch: { width: 16, height: 16, borderRadius: 8 },
    themeBarContainer: { flexDirection: 'row', gap: 4 },
    themeBar: { height: 8, borderRadius: 4 },
    lockOverlayCentered: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17, 24, 39, 0.7)', justifyContent: 'center', alignItems: 'center' },
    saveButton: { backgroundColor: '#A3E635', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    saveButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
}); 