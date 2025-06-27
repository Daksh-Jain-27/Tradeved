import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

// --- ProgressCircle from Quest.tsx ---
const ProgressCircle = ({ progress }: { progress: number }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.progressCircleContainer}>
      <View style={styles.progressCircleOuter}>
        <Svg width={48} height={48}>
          <Circle
            cx={24}
            cy={24}
            r={radius}
            stroke="#83c602"
            strokeWidth={4}
            fill="#23251f"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={progressOffset}
            transform="rotate(-90 24 24)"
          />
        </Svg>
      </View>
      <View style={styles.progressCircleInner}>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    </View>
  );
};

// --- Mock Data ---
const calendarData = [
  // Each week is an array of days (mocked for July 2024)
  [
    { label: '1', pnt: 13200, trades: 7, color: '#a855f7' },
    { label: '2', pnt: 51600, trades: 2, color: '#bef264' },
    { label: '3', pnt: 43100, trades: 2, color: '#bef264' },
    { label: '4', pnt: 24500, trades: 1, color: '#fbcfe8' },
    { label: '5', pnt: 28300, trades: 2, color: '#fbcfe8' },
    { label: '6', pnt: 26000, trades: 7, color: '#a855f7' },
    { label: '7', pnt: 90100, trades: 1, color: '#f472b6' },
  ],
  [
    { label: '8', pnt: 16600, trades: 2, color: '#bef264' },
    { label: '9', pnt: 90100, trades: 2, color: '#bef264' },
    { label: '10', pnt: 34000, trades: 2, color: '#bef264' },
    { label: '11', pnt: 22000, trades: 1, color: '#fbcfe8' },
    { label: '12', pnt: 31300, trades: 2, color: '#fbcfe8' },
    { label: '13', pnt: 26000, trades: 7, color: '#a855f7' },
    { label: '14', pnt: 25100, trades: 1, color: '#bef264' },
  ],
  [
    { label: '15', pnt: 15100, trades: 2, color: '#bef264' },
    { label: '16', pnt: 43000, trades: 2, color: '#bef264' },
    { label: '17', pnt: 34000, trades: 2, color: '#bef264' },
    { label: '18', pnt: 32000, trades: 1, color: '#fbcfe8' },
    { label: '19', pnt: 32300, trades: 2, color: '#fbcfe8' },
    { label: '20', pnt: 38000, trades: 7, color: '#a855f7' },
    { label: '21', pnt: 25100, trades: 1, color: '#bef264' },
  ],
  [
    { label: '22', pnt: 15100, trades: 2, color: '#bef264' },
    { label: '23', pnt: 43000, trades: 2, color: '#bef264' },
    { label: '24', pnt: 34000, trades: 2, color: '#bef264' },
    { label: '25', pnt: 32000, trades: 1, color: '#fbcfe8' },
    { label: '26', pnt: 32300, trades: 2, color: '#fbcfe8' },
    { label: '27', pnt: 38000, trades: 7, color: '#a855f7' },
    { label: '28', pnt: 25100, trades: 1, color: '#bef264' },
  ],
  [
    { label: '29', pnt: 15100, trades: 2, color: '#bef264' },
    { label: '30', pnt: 43000, trades: 2, color: '#bef264' },
    { label: '31', pnt: 34000, trades: 2, color: '#bef264' },
    {}, {}, {}, {},
  ],
];

