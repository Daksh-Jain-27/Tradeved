import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { LineChart } from 'react-native-gifted-charts';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

interface GaugeCardProps {
  title: string;
  correct: number;
  wrong: number;
}

const SemicircleGauge: React.FC<{ correct: number; wrong: number }> = ({ correct, wrong }) => {
  const total = correct + wrong;
  const correctPercent = total > 0 ? (correct / total) * 100 : 0;

  return (
    <View style={styles.gaugeContainer}>
      <AnimatedCircularProgress
        size={100}
        width={12}
        fill={correctPercent}
        tintColor="#2ecc40"
        backgroundColor="#ff4136"
        arcSweepAngle={180}
        rotation={270}
        lineCap="round"
      >
        {() => (
          <Text style={styles.percentText}>
            {Math.round(correctPercent)}%
          </Text>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

const GaugeCard: React.FC<GaugeCardProps> = ({ title, correct, wrong }) => (
  <View style={styles.card1}>
    <View style={styles.cardHeader1}>
      <Text style={styles.cardTitle1}>{title}</Text>
      <TouchableOpacity style={styles.dropdown1}>
        <Text style={styles.dropdownText1}>Weekly</Text>
        <MaterialIcons name="arrow-drop-down" size={16} color="#555151" />
      </TouchableOpacity>
    </View>
    
    <SemicircleGauge correct={correct} wrong={wrong} />
    
    <View style={styles.legendRow}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: '#2ecc40' }]} />
        <Text style={styles.legendText}>Correct</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: '#ff4136' }]} />
        <Text style={styles.legendText}>Wrong</Text>
      </View>
    </View>
  </View>
);

const avatarUri = 'https://randomuser.me/api/portraits/women/44.jpg';

// Add interface for tooltip item
interface TooltipItem {
  value: number;
  dataPointText?: string;
  label?: string;
  showPointer?: boolean;
  pointer?: any;
}

