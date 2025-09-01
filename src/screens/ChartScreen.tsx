import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {PieChart, BarChart} from 'react-native-chart-kit';
import {Dropdown} from 'react-native-element-dropdown';
import {useFocusEffect} from '@react-navigation/native';

import {Storage} from '../storage/storage';
import {Expense} from '../utils/types';
import {calculateCategoryBreakdown} from '../utils/dateUtils';
import {width, height, font} from '../utils/responsive';

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.5,
  style: {borderRadius: 16},
};

const ChartScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const [monthOptions, setMonthOptions] = useState<
    {label: string; value: string}[]
  >([]);
  const [yearOptions, setYearOptions] = useState<
    {label: string; value: string}[]
  >([]);

  const loadData = async () => {
    try {
      const loadedExpenses = await Storage.getExpenses();
      setExpenses(loadedExpenses);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  // Populate years when expenses change
  useEffect(() => {
    if (!expenses || expenses.length === 0) return;

    const years = Array.from(
      new Set(expenses.map(exp => new Date(exp.date).getFullYear())),
    )
      .sort((a, b) => b - a)
      .map(year => ({label: `${year}`, value: `${year}`}));

    setYearOptions(years);

    if (!selectedYear) {
      const nowYear = new Date().getFullYear().toString();
      setSelectedYear(
        years.find(y => y.value === nowYear)?.value || years[0]?.value || null,
      );
    }
  }, [expenses]);

  // Populate months when year changes
  useEffect(() => {
    if (!selectedYear) return;

    const filteredExpenses = expenses.filter(
      exp => new Date(exp.date).getFullYear().toString() === selectedYear,
    );

    const months = Array.from(
      new Set(
        filteredExpenses.map(exp =>
          String(new Date(exp.date).getMonth() + 1).padStart(2, '0'),
        ),
      ),
    )
      .sort((a, b) => Number(a) - Number(b))
      .map(monthStr => {
        const date = new Date(Number(selectedYear), Number(monthStr) - 1);
        return {
          label: date.toLocaleString('default', {month: 'long'}),
          value: monthStr,
        };
      });

    setMonthOptions(months);

    if (!selectedMonth) {
      const nowMonth = String(new Date().getMonth() + 1).padStart(2, '0');
      setSelectedMonth(
        months.find(m => m.value === nowMonth)?.value ||
          months[months.length - 1]?.value ||
          null,
      );
    }
  }, [selectedYear, expenses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderMonthYearDropdowns = () => (
    <View style={styles.dropdownRow}>
      <Dropdown
        style={[styles.dropdown, {flex: 1, marginRight: width(8)}]}
        data={monthOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Month"
        value={selectedMonth}
        onChange={item => setSelectedMonth(item.value)}
      />
      <Dropdown
        style={[styles.dropdown, {flex: 1, marginLeft: width(8)}]}
        data={yearOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Year"
        value={selectedYear}
        onChange={item => setSelectedYear(item.value)}
      />
    </View>
  );

  const renderPieChart = () => {
    if (!selectedMonth || !selectedYear) {
      return (
        <View style={styles.chartCard}>
          {renderMonthYearDropdowns()}
          <Text style={styles.noData}>Please select month and year</Text>
        </View>
      );
    }

    const filteredBreakdown = calculateCategoryBreakdown(
      expenses,
      Number(selectedMonth),
      Number(selectedYear),
    );

    if (!filteredBreakdown || filteredBreakdown.length === 0) {
      return (
        <View style={styles.chartCard}>
          {renderMonthYearDropdowns()}
          <Text style={styles.noData}>No expenses for selected month/year</Text>
        </View>
      );
    }

    const totalSpent = filteredBreakdown.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    const data = filteredBreakdown.map((item, index) => ({
      name: `${item.category} (${((item.total / totalSpent) * 100).toFixed(
        1,
      )}%)`,
      population: item.total,
      color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index % 5],
    }));

    return (
      <View style={styles.chartCard}>
        {renderMonthYearDropdowns()}
        <Text style={styles.chartTitle}>Monthly Spending by Category</Text>
        <PieChart
          data={data}
          width={width(320)}
          height={height(220)}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="4"
          absolute
          hasLegend={false}
          center={[width(80), 0]}
        />
        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: item.color}]}
              />
              <Text style={styles.legendText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderBarChart = () => {
    if (!expenses || expenses.length === 0)
      return <Text style={styles.noData}>No expenses this week</Text>;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const dailyTotals: number[] = Array(7).fill(0);

    expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      expDate.setHours(0, 0, 0, 0);
      const amount = Number(exp.amount);
      if (
        !isNaN(expDate.getTime()) &&
        amount > 0 &&
        expDate >= startOfWeek &&
        expDate <= today
      ) {
        const dayIndex = expDate.getDay();
        dailyTotals[dayIndex] += amount;
      }
    });

    const barColors = [
      '#36A2EB',
      '#FF6384',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#8A2BE2',
    ];
    const todayIndex = today.getDay();

    const data = {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          data: dailyTotals,
          colors: dailyTotals.map(
            (_, i) => () =>
              i === todayIndex ? '#FF4500' : barColors[i % barColors.length],
          ),
        },
      ],
    };

    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Daily Spending (This Week)</Text>
        <BarChart
          data={data}
          width={width(320)}
          height={height(220)}
          fromZero
          yAxisSuffix=""
          yAxisLabel="₹"
          chartConfig={{
            ...chartConfig,
            fillShadowGradientFromOpacity: 1,
            fillShadowGradientToOpacity: 1,
          }}
          verticalLabelRotation={0}
          showBarTops
          withInnerLines={false}
          showValuesOnTopOfBars
        />
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}>
      <Text style={styles.label}>Category spends</Text>
      {renderPieChart()}
      {renderBarChart()}
    </ScrollView>
  );
};

export default ChartScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F2F2F7', marginTop: height(40)},
  scrollContent: {
    padding: width(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height(32),
  },
  label: {
    fontSize: font(22),
    fontWeight: '600',
    marginBottom: height(20),
    color: '#000000',
    alignSelf: 'flex-start',
  },
  chartCard: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width(12),
    padding: width(20),
    marginBottom: height(16),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
    width: '100%',
  },
  chartTitle: {
    fontSize: font(18),
    fontWeight: '600',
    marginBottom: height(12),
    color: '#1C1C1E',
  },
  noData: {
    textAlign: 'center',
    color: '#8E8E93',
    marginBottom: height(16),
    fontSize: font(14),
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: height(10),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: width(12),
    marginBottom: height(8),
    maxWidth: '45%',
  },
  legendColor: {
    width: width(12),
    height: width(12),
    marginRight: width(6),
    borderRadius: width(2),
  },
  legendText: {fontSize: font(14), color: '#1C1C1E', flexShrink: 1},
  dropdown: {
    width: '100%',
    height: height(40),
    borderRadius: width(8),
    borderWidth: 1,
    borderColor: '#C7C7CC',
    paddingHorizontal: width(12),
    backgroundColor: 'white',
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height(12),
  },
});