const barChartData = [
  { value: 12000, color: '#bef264' },
  { value: -8000, color: '#f472b6' },
  { value: 15000, color: '#bef264' },
  { value: 10000, color: '#bef264' },
  { value: -4000, color: '#f472b6' },
  { value: 18000, color: '#bef264' },
  { value: 9000, color: '#bef264' },
  { value: -6000, color: '#f472b6' },
  { value: 14000, color: '#bef264' },
  { value: 7000, color: '#bef264' },
  { value: -2000, color: '#f472b6' },
  { value: 16000, color: '#bef264' },
  { value: 11000, color: '#bef264' },
  { value: -3000, color: '#f472b6' },
  { value: 17000, color: '#bef264' },
  { value: 8000, color: '#bef264' },
  { value: -1000, color: '#f472b6' },
  { value: 15000, color: '#bef264' },
  { value: 12000, color: '#bef264' },
  { value: -5000, color: '#f472b6' },
  { value: 14000, color: '#bef264' },
  { value: 10000, color: '#bef264' },
  { value: -4000, color: '#f472b6' },
  { value: 18000, color: '#bef264' },
  { value: 9000, color: '#bef264' },
  { value: -6000, color: '#f472b6' },
  { value: 14000, color: '#bef264' },
  { value: 7000, color: '#bef264' },
  { value: -2000, color: '#f472b6' },
  { value: 16000, color: '#bef264' },
  { value: 11000, color: '#bef264' },
];

const tabs = [
  'Dashboard',
  'Add Trade data',
  'Saved Portfolio',
];