export default function Home() {
  const [tooltipData] = useState({
    Monday: 0,
    Tuesday: 0,
    Wednesday: 123,
    Thursday: 23098,
    Friday: 12,
    Saturday: 1,
    Sunday: 45908
  });

  const chartData = [
    { value: 10, label: 'Week 1' },
    { value: 58, label: 'Week 2' },
    { value: 68, label: 'Week 3' },
    { value: 88, label: 'Week 4' }
  ];

  const CustomTooltip = (item: TooltipItem) => {
    return (
      <View style={styles.tooltipContainer}>
        <Text style={styles.tooltipTitle}>Graph Info</Text>
        <View style={styles.tooltipContent}>
          <Text style={styles.tooltipItem}>Monday: {tooltipData.Monday}</Text>
          <Text style={styles.tooltipItem}>Tuesday: {tooltipData.Tuesday}</Text>
          <Text style={styles.tooltipItem}>Wednesday: {tooltipData.Wednesday}</Text>
          <Text style={styles.tooltipItem}>Thursday: {tooltipData.Thursday}</Text>
          <Text style={styles.tooltipItem}>Friday: {tooltipData.Friday}</Text>
          <Text style={styles.tooltipItem}>Saturday: {tooltipData.Saturday}</Text>
          <Text style={styles.tooltipItem}>Sunday: {tooltipData.Sunday}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image
          source={require('../../assets/images/Tradeved-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Link href="/quests/profile" asChild>
          <TouchableOpacity style={styles.profileButton}>
            <Image
              source={require('../../assets/images/profile.png')}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>
        <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 10 }}>Good morning, Mona{'\n'}</Text>
        Let's matter one strategy today!
      </Text>

      {/* Streak and Rank */}
      <View style={styles.streakRow}>
        <View style={styles.pillBadge}>
          <Text style={styles.pillText}>Streak</Text>
          <Image
            source={require('../../assets/images/fire.png')}
            style={styles.statIcon}
            resizeMode="contain"
          />
          <Text style={[styles.pillText, { marginLeft: 8 }]}>|</Text>
          <Text style={[styles.pillText, { marginLeft: 8 }]}>Your rank 7</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your learning progress</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Weekly</Text>
            <MaterialIcons name="arrow-drop-down" size={18} color="#555151" />
          </TouchableOpacity>
        </View>
        <View style={styles.remarksContainer}>
          <Text style={styles.remarks}>Remarks: Your progress is increasing per day</Text>
        </View>
        <View style={styles.graphContainer}>
          {/* Y-axis label */}
          <View style={styles.yAxisLabel}>
            <Text style={styles.axisText}>Points</Text>
            <View style={styles.arrowUp} />
          </View>

          {/* Chart Container */}
          <View style={styles.chartWrapper}>
            <LineChart
              data={chartData}
              width={width - 120}
              height={238}
              maxValue={100}
              noOfSections={10}
              spacing={60}
              thickness={3}
              color="white"
              dataPointsColor="white"
              dataPointsRadius={6}
              backgroundColor="transparent"
              rulesColor="#444"
              rulesType="solid"
              xAxisColor="#444"
              yAxisColor="#444"
              yAxisTextStyle={styles.yAxisTextStyle}
              xAxisLabelTextStyle={styles.xAxisTextStyle}
              showVerticalLines
              verticalLinesColor="#444"
              isAnimated
              animationDuration={1000}
              initialSpacing={20}
              endSpacing={-20}
              yAxisLabelWidth={30}
              xAxisLabelsVerticalShift={0}
              hideYAxisText={false}
              hideAxesAndRules={false}
              adjustToWidth
              stepHeight={23.6}
              yAxisOffset={0}
              pointerConfig={{
                pointerStripUptoDataPoint: true,
                pointerStripColor: 'white',
                pointerStripWidth: 2,
                strokeDashArray: [2, 5],
                pointerColor: 'white',
                radius: 6,
                pointerLabelComponent: CustomTooltip,
                activatePointersOnLongPress: false,
                autoAdjustPointerLabelPosition: true,
                pointerLabelWidth: 140,
                pointerLabelHeight: 120,
              }}
            />
          </View>

          {/* X-axis labels and arrow */}
          
            <View style={styles.xAxisArrow}>
              <Text style={styles.xAxisLabel}>No. of Week</Text>
              <View style={styles.arrowRight} />
            </View>
          
        </View>
      </View>

      <View style={styles.row1}>
        <GaugeCard title="Quests" correct={75} wrong={25} />
        <GaugeCard title="Quiz" correct={60} wrong={40} />
      </View>

      {/* Journal and Paper Trades */}
      <View style={styles.row}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Journal</Text>
            <TouchableOpacity style={styles.dropdownSmall}>
              <Text style={styles.dropdownTextSmall}>Weekly</Text>
              <MaterialIcons name="arrow-drop-down" size={12} color="#555151" />
            </TouchableOpacity>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total journal entries</Text>
              <Text style={styles.statValue}>220</Text>
            </View>
            <View style={styles.subStatsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Brokers added</Text>
                <Text style={styles.statValue}>2</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Csv file added</Text>
                <Text style={styles.statValue}>5</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Paper Trades</Text>
            <TouchableOpacity style={styles.dropdownSmall}>
              <Text style={styles.dropdownTextSmall}>Weekly</Text>
              <MaterialIcons name="arrow-drop-down" size={12} color="#555151" />
            </TouchableOpacity>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Available balance</Text>
              <Text style={styles.statValue}>2,00,000</Text>
            </View>
            <View style={styles.subStatsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Current value</Text>
                <Text style={styles.statValue}>2,00,000</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Invested value</Text>
                <Text style={styles.statValue}>2,00,000</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          <Text style={styles.footerBold}>Learning </Text> <Text style={{ color: '#aaaaaa', fontSize: 40 }}>is a</Text>{'\n'}
          <Text style={styles.footerBold}>lifelong</Text> <Text style={{ color: '#aaaaaa', fontSize: 40 }}>process</Text> <Text style={styles.heart}>♥</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181D18',
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  logo: {
    width: 37,
    height: 37,
    marginRight: 10,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  card1: {
    backgroundColor: '#232823',
    borderRadius: 12,
    padding: 16,
    width: (width - 48) / 2,
    alignItems: 'center',
  },
  cardHeader1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  cardTitle1: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdown1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dafe96',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dropdownText1: {
    color: '#555151',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 2,
  },
  gaugeContainer: {
    marginVertical: 8,
  },
  percentText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: -28,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    color: '#aaa',
    fontSize: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#333',
  },
  greeting: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 10,
    marginTop: 20,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DAFE96',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statIcon: {
    width: 14,
    height: 14,
    marginLeft: 4,
  },
  pillText: {
    color: '#555151',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#232823',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdown: {
    backgroundColor: '#DAFE96',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#555151',
    fontSize: 13,
    marginRight: 4,
  },
  remarksContainer: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  remarks: {
    color: '#fafafa',
    fontSize: 12,
    backgroundColor: '#32332F',
    padding: 6,
    borderRadius: 4,
  },
  graphContainer: {
    height: 290,
    marginTop: 8, // Add padding for X-axis label
  },
  yAxisLabel: {
    alignItems: 'center',
    marginLeft: -325,
    marginTop: -30,
  },
  axisText: {
    color: '#fff',
    fontSize: 12,
    transform: [{ rotate: '-90deg' }],
    position: 'absolute',
    top: 140,
    // width: 100,
  },
  arrowUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    position: 'absolute',
    top: 115,
    left: '50%',
    transform: [{ translateX: -3 }],
  },
  chartWrapper: {
    flex: 1,
    marginLeft: 20,
    marginTop: 20,
    position: 'relative',
    height: 260,
  },
  yAxisTextStyle: {
    color: '#aaa',
    fontSize: 11,
    marginRight: 5,
  },
  xAxisTextStyle: {
    color: '#aaa',
    fontSize: 11,
  },
  xAxisContainer: {
    marginTop: 8,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 60,
    paddingRight: 40,
  },
  xAxisText: {
    color: '#aaa',
    fontSize: 11,
  },
  xAxisArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  xAxisLabel: {
    color: '#fff',
    fontSize: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  arrowRight: {
    width: 0,
    height: 0,
    marginTop: -3,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#fff',
  },
  // Tooltip styles
  tooltipContainer: {
    backgroundColor: '#FFFF99',
    borderRadius: 8,
    padding: 12,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  tooltipContent: {
    gap: 4,
  },
  tooltipItem: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '500',
  },
  // Existing styles continue...
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#222222',
    borderRadius: 4,
    padding: 10,
    paddingHorizontal: 4,
    width: (width - 48) / 2,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  dropdownSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dafe96',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  dropdownTextSmall: {
    color: '#555151',
    fontSize: 11,
    marginRight: -2,
  },
  gaugeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  gaugeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gaugeLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  statsContainer: {
    gap: 8,
  },
  statRow: {
    backgroundColor: '#32332F',
    borderRadius: 4,
    padding: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#32332F',
    borderRadius: 4,
    padding: 3,
  },
  statLabel: {
    color: '#fff',
    fontSize: 11,
  },
  statValue: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    marginLeft: 10,
  },
  footerText: {
    color: '#fff',
    fontSize: 22,
    lineHeight: 55,
  },
  footerBold: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 45,
  },
  heart: {
    color: '#ff4136',
    fontSize: 30,
  },
});
