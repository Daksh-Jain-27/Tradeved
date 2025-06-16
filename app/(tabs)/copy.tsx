import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>LOGO</Text>
        <View style={styles.headerRight}>
          <Ionicons name="search" size={22} color="#bbb" style={{ marginRight: 16 }} />
          <View style={styles.avatarContainer}>
            <FontAwesome5 name="user-circle" size={28} color="#bbb" />
          </View>
        </View>
      </View>

      {/* Chart */}
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{ data: [-200, 400, -350, -200, 150, 500] }],
            }}
            width={width - 32}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""  
            chartConfig={{
              backgroundColor: '#222',
              backgroundGradientFrom: '#222',
              backgroundGradientTo: '#222',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(180, 180, 180, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(180, 180, 180, ${opacity})`,
              fillShadowGradient: '#31b0ff',
              fillShadowGradientOpacity: 0.8,
              barPercentage: 0.5,
            }}
            style={{ borderRadius: 12 }}
            fromZero
            showValuesOnTopOfBars={false}
          />
          {/* Overlay Line Chart */}
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{ data: [-100, 200, 300, 100, 400, 200] }],
            }}
            width={width - 32}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: 'transparent',
              backgroundGradientTo: 'transparent',
              color: (opacity = 1) => `rgba(255, 0, 180, ${opacity})`,
              labelColor: () => 'transparent',
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#fff',
              },
            }}
            bezier
            withVerticalLines={false}
            withHorizontalLines={false}
            withDots
            withShadow={false}
            transparent
            style={styles.lineChartOverlay}
          />
        </View>

        {/* Current Live Position */}
        <Text style={styles.sectionTitle}>Current Live Position</Text>
        <View style={styles.positionCard}>
          <Text style={styles.positionTitle}>Nifty</Text>
          <View style={styles.positionRow}>
            <View style={styles.positionItem}>
              <Text style={styles.positionLabel}>Amount</Text>
              <Text style={styles.positionValue}>10,000</Text>
            </View>
            <View style={styles.positionItem}>
              <Text style={styles.positionLabel}>ROI</Text>
              <View style={styles.roiRow}>
                <MaterialIcons name="trending-up" size={16} color="#f0a" />
                <Text style={[styles.positionValue, { color: '#f0a', marginLeft: 4 }]}>0.47%</Text>
              </View>
            </View>
            <View style={styles.positionItem}>
              <Text style={styles.positionLabel}>Unrealized PnL</Text>
              <Text style={[styles.positionValue, { color: '#f0a' }]}>47.56</Text>
            </View>
          </View>
        </View>

        <View style={styles.positionCard}>
          <Text style={styles.positionTitle}>BankNifty</Text>
          <View style={styles.positionRow}>
            <View style={styles.positionItem}>
              <Text style={styles.positionLabel}>Amount</Text>
              <Text style={styles.positionValue}>10,000</Text>
            </View>
            <View style={styles.positionItem}>
              <Text style={styles.positionLabel}>ROI</Text>
              <View style={styles.roiRow}>
                <MaterialIcons name="trending-up" size={16} color="#9f6" />
                <Text style={[styles.positionValue, { color: '#9f6', marginLeft: 4 }]}>1.57%</Text>
              </View>
            </View>
            <View style={styles.positionItem}>
              <Text style={styles.positionLabel}>Unrealized PnL</Text>
              <Text style={[styles.positionValue, { color: '#9f6' }]}>157.56</Text>
            </View>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login to Mock Data</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={22} color="#bbb" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="pie-chart-outline" size={22} color="#bbb" />
          <Text style={styles.navLabel}>Portfolio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navActive]}>
          <Ionicons name="copy-outline" size={22} color="#222" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="construct-outline" size={22} color="#bbb" />
          <Text style={styles.navLabel}>Build</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="help-circle-outline" size={22} color="#bbb" />
          <Text style={styles.navLabel}>Quest</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23251e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#23251e',
  },
  logo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    position: 'relative',
  },
  lineChartOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
    pointerEvents: 'none',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  positionCard: {
    backgroundColor: '#1a1c16',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
  },
  positionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  positionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  positionItem: {
    alignItems: 'center',
    flex: 1,
  },
  positionLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 2,
  },
  positionValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  roiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#b4ff00',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#23251e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#23251e',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 2,
  },
  navActive: {
    backgroundColor: '#b4ff00',
    borderRadius: 8,
    paddingVertical: 4,
  },
  navLabelActive: {
    color: '#23251e',
    fontWeight: 'bold',
  },
});
