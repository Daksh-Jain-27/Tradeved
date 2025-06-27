import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tabs = [
  'Dashboard',
  'Add Trade data',
  'Saved Portfolio',
];

const csvProviders = [
  'CSV Provider',
  'Zerodha',
  'Upstox',
  'Angel One',
];

export default function AddTradeData() {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(csvProviders[0]);

  return (
    <View style={{ flex: 1, backgroundColor: '#23251f' }}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/TradeVed LOGO.png')} style={styles.logo} />
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchInput}>Search tags</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image source={require('../../assets/images/profile.png')} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, i === activeTab && styles.tabButtonActive]}
            onPress={() => setActiveTab(i)}
            activeOpacity={1}
          >
            <Text style={[styles.tabButtonText, i === activeTab && styles.tabButtonTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upload CSV Section */}
      <View style={styles.uploadSection}>
        <Text style={styles.uploadTitle}>Upload CSV</Text>
        <Text style={styles.label}>Select CSV Provider</Text>
        <View style={styles.pickerWrapper}>
          {Platform.OS === 'android' ? (
            <Picker
              selectedValue={selectedProvider}
              onValueChange={setSelectedProvider}
              style={styles.picker}
              dropdownIconColor="#a3a3a3"
            >
              {csvProviders.map((provider) => (
                <Picker.Item key={provider} label={provider} value={provider} />
              ))}
            </Picker>
          ) : (
            <TouchableOpacity style={styles.pickerFake}>
              <Text style={styles.pickerFakeText}>{selectedProvider}</Text>
              <Text style={styles.pickerFakeIcon}>▼</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.fileFormat}>File format: CSV, .xlsx, file size 1 mb</Text>
        <View style={styles.dropZone}>
          <Text style={styles.dropZoneIcon}>📄</Text>
          <Text style={styles.dropZoneText}>Drag and drop file from computer</Text>
        </View>
        <TouchableOpacity style={styles.uploadBtn}>
          <Text style={styles.uploadBtnText}>Upload Now</Text>
        </TouchableOpacity>
        <View style={styles.infoNote}>
          <Text style={styles.infoNoteText}>Connect Broker and Manual data uploading feature will be live soon</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 16,
    backgroundColor: '#23251f',
    height: 80,
  },
  logo: { width: 48, height: 32, resizeMode: 'contain' },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#31332b',
    borderRadius: 8,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 36,
  },
  searchIcon: { fontSize: 16, color: '#a3a3a3', marginRight: 8 },
  searchInput: { color: '#a3a3a3', fontSize: 14 },
  profileButton: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden', backgroundColor: '#31332b', alignItems: 'center', justifyContent: 'center' },
  profileImage: { width: 32, height: 32, borderRadius: 16 },
  tabsRow: { flexDirection: 'row', backgroundColor: '#23251f', paddingHorizontal: 8, paddingTop: 8, gap: 8 },
  tabButton: { flex: 1, backgroundColor: '#31332b', borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginHorizontal: 2 },
  tabButtonActive: { backgroundColor: '#a3e635' },
  tabButtonText: { color: '#fff', fontWeight: '500', fontSize: 14 },
  tabButtonTextActive: { color: '#23251f' },
  uploadSection: { margin: 24, backgroundColor: 'transparent' },
  uploadTitle: { color: '#fff', fontWeight: 'bold', fontSize: 20, marginBottom: 24 },
  label: { color: '#a3a3a3', fontSize: 14, marginBottom: 8 },
  pickerWrapper: { borderWidth: 1, borderColor: '#a3a3a3', borderRadius: 6, marginBottom: 16, overflow: 'hidden' },
  picker: { color: '#fff', backgroundColor: '#23251f', height: 40 },
  pickerFake: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, height: 40 },
  pickerFakeText: { color: '#a3a3a3', fontSize: 14 },
  pickerFakeIcon: { color: '#a3a3a3', fontSize: 14 },
  fileFormat: { color: '#a3a3a3', fontSize: 13, marginBottom: 8 },
  dropZone: { borderWidth: 1, borderColor: '#a3a3a3', borderRadius: 6, height: 90, alignItems: 'center', justifyContent: 'center', marginBottom: 24, backgroundColor: 'transparent' },
  dropZoneIcon: { fontSize: 28, color: '#a3a3a3', marginBottom: 4 },
  dropZoneText: { color: '#a3a3a3', fontSize: 14 },
  uploadBtn: { backgroundColor: '#a3e635', borderRadius: 6, paddingVertical: 14, alignItems: 'center', marginTop: 8, marginBottom: 16 },
  uploadBtnText: { color: '#23251f', fontWeight: 'bold', fontSize: 16 },
  infoNote: { backgroundColor: '#31332b', borderRadius: 4, padding: 10, marginTop: 8 },
  infoNoteText: { color: '#fff', fontSize: 13 },
}); 