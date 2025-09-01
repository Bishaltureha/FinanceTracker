import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {font, height, SCREEN_WIDTH, width} from '../utils/responsive';
// import Container from '../assets/svg/container';
import {Storage} from '../storage/storage';
import {Expense} from '../utils/types';
import ExpenseCard from '../component/ExpenseCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import containerImage from '../assets/image/container.png';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [greeting, setGreeting] = useState('Good evening');
  const [totalBalance, setTotalBalance] = useState(0);
  const [todayAmount, setTodayAmount] = useState(0);
  const [weeklyAmount, setWeeklyAmount] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const hours = new Date().getHours();

  useFocusEffect(
    useCallback(() => {
      if (hours < 12) setGreeting('Good morning');
      else if (hours < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');

      Storage.initializeDefaultCategories();
      loadExpenses();
    }, []),
  );
  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  const loadExpenses = async () => {
    const storedExpenses: Expense[] = await Storage.getExpenses();
    setExpenses(storedExpenses);

    const today = new Date();
    let total = 0,
      todaySum = 0,
      weeklySum = 0,
      monthlySum = 0;

    storedExpenses.forEach(exp => {
      total += exp.amount;

      const expDate = new Date(exp.date);
      const diffTime = today.getTime() - expDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      if (expDate.toDateString() === today.toDateString())
        todaySum += exp.amount;

      if (diffDays <= 7) weeklySum += exp.amount;

      if (
        expDate.getMonth() === today.getMonth() &&
        expDate.getFullYear() === today.getFullYear()
      )
        monthlySum += exp.amount;
    });

    setTotalBalance(total);
    setTodayAmount(todaySum);
    setWeeklyAmount(weeklySum);
    setMonthlyAmount(monthlySum);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subcontainer}>
        <View style={{width: '100%', height: height(287)}}>
          <Image
            source={containerImage}
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          />
        </View>

        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.name}>Enjelin Morgeana</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllTransactions')}>
            <Ionicons name="search-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.totalLabel}>Total Expenses</Text>
            <Text style={styles.totalAmount}>₹ {totalBalance}</Text>
          </View>

          <View style={styles.cardBottom}>
            <View style={styles.rowItemContainer}>
              <Text style={styles.rowLabel}>Today</Text>
              <Text style={styles.rowAmount}>
                ₹ {formatNumber(todayAmount)}
              </Text>
            </View>
            <View style={styles.rowItemContainer}>
              <Text style={styles.rowLabel}>Weekly</Text>
              <Text style={styles.rowAmount}>
                ₹ {formatNumber(weeklyAmount)}
              </Text>
            </View>
            <View style={styles.rowItemContainer}>
              <Text style={styles.rowLabel}>Monthly</Text>
              <Text style={styles.rowAmount}>
                ₹ {formatNumber(monthlyAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Transactions history</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllTransactions')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          {expenses.length === 0 ? (
            <Text style={styles.noExpensesText}>No expenses yet</Text>
          ) : (
            expenses.slice(0, 5).map(exp => (
              <ExpenseCard
                key={exp.id}
                emoji={exp.emoji}
                name={exp.category}
                date={new Date(exp.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
                amount={exp.amount}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  subcontainer: {flex: 1},

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: Platform.OS === 'ios' ? height(72) : height(44), // example
    left: width(20),
    right: width(20),
  },
  headerText: {
    flexDirection: 'column',
  },
  greeting: {
    color: 'white',
    fontSize: font(14),
    fontWeight: '500',
  },
  name: {
    color: 'white',
    fontSize: font(20),
    fontWeight: '600',
  },

  card: {
    position: 'absolute',
    top: height(140),
    left: width(20),
    width: width(374),
    height: height(201),
    backgroundColor: '#2F7E79',
    borderRadius: height(20),
    padding: height(20),
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  cardTop: {},
  totalLabel: {
    color: 'white',
    fontSize: font(16),
    fontWeight: '600',
  },
  totalAmount: {
    color: 'white',
    fontSize: font(30),
    fontWeight: '700',
    marginTop: height(5),
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItemContainer: {
    alignItems: 'center',
  },
  rowLabel: {
    color: 'white',
    fontSize: font(16),
    fontWeight: '500',
  },
  rowAmount: {
    color: 'white',
    fontSize: font(20),
    fontWeight: '600',
    marginTop: height(5),
  },
  transactionsHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    marginTop: height(360),
    width: SCREEN_WIDTH,
    paddingHorizontal: width(20),
  },
  transactionsTitle: {
    fontWeight: '600',
    fontSize: font(18),
    color: '#222222',
  },
  seeAll: {
    fontWeight: '500',
    fontSize: font(14),
    color: '#666666',
  },
  transactionsList: {
    marginTop: height(104),
    paddingHorizontal: width(20),
  },
  noExpensesText: {
    textAlign: 'center',
    marginTop: height(20),
    color: '#666',
  },
});
