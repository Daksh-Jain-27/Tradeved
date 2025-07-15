import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Header } from '../../components/Header';

const screenWidth = Dimensions.get('window').width;

interface StyleProps {
  container: ViewStyle;
  content: ViewStyle;
  titleRow: ViewStyle;
  titleText: TextStyle;
  learnMoreButton: ViewStyle;
  learnMoreButtonText: TextStyle;
  tabContainer: ViewStyle;
  tab: ViewStyle;
  selectedTab: ViewStyle;
  tabText: TextStyle;
  selectedTabText: TextStyle;
  disclaimerContainer: ViewStyle;
  warningIcon: ViewStyle;
  warningText: TextStyle;
  disclaimerText: TextStyle;
  readMoreText: TextStyle;
  congratulationsOverlay: ViewStyle;
  congratulationsModal: ViewStyle;
  congratulationsTitle: TextStyle;
  congratulationsText: TextStyle;
  moveToLevel2Button: ViewStyle;
  moveToLevel2ButtonText: TextStyle;
  [key: string]: ViewStyle | TextStyle;
}

interface TutorialOverlayProps {
  visible: boolean;
  onClose: () => void;
  onMoveToQuest: () => void;
}

interface PaperTradingGuideProps {
  visible: boolean;
  onClose: () => void;
  onStartBeginner: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ visible, onClose, onMoveToQuest }) => {
  const [animation] = useState(new Animated.Value(0));
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setShowCongrats(false);
    }
  }, [visible]);

  if (!visible) return null;

  const handleNext = () => {
    setShowCongrats(true);
  };

  return (
    <View style={styles.tutorialContainer}>
      <BlurView intensity={40} style={StyleSheet.absoluteFill} tint="dark">
        {!showCongrats ? (
          <>
            <View style={[styles.searchHighlight, { top: 40 }]} />
            
            <Animated.View 
              style={[
                styles.tutorialContent,
                {
                  opacity: animation,
                  transform: [{
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0]
                    })
                  }]
                }
              ]}
            >
              <View style={styles.tutorialHeader}>
                <Text style={styles.tutorialTitle}>Searching Instruments</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.tutorialDescription}>
                Instruments refer to the various assets that can be bought, sold, or traded in financial markets.
              </Text>
              
              <Text style={styles.tutorialInstructions}>
                Type Nifty50 in search Instruments and select {'>'}You'll see trade data and chart of that instrument
              </Text>
              
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        ) : (
          <View style={styles.congratsContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.congratsTitle}>Congratulations !!</Text>
            <Text style={styles.congratsText}>
              You have performed the activity for level 1 {'\n'}
              Please answer the {'\n'}
              questions in quest to complete level 1 and {'\n'}
              move to level 2
            </Text>
            <TouchableOpacity style={styles.moveToQuestButton} onPress={onMoveToQuest}>
              <Text style={styles.moveToQuestButtonText}>Move to Quest</Text>
            </TouchableOpacity>
          </View>
        )}
      </BlurView>
    </View>
  );
};

const PaperTradingGuide: React.FC<PaperTradingGuideProps> = ({ visible, onClose, onStartBeginner }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.8)']}
        style={styles.modalOverlayGradient}
      >
        <BlurView intensity={40} style={styles.modalOverlay} tint="default">
          <View style={styles.modalContent}>
            {/* Header with close button */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Ionicons name="book-outline" size={20} color="#9BEC00" />
                <Text style={styles.modalTitle}>Paper Trading Guide</Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={styles.modalCloseButton}
              >
                <View style={styles.whiteCircle}>
                  <Ionicons name="close" size={16} color="#242620" />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollContainer}>
              {/* Welcome Text */}
              <Text style={styles.modalHeaderSubtitle}>
                This is a paper trading platform, so no actual money is involved—your trades are simulated, ensuring a risk-free learning experience.
              </Text>
              <Text style={styles.modalProceedText}>Here's How We'll Proceed:</Text>

              {/* Timeline Container */}
              <View style={styles.timelineContainer}>
                {/* Beginner Level */}
                <View style={styles.levelContainer}>
                  <View style={styles.circleContainer}>
                    <View style={styles.circle}>
                      <Text style={styles.circleNumber}>1</Text>
                    </View>
                    <View style={styles.verticalLine} />
                  </View>
                  <View style={styles.contentContainer}>
                    <Text style={styles.levelTitle}>Beginner Level</Text>
                    <Text style={styles.levelDescription}>
                      Searching Instruments, Markets, Understanding Jargon, Concept of OHLC.
                    </Text>
                  </View>
                </View>

                {/* Intermediate Level */}
                <View style={styles.levelContainer}>
                  <View style={styles.circleContainer}>
                    <View style={styles.circle}>
                      <Text style={styles.circleNumber}>2</Text>
                    </View>
                    <View style={styles.verticalLine} />
                  </View>
                  <View style={styles.contentContainer}>
                    <Text style={styles.levelTitle}>Intermediate Level</Text>
                    <Text style={styles.levelDescription}>
                      Drawing Charts, Indicators, Understand greek option trading, placing trades.
                    </Text>
                  </View>
                </View>

                {/* Advanced Level */}
                <View style={styles.levelContainer}>
                  <View style={styles.circleContainer}>
                    <View style={styles.circle}>
                      <Text style={styles.circleNumber}>3</Text>
                    </View>
                  </View>
                  <View style={styles.contentContainer}>
                    <Text style={styles.levelTitle}>Advanced Level (coming soon)</Text>
                    <Text style={styles.levelDescription}>
                      Scenario based large judgement.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Note */}
              <View style={styles.noteContainer}>
                <Text style={styles.noteTitle}>NOTE:</Text>
                <Text style={styles.noteText}>
                  Some advanced features will be unlocked only when necessary, ensuring a smooth learning curve. Each level will start with a small task/test to check your understanding. Feel free to skip to the level that suits your experience.
                </Text>
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
                  <Text style={styles.secondaryButtonText}>Start Intermediate Level now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={onStartBeginner}>
                  <Text style={styles.primaryButtonText}>Start Beginner Level now</Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </View>
        </BlurView>
      </LinearGradient>
    </Modal>
  );
};

const tradingPlatformStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  stockInfo: {
    marginBottom: 15,
  },
  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  redSquare: {
    width: 16,
    height: 16,
    backgroundColor: '#ff6384',
    marginRight: 8,
  },
  stockName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  nfoText: {
    color: '#9bec00',
    fontSize: 12,
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPrice: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  priceChange: {
    color: '#9bec00',
    fontSize: 14,
    fontWeight: '500',
  },
  priceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  priceDetailText: {
    color: '#888',
    fontSize: 14,
  },
  timeTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  timeTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  activeTimeTab: {
    backgroundColor: '#9bec00',
  },
  timeTabText: {
    color: '#888',
    fontSize: 12,
  },
  activeTimeTabText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  orderBookSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  orderBookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  tabText: {
    color: '#888',
    fontSize: 14,
  },
  activeTabText: {
    color: '#f2f3f7',
    fontSize: 14,
  },
  actionButtons1: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#f2f3f7',
    fontSize: 12,
    fontWeight: '500',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  tableHeaderText: {
    color: '#888',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  tableRowAlternate: {
    backgroundColor: '#2a2a2a',
  },
  bidText: {
    color: '#ff4444',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  askText: {
    color: '#4CAF50',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  normalText: {
    color: '#f2f3f7',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    marginTop: 8,
  },
  tradingSection: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  tradingTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  controlsContainer: {
    gap: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overnightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  overnightText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  nrmlText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  buyToggle: {
    backgroundColor: 'rgba(155, 236, 0, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buyToggleText: {
    color: '#9bec00',
    fontSize: 14,
  },
  toggleCircle: {
    width: 18,
    height: 18,
    backgroundColor: '#9bec00',
    borderRadius: 9,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  inputSubLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  radioCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#9bec00',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9bec00',
  },
  radioText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
  },
  radioTextSelected: {
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  buyButton: {
    flex: 1,
    backgroundColor: 'rgba(155, 236, 0, 0.15)',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  sellButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#9bec00',
    fontSize: 16,
    fontWeight: '500',
  },
  sellButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: '500',
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -25,
  },
  footerItem: {
    flexDirection: 'row',
    gap: 4,
  },
  footerLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
  },
  footerValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  chartContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#1a1a1a',
    marginVertical: 16,
  },
  tradingGraph: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

const DashboardView = () => {
  // Sample data for the chart
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        data: [25000, 25100, 25300, 25200, 25400, 26300],
        strokeWidth: 2,
      },
    ],
  };

  // Sample investment data
  const investments: Array<{ name: string; amount: string; isHeader: boolean }> = [
    { name: 'Commodity name', amount: 'Amount (Rs.)', isHeader: true },
    { name: 'Commodity name', amount: 'Amount (Rs.)', isHeader: false },
    { name: 'Commodity name', amount: 'Amount (Rs.)', isHeader: false },
    { name: 'Commodity name', amount: 'Amount (Rs.)', isHeader: false },
    { name: 'Commodity name', amount: 'Amount (Rs.)', isHeader: false },
    { name: 'Commodity name', amount: 'Amount (Rs.)', isHeader: false },
    { name: 'Commodity name', amount: 'Amount (Rs.)', isHeader: false },
    { name: 'Commodity name', amount: 'Amount (Rs.)', isHeader: false },
  ];

  return (
    <>
      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available virtual Balance</Text>
          <Text style={styles.balanceAmount}>Rs. 2,00,000</Text>
          <TouchableOpacity style={styles.addFundButton}>
            <Text style={styles.addFundButtonText}>Add Fund</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.balanceCard, { justifyContent: 'center' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.balanceLabel}>Current value</Text>
            <Text style={styles.balanceAmount}>Rs. 2,00,000</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.balanceLabel}>Invested value</Text>
            <Text style={styles.balanceAmount}>Rs. 2,00,000</Text>
          </View>
        </View>
      </View>

      {/* Portfolio Value */}
      <View style={styles.portfolioSection}>
        <Text style={styles.portfolioValue}>📈 Rs. 26,300</Text>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#2a2a2a',
            backgroundGradientFrom: '#2a2a2a',
            backgroundGradientTo: '#2a2a2a',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#4CAF50',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Your Investments */}
      <View style={styles.investmentsSection}>
        <Text style={styles.sectionTitle}>Your Investments</Text>
        {investments.map((investment, index) => (
          <View
            key={index}
            style={[
              styles.investmentRow,
              investment.isHeader && styles.investmentHeader,
            ]}
          >
            <Text
              style={[
                styles.investmentText,
                investment.isHeader && styles.investmentHeaderText,
              ]}
            >
              {investment.name}
            </Text>
            <Text
              style={[
                styles.investmentText,
                investment.isHeader && styles.investmentHeaderText,
              ]}
            >
              {investment.amount}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
};

const TradingPlatform = () => {
  const [selectedTimeTab, setSelectedTimeTab] = useState('1D');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [orderType, setOrderType] = useState('Market');

  return (
    <View style={[tradingPlatformStyles.container, { paddingBottom: 100 }]}>
      {/* Header */}
      <View style={tradingPlatformStyles.header}>
        <View style={tradingPlatformStyles.stockInfo}>
          <View style={tradingPlatformStyles.stockHeader}>
            <View style={tradingPlatformStyles.redSquare} />
            <Text style={tradingPlatformStyles.stockName}>Nifty50 JULFUT</Text>
            <Text style={tradingPlatformStyles.nfoText}>NFO</Text>
          </View>
          <View style={tradingPlatformStyles.priceInfo}>
            <Text style={tradingPlatformStyles.currentPrice}>24815.77</Text>
            <Text style={tradingPlatformStyles.priceChange}>+0.25%</Text>
          </View>
          <View style={tradingPlatformStyles.priceDetails}>
            <Text style={tradingPlatformStyles.priceDetailText}>
              Prev Closed: <Text style={{ color: '#f2f3f7' }}>190</Text>
            </Text>
            <Text style={tradingPlatformStyles.priceDetailText}>
              Open: <Text style={{ color: '#f2f3f7' }}>188.16</Text>
            </Text>
            <Text style={tradingPlatformStyles.priceDetailText}>
              High: <Text style={{ color: '#f2f3f7' }}>200</Text>
            </Text>
            <Text style={tradingPlatformStyles.priceDetailText}>
              Low: <Text style={{ color: '#f2f3f7' }}>180</Text>
            </Text>
            <Text style={tradingPlatformStyles.priceDetailText}>
              Volume: <Text style={{ color: '#f2f3f7' }}>84.62M</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Chart */}
      <View style={tradingPlatformStyles.chartContainer}>
        <Image 
          source={require('../../assets/images/tradinggraph.png')}
          style={tradingPlatformStyles.tradingGraph}
        />
      </View>

      {/* Main Content */}
      <ScrollView style={tradingPlatformStyles.mainContent}>
        {/* Order Book Section */}
        <View style={tradingPlatformStyles.orderBookSection}>
          <View style={tradingPlatformStyles.orderBookHeader}>
            <View style={tradingPlatformStyles.tabsContainer}>
              <Text style={tradingPlatformStyles.activeTabText}>Order Book</Text>
              <Text style={tradingPlatformStyles.tabText}>Recent Trades</Text>
            </View>
            <View style={tradingPlatformStyles.actionButtons1}>
              <View style={tradingPlatformStyles.actionButton}>
                <Text style={tradingPlatformStyles.actionButtonText}>B</Text>
              </View>
              <View style={tradingPlatformStyles.actionButton}>
                <Text style={tradingPlatformStyles.actionButtonText}>S</Text>
              </View>
            </View>
          </View>

          {/* Table Header */}
          <View style={tradingPlatformStyles.tableHeader}>
            <Text style={tradingPlatformStyles.tableHeaderText}>Bid</Text>
            <Text style={tradingPlatformStyles.tableHeaderText}>Orders</Text>
            <Text style={tradingPlatformStyles.tableHeaderText}>Qty</Text>
            <Text style={tradingPlatformStyles.tableHeaderText}>Ask</Text>
            <Text style={tradingPlatformStyles.tableHeaderText}>Orders</Text>
            <Text style={tradingPlatformStyles.tableHeaderText}>Qty</Text>
          </View>

          {/* Table Rows */}
          {[
            { bid: '53.5', bidOrders: '30', bidQty: '1234', ask: '53.1', askOrders: '30', askQty: '1234' },
            { bid: '53.4', bidOrders: '12', bidQty: '4567', ask: '53.2', askOrders: '12', askQty: '4567' },
            { bid: '53.3', bidOrders: '11', bidQty: '8901', ask: '53.3', askOrders: '11', askQty: '8901' },
            { bid: '53.2', bidOrders: '16', bidQty: '2365', ask: '53.4', askOrders: '16', askQty: '2365' },
            { bid: '53.1', bidOrders: '24', bidQty: '4987', ask: '53.5', askOrders: '24', askQty: '4987' },
          ].map((row, index) => (
            <View key={index} style={[
              tradingPlatformStyles.tableRow,
              index % 2 === 1 && tradingPlatformStyles.tableRowAlternate
            ]}>
              <Text style={tradingPlatformStyles.bidText}>{row.bid}</Text>
              <Text style={tradingPlatformStyles.normalText}>{row.bidOrders}</Text>
              <Text style={tradingPlatformStyles.normalText}>{row.bidQty}</Text>
              <Text style={tradingPlatformStyles.askText}>{row.ask}</Text>
              <Text style={tradingPlatformStyles.normalText}>{row.askOrders}</Text>
              <Text style={tradingPlatformStyles.normalText}>{row.askQty}</Text>
            </View>
          ))}

          {/* Total Row */}
          <View style={tradingPlatformStyles.totalRow}>
            <Text style={tradingPlatformStyles.tableHeaderText}>Total</Text>
            <Text style={tradingPlatformStyles.normalText}></Text>
            <Text style={tradingPlatformStyles.normalText}>4987654</Text>
            <Text style={tradingPlatformStyles.tableHeaderText}>Total</Text>
            <Text style={tradingPlatformStyles.normalText}></Text>
            <Text style={tradingPlatformStyles.normalText}>4987654</Text>
          </View>
        </View>

        {/* Trading Section */}
        <View style={tradingPlatformStyles.tradingSection}>
          <Text style={tradingPlatformStyles.tradingTitle}>Nifty Commodity</Text>
          
          <View style={tradingPlatformStyles.controlsContainer}>
            {/* Top Controls */}
            <View style={tradingPlatformStyles.topControls}>
              <TouchableOpacity style={tradingPlatformStyles.overnightButton}>
                <Text style={tradingPlatformStyles.overnightText}>Overnight</Text>
                <Text style={tradingPlatformStyles.nrmlText}>NRML</Text>
                <Ionicons name="chevron-down" size={16} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
              
              <TouchableOpacity style={tradingPlatformStyles.buyToggle}>
                <Text style={tradingPlatformStyles.buyToggleText}>Buy</Text>
                <View style={tradingPlatformStyles.toggleCircle} />
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            <View style={tradingPlatformStyles.inputRow}>
              <View style={tradingPlatformStyles.inputGroup}>
                <View style={tradingPlatformStyles.inputHeader}>
                  <Text style={tradingPlatformStyles.inputLabel}>Lot Qty</Text>
                  <Text style={tradingPlatformStyles.inputSubLabel}>1 lot = 25 shares</Text>
                </View>
                <TextInput
                  style={tradingPlatformStyles.input}
                  placeholder="Enter quantity"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />
              </View>

              <View style={tradingPlatformStyles.inputGroup}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={tradingPlatformStyles.inputLabel}>Price</Text>
                  <View style={[tradingPlatformStyles.radioGroup, { marginBottom: 0, marginLeft: 16 }]}>
                    <TouchableOpacity 
                      style={tradingPlatformStyles.radioOption}
                      onPress={() => setOrderType('Market')}
                    >
                      <View style={[
                        tradingPlatformStyles.radioCircle,
                        orderType === 'Market' && tradingPlatformStyles.radioCircleSelected
                      ]}>
                        {orderType === 'Market' && <View style={tradingPlatformStyles.radioInner} />}
                      </View>
                      <Text style={[
                        tradingPlatformStyles.radioText,
                        orderType === 'Market' && tradingPlatformStyles.radioTextSelected
                      ]}>Mkt</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={tradingPlatformStyles.radioOption}
                      onPress={() => setOrderType('Limit')}
                    >
                      <View style={[
                        tradingPlatformStyles.radioCircle,
                        orderType === 'Limit' && tradingPlatformStyles.radioCircleSelected
                      ]}>
                        {orderType === 'Limit' && <View style={tradingPlatformStyles.radioInner} />}
                      </View>
                      <Text style={[
                        tradingPlatformStyles.radioText,
                        orderType === 'Limit' && tradingPlatformStyles.radioTextSelected
                      ]}>Limit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TextInput
                  style={tradingPlatformStyles.input}
                  placeholder="Enter price"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                  editable={orderType === 'Limit'}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={tradingPlatformStyles.actionButtons}>
              <TouchableOpacity style={tradingPlatformStyles.buyButton}>
                <Text style={tradingPlatformStyles.buyButtonText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tradingPlatformStyles.sellButton}>
                <Text style={tradingPlatformStyles.sellButtonText}>Sell</Text>
              </TouchableOpacity>
            </View>

            {/* Footer Info */}
            <View style={tradingPlatformStyles.footerInfo}>
              <View style={tradingPlatformStyles.footerItem}>
                <Text style={tradingPlatformStyles.footerLabel}>Charges:</Text>
                <Text style={tradingPlatformStyles.footerValue}>Rs 534,656</Text>
              </View>
              <View style={tradingPlatformStyles.footerItem}>
                <Text style={tradingPlatformStyles.footerLabel}>Margin:</Text>
                <Text style={tradingPlatformStyles.footerValue}>Rs 53461</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default function PaperTrading() {
  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const [guideVisible, setGuideVisible] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [showCongratulations, setShowCongratulations] = useState(false);

  const tabs = ['Dashboard', 'Beginner', 'Intermediate', 'Advance'];

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const isAllQuestionsAnswered = () => {
    return ['q1', 'q2', 'q3'].every(qId => selectedAnswers[qId]);
  };

  const handleSubmit = () => {
    if (isAllQuestionsAnswered()) {
      setShowCongratulations(true);
    }
  };

  const handleMoveToLevel2 = () => {
    setShowCongratulations(false);
    setShowQuiz(false);
    setSelectedTab('Intermediate');
  };

  const renderCongratulationsModal = () => {
    if (!showCongratulations) return null;

    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={showCongratulations}
        onRequestClose={() => setShowCongratulations(false)}
      >
        <BlurView intensity={40} style={[StyleSheet.absoluteFill, styles.congratulationsOverlay]} tint="dark">
          <View style={styles.congratulationsModal}>
            <Text style={styles.congratulationsTitle}>Congratulations !!</Text>
            <Text style={styles.congratulationsText}>
              You have completed all questions correctly{'\n'}
              You can proceed to level 2
            </Text>
            <TouchableOpacity 
              style={styles.moveToLevel2Button}
              onPress={handleMoveToLevel2}
            >
              <Text style={styles.moveToLevel2ButtonText}>Move to Level 2</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    );
  };

  const handleMoveToQuest = () => {
    setTutorialVisible(false);
    setShowQuiz(true);
  };

  const renderQuiz = () => {
    return (
      <View style={styles.quizContainer}>
        {renderCongratulationsModal()}
        {/* Disclaimer Banner */}
        <View style={styles.quizDisclaimerBanner}>
          <Ionicons name="information-circle-outline" size={20} color="#000" />
          <Text style={styles.quizDisclaimerText}>
            To move to level 2 please answer these questions.
          </Text>
        </View>

        {/* Question 1 */}
        <View style={styles.questionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.questionNumber}>Q1. </Text>
            <Text style={styles.questionText}>What is trading?</Text>
          </View>
          <Text style={styles.questionDescription}>Description (optional)</Text>

          {/* Answer Options */}
          <TouchableOpacity 
            style={[
              styles.answerOption,
              selectedAnswers['q1'] === 'A' && styles.selectedAnswerOption
            ]}
            onPress={() => handleAnswerSelect('q1', 'A')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedAnswers['q1'] === 'A' && styles.checkedCheckbox
              ]}>
                {selectedAnswers['q1'] === 'A' && (
                  <Ionicons name="checkmark" size={16} color="#000" />
                )}
              </View>
            </View>
            <Text style={styles.answerText}>A. A way to shop</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.answerOption,
              selectedAnswers['q1'] === 'B' && styles.selectedAnswerOption
            ]}
            onPress={() => handleAnswerSelect('q1', 'B')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedAnswers['q1'] === 'B' && styles.checkedCheckbox
              ]}>
                {selectedAnswers['q1'] === 'B' && (
                  <Ionicons name="checkmark" size={16} color="#000" />
                )}
              </View>
            </View>
            <Text style={styles.answerText}>B. A way to hop</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.answerOption,
              selectedAnswers['q1'] === 'C' && styles.selectedAnswerOption
            ]}
            onPress={() => handleAnswerSelect('q1', 'C')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedAnswers['q1'] === 'C' && styles.checkedCheckbox
              ]}>
                {selectedAnswers['q1'] === 'C' && (
                  <Ionicons name="checkmark" size={16} color="#000" />
                )}
              </View>
            </View>
            <Text style={styles.answerText}>C. Marking the sheet</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.answerOption,
              selectedAnswers['q1'] === 'D' && styles.selectedAnswerOption
            ]}
            onPress={() => handleAnswerSelect('q1', 'D')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedAnswers['q1'] === 'D' && styles.checkedCheckbox
              ]}>
                {selectedAnswers['q1'] === 'D' && (
                  <Ionicons name="checkmark" size={16} color="#000" />
                )}
              </View>
            </View>
            <Text style={styles.answerText}>D. Something</Text>
          </TouchableOpacity>

          {/* Description Input */}
          <Text style={styles.descriptionLabel}>Write Description for right answer</Text>
          <View style={styles.descriptionInputContainer}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add Text"
              placeholderTextColor="#73786c"
              multiline
            />
            <View style={styles.editorToolbar}>
              <TouchableOpacity style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>B</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>I</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>U</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="link" size={16} color="#fff" />
              </TouchableOpacity>
              <View style={styles.toolbarDivider} />
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="list" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="menu" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="reorder-three" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>😊</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.descriptionNote}>*this will be shown when option selected by user is wrong</Text>
        </View>

        {/* Question 2 */}
        <View style={[styles.questionCard, { marginTop: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.questionNumber}>Q2. </Text>
            <Text style={styles.questionText}>What is a stock market?</Text>
          </View>
          <Text style={styles.questionDescription}>Description (optional)</Text>

          <TouchableOpacity 
            style={[
              styles.answerOption,
              selectedAnswers['q2'] === 'A' && styles.selectedAnswerOption
            ]}
            onPress={() => handleAnswerSelect('q2', 'A')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedAnswers['q2'] === 'A' && styles.checkedCheckbox
              ]}>
                {selectedAnswers['q2'] === 'A' && (
                  <Ionicons name="checkmark" size={16} color="#000" />
                )}
              </View>
            </View>
            <Text style={styles.answerText}>A. A place to buy groceries</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.answerOption,
              selectedAnswers['q2'] === 'B' && styles.selectedAnswerOption
            ]}
            onPress={() => handleAnswerSelect('q2', 'B')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedAnswers['q2'] === 'B' && styles.checkedCheckbox
              ]}>
                {selectedAnswers['q2'] === 'B' && (
                  <Ionicons name="checkmark" size={16} color="#000" />
                )}
              </View>
            </View>
            <Text style={styles.answerText}>B. A marketplace for company shares</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.answerOption,
              selectedAnswers['q2'] === 'C' && styles.selectedAnswerOption
            ]}
            onPress={() => handleAnswerSelect('q2', 'C')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedAnswers['q2'] === 'C' && styles.checkedCheckbox
              ]}>
                {selectedAnswers['q2'] === 'C' && (
                  <Ionicons name="checkmark" size={16} color="#000" />
                )}
              </View>
            </View>
            <Text style={styles.answerText}>C. A type of shopping mall</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.answerOption,
              selectedAnswers['q2'] === 'D' && styles.selectedAnswerOption
            ]}
            onPress={() => handleAnswerSelect('q2', 'D')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedAnswers['q2'] === 'D' && styles.checkedCheckbox
              ]}>
                {selectedAnswers['q2'] === 'D' && (
                  <Ionicons name="checkmark" size={16} color="#000" />
                )}
              </View>
            </View>
            <Text style={styles.answerText}>D. A place to store money</Text>
          </TouchableOpacity>

          {/* Description Input */}
          <Text style={styles.descriptionLabel}>Write Description for right answer</Text>
          <View style={styles.descriptionInputContainer}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add Text"
              placeholderTextColor="#73786c"
              multiline
            />
            <View style={styles.editorToolbar}>
              <TouchableOpacity style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>B</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>I</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>U</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="link" size={16} color="#fff" />
              </TouchableOpacity>
              <View style={styles.toolbarDivider} />
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="list" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="menu" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="reorder-three" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>😊</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.descriptionNote}>*this will be shown when option selected by user is wrong</Text>
        </View>

        {/* Question 3 */}
        <View style={[styles.questionCard, { marginTop: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.questionNumber}>Q3. </Text>
            <Text style={styles.questionText}>What is a bull market?</Text>
          </View>
          <Text style={styles.questionDescription}>Description (optional)</Text>

          <TouchableOpacity 
            style={[
              styles.answerOption,
              selectedAnswers['q3'] === 'A' && styles.selectedAnswerOption
            ]}
            onPress={() => handleAnswerSelect('q3', 'A')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedAnswers['q3'] === 'A' && styles.checkedCheckbox
              ]}>
                {selectedAnswers['q3'] === 'A' && (
                  <Ionicons name="checkmark" size={16} color="#000" />
                )}
              </View>
            </View>
            <Text style={styles.answerText}>A. A market where bulls are sold</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.answerOption,
              selectedAnswers['q3'] === 'B' && styles.selectedAnswerOption
            ]}
            onPress={() => handleAnswerSelect('q3', 'B')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedAnswers['q3'] === 'B' && styles.checkedCheckbox
              ]}>
                {selectedAnswers['q3'] === 'B' && (
                  <Ionicons name="checkmark" size={16} color="#000" />
                )}
              </View>
            </View>
            <Text style={styles.answerText}>B. A market trending upward</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.answerOption,
              selectedAnswers['q3'] === 'C' && styles.selectedAnswerOption
            ]}
            onPress={() => handleAnswerSelect('q3', 'C')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedAnswers['q3'] === 'C' && styles.checkedCheckbox
              ]}>
                {selectedAnswers['q3'] === 'C' && (
                  <Ionicons name="checkmark" size={16} color="#000" />
                )}
              </View>
            </View>
            <Text style={styles.answerText}>C. A market for livestock</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.answerOption,
              selectedAnswers['q3'] === 'D' && styles.selectedAnswerOption
            ]}
            onPress={() => handleAnswerSelect('q3', 'D')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedAnswers['q3'] === 'D' && styles.checkedCheckbox
              ]}>
                {selectedAnswers['q3'] === 'D' && (
                  <Ionicons name="checkmark" size={16} color="#000" />
                )}
              </View>
            </View>
            <Text style={styles.answerText}>D. A market that's closed</Text>
          </TouchableOpacity>

          {/* Description Input */}
          <Text style={styles.descriptionLabel}>Write Description for right answer</Text>
          <View style={styles.descriptionInputContainer}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add Text"
              placeholderTextColor="#73786c"
              multiline
            />
            <View style={styles.editorToolbar}>
              <TouchableOpacity style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>B</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>I</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>U</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="link" size={16} color="#fff" />
              </TouchableOpacity>
              <View style={styles.toolbarDivider} />
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="list" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="menu" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="reorder-three" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>😊</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.descriptionNote}>*this will be shown when option selected by user is wrong</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            !isAllQuestionsAnswered() && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!isAllQuestionsAnswered()}
        >
          <Text style={[
            styles.submitButtonText,
            !isAllQuestionsAnswered() && styles.submitButtonTextDisabled
          ]}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleStartBeginnerLevel = () => {
    setGuideVisible(false);
    setSelectedTab('Beginner');
    setTimeout(() => {
      setTutorialVisible(true);
    }, 500);
  };

  const renderContent = () => {
    if (showQuiz) {
      return renderQuiz();
    }
    
    if (selectedTab === 'Beginner') {
      return <TradingPlatform />;
    }

    // Default content (Dashboard view)
    return <DashboardView />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#242620" />
      
      <Header 
        searchPlaceholder="Search instruments"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView style={styles.content}>
        {/* Paper Trading Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>Paper Trading</Text>
          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.selectedTab
              ]}
              onPress={() => {
                setSelectedTab(tab);
                setShowQuiz(false);
              }}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab && styles.selectedTabText
              ]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Disclaimer Container */}
        {!showQuiz && (
          <View style={styles.disclaimerContainer}>
            <View style={styles.warningIcon}>
              <Text style={styles.warningText}>!</Text>
            </View>
            <Text style={styles.disclaimerText}>
              Do's and don'ts of paper trading. Kindly go through this guide to avoid mistakes.{' '}
              <Text style={styles.readMoreText} onPress={() => setGuideVisible(true)}>Read more</Text>
            </Text>
          </View>
        )}

        {/* Conditional Content */}
        {renderContent()}
      </ScrollView>

      <PaperTradingGuide 
        visible={guideVisible} 
        onClose={() => setGuideVisible(false)}
        onStartBeginner={handleStartBeginnerLevel}
      />

      <TutorialOverlay
        visible={tutorialVisible}
        onClose={() => setTutorialVisible(false)}
        onMoveToQuest={handleMoveToQuest}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242620',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 100,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  learnMoreButton: {
    backgroundColor: '#9bec00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  learnMoreButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 4,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedTab: {
    backgroundColor: '#9bec00',
  },
  tabText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedTabText: {
    color: '#000',
    fontWeight: '600',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    backgroundColor: '#9bec00',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  warningIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  warningText: {
    color: '#9bec00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimerText: {
    color: '#000',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  readMoreText: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  balanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#2c2e27',
    borderRadius: 8,
    padding: 15,
    paddingHorizontal: 10,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addFundButton: {
    backgroundColor: '#9bec00',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addFundButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  investedValue: {
    color: '#888',
    fontSize: 12,
  },
  portfolioSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  portfolioValue: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  investmentsSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  investmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  investmentHeader: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  investmentText: {
    color: '#fff',
    fontSize: 14,
  },
  investmentHeaderText: {
    fontWeight: 'bold',
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#2c2e27',
  },
  modalScrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeaderSubtitle: {
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  modalProceedText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 4,
  },
  whiteCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#9BEC00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineContainer: {
    paddingVertical: 20,
  },
  levelContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    marginTop: -32,
  },
  circleContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#9bec00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleNumber: {
    color: '#2a2a2a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verticalLine: {
    width: 2,
    height: 60,
    backgroundColor: '#9bec00',
    marginTop: -2,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 5,
  },
  levelTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  levelDescription: {
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 18,
  },
  noteContainer: {
    backgroundColor: '#3a3a3a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: -25,
  },
  noteTitle: {
    color: '#9bec00',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noteText: {
    color: '#cccccc',
    fontSize: 12,
    lineHeight: 16,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#9bec00',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#2a2a2a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f2f3f7',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#f2f3f7',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlayGradient: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 80,
  },
  modalOverlay: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#2c2e27',
    borderRadius: 12,
  },
  tutorialContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  searchHighlight: {
    position: 'absolute',
    top: 40,
    left: 65, // Account for logo width and padding
    right: 70, // Account for profile button width and padding
    height: 40,
    backgroundColor: 'rgba(155, 236, 0, 0.1)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#9bec00',
  },
  tutorialContent: {
    position: 'absolute',
    top: 100,
    left: 56,
    right: 56,
    backgroundColor: '#242620',
    borderRadius: 12,
    padding: 16,
  },
  tutorialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tutorialTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  tutorialDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tutorialInstructions: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  nextButton: {
    backgroundColor: '#9bec00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#242620',
    fontSize: 16,
    fontWeight: '600',
  },
  congratsContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -100 }],
    width: 300,
    backgroundColor: '#242620',
    borderRadius: 12,
    padding: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  congratsTitle: {
    color: '#9BEC00',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  congratsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  moveToQuestButton: {
    backgroundColor: '#9BEC00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  moveToQuestButtonText: {
    color: '#242620',
    fontSize: 16,
    fontWeight: '600',
  },
  quizContainer: {
    flex: 1,
    paddingHorizontal: 6,
    // paddingTop: 16,
    paddingBottom: 100,
  },
  quizDisclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE81A',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  quizDisclaimerText: {
    color: '#000',
    fontSize: 14,
    flex: 1,
  },
  questionCard: {
    // backgroundColor: '#1A1C19',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#b9b9b9',
  },
  questionNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  questionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  questionDescription: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    marginBottom: 16,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242620',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedAnswerOption: {
    borderColor: '#FFE81A',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkedCheckbox: {
    backgroundColor: '#FFE81A',
    borderColor: '#FFE81A',
  },
  answerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  selectedAnswerText: {
    color: 'rgba(255, 255, 255, 0.8)', // Keep text color consistent
  },
  descriptionLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 8,
  },
  descriptionInputContainer: {
    backgroundColor: '#b9b9b9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  descriptionInput: {
    color: '#73786c',
    fontSize: 14,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
  },
  editorToolbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    gap: 8,
  },
  toolbarButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbarButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  toolbarDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
  },
  descriptionNote: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#9bec00',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#242620',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    backgroundColor: '#73786c',
  },
  submitButtonTextDisabled: {
    color: '#242620',
    opacity: 0.5,
  },
  congratulationsOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  congratulationsModal: {
    width: 300,
    backgroundColor: '#242620',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  congratulationsTitle: {
    color: '#9BEC00',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  congratulationsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  moveToLevel2Button: {
    backgroundColor: '#9BEC00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  moveToLevel2ButtonText: {
    color: '#242620',
    fontSize: 16,
    fontWeight: '600',
  },
}); 