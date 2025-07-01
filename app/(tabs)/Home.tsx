import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const avatarUri = 'https://randomuser.me/api/portraits/women/44.jpg'; // Placeholder avatar

const App = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image
          source={require('../../assets/images/Tradeved-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Link href="/quiz-pages/profile-screen" asChild>
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
          
          {/* Graph grid */}
          <View style={styles.gridContainer}>
            {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((value) => (
              <View key={value} style={styles.gridRow}>
                <Text style={styles.yAxisValue}>{value}</Text>
                <View style={styles.gridLine} />
              </View>
            ))}
            
            {/* X-axis labels */}
            <View style={styles.xAxisContainer}>
              <View style={styles.xAxisLabels}>
                {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, index) => (
                  <Text key={week} style={styles.xAxisText}>{week}</Text>
                ))}
              </View>
              <View style={styles.xAxisArrow}>
                <Text style={styles.xAxisLabel}>No. of Week</Text>
                <View style={styles.arrowRight} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Quests and Quiz */}
      <View style={styles.row}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Quests</Text>
            <TouchableOpacity style={styles.dropdownSmall}>
              <Text style={styles.dropdownTextSmall}>Weekly</Text>
              <MaterialIcons name="arrow-drop-down" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Gauge */}
          <View style={styles.gaugeRow}>
            <FontAwesome name="circle" size={24} color="#2ecc40" />
            <FontAwesome name="circle" size={24} color="#ff4136" style={{ marginLeft: 16 }} />
          </View>
          <View style={styles.gaugeLabelRow}>
            <Text style={styles.gaugeLabel}>Correct</Text>
            <Text style={styles.gaugeLabel}>Wrong</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Quiz</Text>
            <TouchableOpacity style={styles.dropdownSmall}>
              <Text style={styles.dropdownTextSmall}>Weekly</Text>
              <MaterialIcons name="arrow-drop-down" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Gauge */}
          <View style={styles.gaugeRow}>
            <FontAwesome name="circle" size={24} color="#2ecc40" />
            <FontAwesome name="circle" size={24} color="#ff4136" style={{ marginLeft: 16 }} />
          </View>
          <View style={styles.gaugeLabelRow}>
            <Text style={styles.gaugeLabel}>Correct</Text>
            <Text style={styles.gaugeLabel}>Wrong</Text>
          </View>
        </View>
      </View>

      {/* Journal and Paper Trades */}
      <View style={styles.row}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Journal</Text>
            <TouchableOpacity style={styles.dropdownSmall}>
              <Text style={styles.dropdownTextSmall}>Weekly</Text>
              <MaterialIcons name="arrow-drop-down" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.journalText}>Total journal entries <Text style={{ fontWeight: 'bold' }}>220</Text></Text>
          <Text style={styles.journalText}>Brokers added <Text style={{ fontWeight: 'bold' }}>Csv file added</Text></Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Paper Trades</Text>
            <TouchableOpacity style={styles.dropdownSmall}>
              <Text style={styles.dropdownTextSmall}>Weekly</Text>
              <MaterialIcons name="arrow-drop-down" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.journalText}>Available balance <Text style={{ fontWeight: 'bold' }}>2,00,000</Text></Text>
          <Text style={styles.journalText}>Current value <Text style={{ fontWeight: 'bold' }}>2,00,000</Text></Text>
          <Text style={styles.journalText}>Invested value <Text style={{ fontWeight: 'bold' }}>2,00,000</Text></Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          <Text style={{ fontWeight: 'bold' }}>Learning</Text> is a <Text style={{ fontWeight: 'bold' }}>lifelong</Text> process <Text style={styles.heart}>♥</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

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
    // marginRight: 4,
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
    borderRadius: 16,
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
    flexDirection: 'row',
    height: 320,
    marginTop: 8,
  },
  yAxisLabel: {
    // width: 40,
    alignItems: 'center',
    // marginRight: 8,
    marginLeft: 10,
    marginTop: -30,
  },
  axisText: {
    color: '#fff',
    fontSize: 12,
    transform: [{ rotate: '-90deg' }],
    position: 'absolute',
    top: 140,
    width: 100,
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
    top: 150,
    left: '53%',
    transform: [{ translateX: -4 }],
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  yAxisValue: {
    color: '#aaa',
    fontSize: 11,
    width: 30,
    textAlign: 'right',
    marginRight: 8,
  },
  gridLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  xAxisContainer: {
    marginTop: 8,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 38,
    paddingRight: 20,
  },
  xAxisText: {
    color: '#aaa',
    fontSize: 11,
  },
  xAxisArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  xAxisLabel: {
    color: '#fff',
    fontSize: 12,
    marginRight: 4,
  },
  arrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#232823',
    borderRadius: 12,
    padding: 14,
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
    fontSize: 15,
  },
  dropdownSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  dropdownTextSmall: {
    color: '#fff',
    fontSize: 12,
    marginRight: 2,
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
  journalText: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 2,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  heart: {
    color: '#ff4136',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default App;
