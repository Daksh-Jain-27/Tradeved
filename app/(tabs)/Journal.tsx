import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { Header } from '../../components/Header';

const HEADER_HEIGHT = 100;
const TABS_HEIGHT = 44;
const FILTERS_HEIGHT = 40;
const FIXED_TOP_HEIGHT = HEADER_HEIGHT + TABS_HEIGHT + FILTERS_HEIGHT;

// --- ProgressCircle component update ---
const ProgressCircle = ({ progress }: { progress: number }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.progressCircleContainer}>
      <Svg width={48} height={48}>
        {/* Background circle */}
        <Circle
          cx={24}
          cy={24}
          r={radius}
          stroke="#333"
          strokeWidth={4}
          fill="transparent"
        />
        {/* Pink segment */}
        <Circle
          cx={24}
          cy={24}
          r={radius}
          stroke="#f472b6"
          strokeWidth={4}
          fill="transparent"
          strokeDasharray={`${circumference * 0.2} ${circumference}`}
          transform="rotate(-90 24 24)"
        />
        {/* Green progress */}
        <Circle
          cx={24}
          cy={24}
          r={radius}
          stroke="#9bec00"
          strokeWidth={4}
          fill="transparent"
          strokeDasharray={`${circumference * (progress / 100)} ${circumference}`}
          strokeDashoffset={0}
          transform="rotate(-90 24 24)"
        />
      </Svg>
      <View style={styles.progressTextContainer}>
        <Text style={styles.winRateValue}>34</Text>
        <Text style={styles.winRateDecimal}>.02</Text>
      </View>
    </View>
  );
};