const filters = [
  'User Management',
  'Transaction Monitor',
  'Economic',
  'Security',
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Journal() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const [activeChartTab, setActiveChartTab] = useState(0);
  const router = useRouter();

  const handleTabPress = (i: number) => {
    setActiveTab(i);
    if (i === 1) {
      router.push('/journal/AddTradeData');
    }
  };

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
            onPress={() => handleTabPress(i)}
            activeOpacity={1}
          >
            <Text style={[styles.tabButtonText, i === activeTab && styles.tabButtonTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
        {filters.map((filter, i) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, i === activeFilter && styles.filterButtonActive]}
            onPress={() => setActiveFilter(i)}
          >
            <Text style={[styles.filterButtonText, i === activeFilter && styles.filterButtonTextActive]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Calendar + Chart */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Month Row */}
        <View style={styles.monthRow}>
          <Text style={styles.monthText}>July, 2024</Text>
          <Text style={styles.calendarIcon}>📅</Text>
        </View>
        {/* Weekdays */}
        <View style={styles.weekDaysRow}>
          {weekDays.map((d) => (
            <Text key={d} style={styles.weekDayText}>{d}</Text>
          ))}
        </View>
        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {calendarData.map((week, i) => (
            <View key={i} style={styles.calendarWeek}>
              {week.map((day, j) => day && day.label ? (
                <View key={j} style={[styles.calendarDay, { backgroundColor: day.color }]}> 
                  <Text style={styles.dayPnt}>{`₹${(day.pnt/1000).toFixed(1)}k`}</Text>
                  <Text style={styles.dayTrades}>{day.trades} Trades</Text>
                  <Text style={styles.dayLabel}>{day.label}</Text>
                </View>
              ) : (
                <View key={j} style={styles.calendarDayEmpty} />
              ))}
            </View>
          ))}
        </View>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.netPnlLabel}>Net PnL</Text>
              <Text style={styles.netPnlValue}>₹ 2,74,900</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <ProgressCircle progress={34} />
              <Text style={styles.winRateLabel}>Win %</Text>
              <Text style={styles.winRateValue}>34.02</Text>
            </View>
          </View>
          {/* Chart Tabs */}
          <View style={styles.chartTabsRow}>
            <TouchableOpacity onPress={() => setActiveChartTab(0)} style={[styles.chartTab, activeChartTab === 0 && styles.chartTabActive]}>
              <Text style={[styles.chartTabText, activeChartTab === 0 && styles.chartTabTextActive]}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveChartTab(1)} style={[styles.chartTab, activeChartTab === 1 && styles.chartTabActive]}>
              <Text style={[styles.chartTabText, activeChartTab === 1 && styles.chartTabTextActive]}>Cumulative</Text>
            </TouchableOpacity>
          </View>
          {/* Bar Chart */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            <Svg width={barChartData.length * 16} height={120}>
              {barChartData.map((bar, i) => (
                <Rect
                  key={i}
                  x={i * 16 + 4}
                  y={bar.value >= 0 ? 60 - bar.value / 400 : 60}
                  width={8}
                  height={Math.abs(bar.value) / 400}
                  fill={bar.color}
                  rx={2}
                />
              ))}
              {/* X axis */}
              <Rect x={0} y={60} width={barChartData.length * 16} height={2} fill="#444" />
            </Svg>
          </ScrollView>
          {/* Chart Footer */}
          <View style={styles.chartFooter}>
            <View>
              <Text style={styles.avgProfitLabel}>Avg. Profit Factor</Text>
              <Text style={styles.avgProfitValue}>1.44</Text>
            </View>
          </View>
        </View>
        {/* Footer */}
        <Text style={styles.dayWiseLabel}>Day Wise Breakup</Text>
        <Text style={styles.footerMonth}>March 2024</Text>
      </ScrollView>
      
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
  filtersRow: { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 8, backgroundColor: '#23251f', gap: 8 },
  filterButton: { backgroundColor: '#31332b', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  filterButtonActive: { backgroundColor: '#a3e635' },
  filterButtonText: { color: '#fff', fontSize: 13 },
  filterButtonTextActive: { color: '#23251f', fontWeight: 'bold' },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 8 },
  monthText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  calendarIcon: { fontSize: 20, color: '#a3e635' },
  weekDaysRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, marginTop: 8 },
  weekDayText: { color: '#a3a3a3', fontWeight: 'bold', fontSize: 13, flex: 1, textAlign: 'center' },
  calendarGrid: { marginTop: 4, paddingHorizontal: 8 },
  calendarWeek: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  calendarDay: { flex: 1, backgroundColor: '#a3e635', borderRadius: 8, marginHorizontal: 2, alignItems: 'center', paddingVertical: 4, minHeight: 54, justifyContent: 'space-between' },
  calendarDayEmpty: { flex: 1, marginHorizontal: 2, minHeight: 54 },
  dayPnt: { color: '#23251f', fontWeight: 'bold', fontSize: 13 },
  dayTrades: { color: '#23251f', fontSize: 11 },
  dayLabel: { color: '#23251f', fontWeight: 'bold', fontSize: 11, marginTop: 2 },
  chartSection: { backgroundColor: '#23251f', borderRadius: 16, margin: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  netPnlLabel: { color: '#a3a3a3', fontSize: 13 },
  netPnlValue: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  winRateLabel: { color: '#a3a3a3', fontSize: 11, marginTop: 4 },
  winRateValue: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  chartTabsRow: { flexDirection: 'row', marginTop: 8, gap: 8 },
  chartTab: { flex: 1, backgroundColor: '#31332b', borderRadius: 8, paddingVertical: 6, alignItems: 'center' },
  chartTabActive: { backgroundColor: '#a3e635' },
  chartTabText: { color: '#fff', fontWeight: '500', fontSize: 13 },
  chartTabTextActive: { color: '#23251f', fontWeight: 'bold' },
  chartFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  avgProfitLabel: { color: '#a3a3a3', fontSize: 13 },
  avgProfitValue: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  dayWiseLabel: { color: '#a3a3a3', fontSize: 13, marginLeft: 16, marginTop: 8 },
  footerMonth: { color: '#a3a3a3', fontSize: 13, marginLeft: 16, marginTop: 2 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#23251f', borderTopWidth: 1, borderTopColor: '#31332b', height: 64, alignItems: 'center', justifyContent: 'space-around' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  navItemActive: { },
  navIcon: { width: 24, height: 24, marginBottom: 2, resizeMode: 'contain' },
  navText: { color: '#a3a3a3', fontSize: 11 },
  navTextActive: { color: '#a3e635', fontWeight: 'bold' },
  // ProgressCircle styles
  progressCircleContainer: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  progressCircleOuter: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#23251f', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  progressCircleInner: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#23251f', position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  progressText: { fontSize: 10, fontWeight: '600', color: '#a3e635', textAlign: 'center' },
});