// --- New VerticalProgressBar component ---
const VerticalProgressBar = () => {
  return (
    <View style={styles.verticalBarContainer}>
      <Text style={styles.barLabel}>14400</Text>
      <View style={styles.barBackground}>
        <LinearGradient
          colors={['#9bec00', '#f472b6']}
          style={styles.barGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>
      <Text style={styles.barLabel}>-10000</Text>
      <Text style={styles.avgProfitLabel}>Avg. Profit{'\n'}Factor</Text>
      <Text style={styles.avgProfitValue}>1.44</Text>
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

const filterColors = [
  '#e5c9a8', // User Management
  '#fbcfe8', // Transaction Monitor
  '#bae6fd', // Economic
  '#d1fae5', // Security
];

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarDay {
  label?: string;
  pnt?: number;
  trades?: number;
  color?: string;
}

const generateCalendarData = (date: Date): CalendarDay[][] => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayIndex = (firstDay.getDay() + 6) % 7; // Convert Sunday (0) to 6, and shift others back

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const weeksNeeded = Math.ceil((firstDayIndex + daysInMonth) / 7);

  const calendarData: CalendarDay[][] = [];
  let dayCounter = 1;

  for (let week = 0; week < weeksNeeded; week++) {
    const weekData: CalendarDay[] = [];
    for (let day = 0; day < 7; day++) {
      if ((week === 0 && day < firstDayIndex) || dayCounter > daysInMonth) {
        weekData.push({});
      } else {
        weekData.push({
          label: dayCounter.toString(),
          pnt: Math.floor(Math.random() * 50000),
          trades: Math.floor(Math.random() * 5) + 1,
          color: '#bef264'
        });
        dayCounter++;
      }
    }
    calendarData.push(weekData);
  }

  return calendarData;
};

const csvProviders = [
  'CSV Provider',
  'Zerodha',
  'Upstox',
  'Angel One',
];

// Add type for selected file
type SelectedFile = {
  name: string;
  size: number;
  uri: string;
  mimeType?: string;
} | null;

export default function Journal() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const [activeChartTab, setActiveChartTab] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 6));
  const [currentCalendarData, setCurrentCalendarData] = useState(generateCalendarData(new Date(2024, 6)));
  const [selectedProvider, setSelectedProvider] = useState(csvProviders[0]);
  const [showAddTradeData, setShowAddTradeData] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile>(null);
  const router = useRouter();

  const handleTabPress = (i: number) => {
    if (i === 1) {
      setShowAddTradeData(!showAddTradeData);
      setActiveTab(showAddTradeData ? 0 : 1);
      // Reset states when toggling Add Trade Data tab
      if (showAddTradeData) {
        setSelectedFile(null);
        setUploadSuccess(false);
        setIsUploading(false);
      }
    } else {
      setActiveTab(i);
      setShowAddTradeData(false);
      setIsDropdownOpen(false);
    }
  };

  const handleMonthChange = (direction: 'next' | 'prev') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
    setCurrentCalendarData(generateCalendarData(newDate));
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Get file extension and check if it's CSV
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (fileExtension !== 'csv') {
          Alert.alert(
            'Invalid File Type',
            'Please select a CSV file',
            [{ text: 'OK' }]
          );
          return;
        }

        // Check file size (10MB = 10485760 bytes)
        if (file.size && file.size > 10485760) {
          Alert.alert(
            'File Too Large',
            'Please select a file smaller than 10MB',
            [{ text: 'OK' }]
          );
          return;
        }

        const selectedFileData = {
          name: file.name,
          size: file.size || 0,
          uri: file.uri,
          mimeType: file.mimeType
        };

        setSelectedFile(selectedFileData);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert(
        'Error',
        'Failed to select file. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleFileUpload = async (file: SelectedFile) => {
    if (!file) return;

    try {
      setIsUploading(true);

      // For demonstration, we'll simulate an upload with FormData
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType || 'text/csv',
        name: file.name
      } as any);

      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, you would make an actual API call here:
      /*
      const response = await fetch('YOUR_UPLOAD_URL', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }
      */

      setUploadSuccess(true);
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert(
        'Upload Failed',
        'Failed to upload file. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUploading(false);
    }
  };

  const renderUploadSuccess = () => {
    return (
      <View style={styles.uploadSuccessContainer}>
        <Text style={styles.uploadedTitle}>Uploaded!</Text>
        <Text style={styles.uploadedMessage}>
          Please wait your data is getting loaded. DO NOT REFRESH otherwise you might lose your data.
        </Text>
        <Text style={styles.uploadedSubMessage}>
          This data entry is created on 'Saved Portfolio' screen.
        </Text>
        <TouchableOpacity 
          style={styles.uploadAnotherBtn}
          onPress={() => {
            setUploadSuccess(false);
            setSelectedFile(null);
          }}
        >
          <Text style={styles.uploadAnotherBtnText}>Upload Another File</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAddTradeData = () => {
    if (uploadSuccess) {
      return renderUploadSuccess();
    }

    return (
      <View style={styles.uploadSection}>
        <Text style={styles.uploadTitle}>Upload CSV</Text>
        <Text style={styles.label}>Select CSV Provider</Text>
        
        {/* Custom Dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text style={styles.dropdownButtonText}>{selectedProvider}</Text>
            <Ionicons 
              name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#fff" 
            />
          </TouchableOpacity>
          
          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              {csvProviders.map((provider) => (
                <TouchableOpacity
                  key={provider}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedProvider(provider);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    selectedProvider === provider && styles.dropdownItemTextSelected
                  ]}>
                    {provider}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.fileFormat}>File format: CSV, .xlsx, file size 1 mb</Text>
        
        <TouchableOpacity 
          style={[styles.dropZone, selectedFile && styles.dropZoneWithFile]}
          onPress={pickDocument}
        >
          <View style={styles.fileContentContainer}>
            <Text style={styles.dropZoneIcon}>📄</Text>
            {selectedFile ? (
              <View style={styles.selectedFileContainer}>
                <Text style={styles.selectedFileName} numberOfLines={1} ellipsizeMode="middle">
                  {selectedFile.name}
                </Text>
                <Text style={styles.fileSize}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </Text>
              </View>
            ) : (
              <Text style={styles.dropZoneText}>Upload CSV file</Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.uploadBtn, 
            (isUploading || !selectedFile) && styles.uploadBtnDisabled
          ]}
          onPress={() => selectedFile && handleFileUpload(selectedFile)}
          disabled={isUploading || !selectedFile}
        >
          <Text style={styles.uploadBtnText}>
            {isUploading ? 'Uploading...' : 'Upload Now'}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoNote}>
          <Text style={styles.infoNoteText}>
            Connect Broker and Manual data uploading feature will be live soon
          </Text>
        </View>
      </View>
    );
  };

  const handleDayPress = (day: CalendarDay) => {
    if (day.label) {
      router.push('/journal/JournalEntry');
    }
  };

  const renderMainContent = () => {
    return (
      <>
        {/* Month Navigation Row */}
        <View style={styles.monthNavigationRow}>
          <View style={styles.monthYearContainer}>
            <TouchableOpacity
              style={styles.monthNavButton}
              onPress={() => handleMonthChange('prev')}
            >
              <View style={styles.arrowBox}>
                <Ionicons name="chevron-back" size={14} color="#9BEC00" />
              </View>
            </TouchableOpacity>

            <Text style={styles.monthYearText}>
              {months[currentDate.getMonth()]}, {currentDate.getFullYear()}
            </Text>

            <TouchableOpacity
              style={styles.monthNavButton}
              onPress={() => handleMonthChange('next')}
            >
              <View style={styles.arrowBox}>
                <Ionicons name="chevron-forward" size={14} color="#9BEC00" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters Row */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContentContainer}
          >
            {filters.map((filter, i) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  { backgroundColor: i === activeFilter ? filterColors[i] : 'transparent' },
                  { borderColor: filterColors[i] }
                ]}
                onPress={() => setActiveFilter(i)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.filterButtonText,
                  { color: i === activeFilter ? '#000000' : filterColors[i] }
                ]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <View style={styles.weekDaysRow}>
            {weekDays.map((d) => (
              <Text key={d} style={styles.weekDayText}>{d}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {currentCalendarData.map((week, i) => (
              <View key={i} style={styles.calendarWeek}>
                {week.map((day, j) => day.label ? (
                  <TouchableOpacity 
                    key={j} 
                    style={[styles.calendarDay, { backgroundColor: day.color || '#bef264' }]}
                    onPress={() => handleDayPress(day)}
                  >
                    {/* Date in top right */}
                    <Text style={styles.dayLabel}>{day.label}</Text>

                    {/* Amount in center */}
                    <View style={styles.dayCenter}>
                      <Text style={styles.dayPnt}>{`₹${((day.pnt || 0) / 1000).toFixed(1)}k`}</Text>
                      <Text style={styles.dayTrades}>{day.trades || 0} Trades</Text>
                    </View>

                    {/* Bottom icons with numbers */}
                    <View style={styles.dayBottom}>
                      <View style={styles.dayBottomItem}>
                        <Text style={styles.dayBottomIcon}>⚡</Text>
                        <Text style={styles.dayBottomText}>2</Text>
                      </View>
                      <View style={styles.dayBottomItem}>
                        <Text style={styles.dayBottomIcon}>🎯</Text>
                        <Text style={styles.dayBottomText}>1</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View key={j} style={styles.calendarDayEmpty} />
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <View style={styles.chartContainer}>
            <View style={styles.chartLeftSection}>
              {/* Net PnL and Toggle Container */}
              <View style={styles.topContainer}>
                <View style={styles.netPnlContainer}>
                  <Text style={styles.netPnlLabel}>Net PnL</Text>
                  <Text style={styles.netPnlValue}>₹ 2,74,900</Text>
                </View>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    onPress={() => setActiveChartTab(0)}
                    style={[styles.toggleButton, activeChartTab === 0 && styles.toggleButtonActive]}
                  >
                    <Text style={[styles.toggleText, activeChartTab === 0 && styles.toggleTextActive]}>Daily</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveChartTab(1)}
                    style={[styles.toggleButton, activeChartTab === 1 && styles.toggleButtonActive]}
                  >
                    <Text style={[styles.toggleText, activeChartTab === 1 && styles.toggleTextActive]}>Cumulative</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bar Chart */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.barChartContainer}>
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
                  <Rect x={0} y={60} width={barChartData.length * 16} height={1} fill="#444" />
                </Svg>
              </ScrollView>
            </View>

            {/* Right Section with Progress */}
            <View style={styles.chartRightSection}>
              <View style={styles.progressContainer}>
                <ProgressCircle progress={34} />
                <Text style={styles.winRateLabel}>Win %</Text>
              </View>
              <VerticalProgressBar />
            </View>
          </View>

          {/* Bottom Labels */}
          <View style={styles.chartBottomLabels}>
            <Text style={styles.dayWiseLabel}>Day Wise Breakup</Text>
            <Text style={styles.footerMonth}>March 2024</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#242620' }}>
      {/* Header is the only fixed component */}
      <Header />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}>
        {/* Tabs Row - More compact, matching screenshot */}
        <View style={styles.tabsRow}>
          {tabs.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                i === activeTab ? styles.tabButtonActive : null
              ]}
              onPress={() => handleTabPress(i)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.tabButtonText,
                i === activeTab ? styles.tabButtonTextActive : null
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {showAddTradeData ? renderAddTradeData() : renderMainContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#0f1209',
    borderRadius: 8,
    padding: 3,
    margin: 8,
  },
  tabButton: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: '#9bec00',
    borderWidth: 0.5,
    borderColor: '#000000',
  },
  tabButtonText: {
    color: '#e0e0e0',
    fontSize: 13,
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#040404',
    fontWeight: '600',
  },
  monthNavigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#23251f',
  },
  monthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthNavButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1a1c16',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBox: {
    width: 18,
    height: 18,
    // backgroundColor: '#2C2E27',
    borderRadius: 6,
    borderColor: '#9BEC00',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavButtonText: {
    color: '#9bec00',
    fontSize: 14,
    fontWeight: '600',
    marginTop: -2,
  },
  monthYearText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  filtersContainer: {
    // backgroundColor: '#1a1c16',
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  filtersContentContainer: {
    paddingHorizontal: 8,
    gap: 8,
  },
  filterButton: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderColor: '#fec2e5',
    borderWidth: 1,
    minHeight: 22,
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: '500',
  },
  calendarSection: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  monthText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarIcon: { fontSize: 20, color: '#a3e635' },
  weekDaysRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginTop: 8,
    gap: 4, // Match the gap of calendar cells
  },
  weekDayText: {
    color: '#a3a3a3',
    fontWeight: 'bold',
    fontSize: 13,
    width: 49, // Match the width of calendar cells
    textAlign: 'center'
  },
  calendarGrid: {
    marginTop: 10,
    paddingHorizontal: 8,
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Change from space-between to flex-start
    marginBottom: 4,
    gap: 4, // Add consistent gap between cells
  },
  calendarDay: {
    width: 49, // Fixed width
    height: 46, // Fixed height
    borderRadius: 4,
    padding: 1,
    position: 'relative',
  },
  dayLabel: {
    position: 'absolute',
    top: 2,
    right: 6,
    color: '#23251f',
    fontSize: 8,
    fontWeight: '600',
  },
  dayCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dayPnt: {
    color: '#23251f',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayTrades: {
    color: '#23251f',
    fontSize: 8,
    marginTop: -2,
  },
  dayBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 0,
  },
  dayBottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dayBottomIcon: {
    fontSize: 6,
  },
  dayBottomText: {
    color: '#23251f',
    fontSize: 6,
    fontWeight: '500',
  },
  calendarDayEmpty: {
    width: 49, // Match exactly with calendarDay width
    height: 46, // Match exactly with calendarDay height
  },
  chartSection: {
    backgroundColor: '#23251f',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  chartContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  chartLeftSection: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  netPnlContainer: {
    gap: 4,
  },
  netPnlLabel: {
    color: '#a3a3a3',
    fontSize: 13,
  },
  netPnlValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#31332b',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#9bec00',
  },
  toggleText: {
    color: '#fff',
    fontSize: 13,
  },
  toggleTextActive: {
    color: '#23251f',
    fontWeight: '600',
  },
  barChartContainer: {
    marginTop: 16,
  },
  chartRightSection: {
    width: 80,
    alignItems: 'center',
    gap: 16,
  },
  progressContainer: {
    alignItems: 'center',
    gap: 4,
  },
  winRateLabel: {
    color: '#a3a3a3',
    fontSize: 11,
  },
  progressCircleContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressTextContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  winRateValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  winRateDecimal: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  verticalBarContainer: {
    alignItems: 'center',
    height: 140,
    justifyContent: 'space-between',
  },
  barBackground: {
    width: 4,
    height: 80,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barGradient: {
    width: '100%',
    height: '100%',
  },
  barLabel: {
    color: '#a3a3a3',
    fontSize: 11,
  },
  avgProfitLabel: {
    color: '#a3a3a3',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  avgProfitValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartBottomLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#31332b',
  },
  dayWiseLabel: {
    color: '#a3a3a3',
    fontSize: 13,
  },
  footerMonth: {
    color: '#a3a3a3',
    fontSize: 13,
  },
  uploadSection: {
    margin: 24,
    backgroundColor: 'transparent',
    zIndex: 1, // Ensure dropdown shows above other content
  },
  uploadTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 14
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
    marginBottom: 14
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    // backgroundColor: '#0f1209',
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#242620',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 14,
  },
  dropdownItemTextSelected: {
    color: '#9bec00',
  },
  fileFormat: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 8
  },
  dropZone: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    minHeight: 90,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'transparent',
    padding: 16,
  },
  dropZoneWithFile: {
    borderColor: '#9bec00',
    borderStyle: 'dashed',
  },
  fileContentContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  dropZoneIcon: {
    fontSize: 28,
    color: '#a3a3a3',
  },
  dropZoneText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedFileContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  selectedFileName: {
    color: '#fff',
    fontSize: 14,
    maxWidth: '90%',
    textAlign: 'center',
  },
  fileSize: {
    color: '#9bec00',
    fontSize: 12,
  },
  uploadBtn: {
    backgroundColor: '#a3e635',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16
  },
  uploadBtnText: {
    color: '#23251f',
    fontWeight: 'bold',
    fontSize: 16
  },
  infoNote: {
    backgroundColor: '#383838',
    borderRadius: 4,
    padding: 10,
    marginTop: 8
  },
  infoNoteText: {
    color: '#fff',
    fontSize: 13,
  },
  uploadSuccessContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 100,
  },
  uploadedTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  uploadedMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  uploadedSubMessage: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  uploadAnotherBtn: {
    backgroundColor: '#9bec00',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  uploadAnotherBtnText: {
    color: '#242620',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadBtnDisabled: {
    opacity: 0.7,
  },
});
