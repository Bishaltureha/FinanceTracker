import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Storage} from '../storage/storage';
import {
  Expense,
  Category,
  DEFAULT_CATEGORIES,
  SortOption,
  FilterOption,
} from '../utils/types';
import ExpenseCard from '../components/ExpenseCard';
import {width, height, font} from '../utils/responsive';
const AllTransactionsScreen = () => {
  const navigation = useNavigation();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [searchText, setSearchText] = useState('');

  // can be done better with context
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const storedExpenses = await Storage.getExpenses();
        const storedCategories = await Storage.getCategories();

        setExpenses(storedExpenses);

        const allCategories = [
          ...DEFAULT_CATEGORIES,
          ...storedCategories.filter(
            sc => !DEFAULT_CATEGORIES.some(dc => dc.name === sc.name),
          ),
        ];
        setCategories(allCategories);
      };
      loadData();
    }, []),
  );

  const filteredAndSortedExpenses = expenses
    .filter(exp =>
      filterOption === 'all' ? true : exp.category === filterOption,
    )
    .filter(exp =>
      exp.note?.toLowerCase().includes(searchText.toLowerCase() || ''),
    )
    .sort((a, b) => {
      if (sortOption === 'latest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortOption === 'amount') {
        return b.amount - a.amount;
      }
      return 0;
    });

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={font(24)} color="#2F7E79" />
        </TouchableOpacity>
        <Text style={styles.header}>All Transactions</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by note..."
          value={searchText}
          placeholderTextColor="#666666"
          onChangeText={text => setSearchText(text)}
        />
      </View>

      {/* Filters Row */}
      <View style={styles.filtersContainerRow}>
        {/* Category Dropdown */}
        <View style={styles.filterItemRow}>
          <Text style={styles.filterLabel}>Category:</Text>
          <Dropdown
            style={styles.dropdownRow}
            data={[
              {label: 'All Categories', value: 'all'},
              ...categories.map(cat => ({label: cat.name, value: cat.name})),
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Category"
            placeholderStyle={{fontSize: font(16)}}
            value={filterOption}
            autoScroll={false}
            onChange={item => setFilterOption(item.value)}
            renderItem={item => (
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </View>
            )}
            selectedTextStyle={{
              color: filterOption === 'all' ? '#666666' : '#666666',
              fontSize: font(16),
            }}
            maxHeight={height(200)}
          />
        </View>

        {/* Sort Dropdown */}
        <View style={styles.filterItemRow}>
          <Text style={styles.filterLabel}>Sort:</Text>
          <Dropdown
            style={styles.dropdownRow}
            data={[
              {label: 'Latest First', value: 'latest'},
              {label: 'Highest Amount', value: 'amount'},
            ]}
            labelField="label"
            valueField="value"
            placeholder="Sort By"
            value={sortOption}
            onChange={item => setSortOption(item.value)}
            renderItem={item => (
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </View>
            )}
            selectedTextStyle={{
              color: filterOption === 'latest' ? '#666666' : '#666666',
              fontSize: font(16),
            }}
            maxHeight={height(200)}
          />
        </View>
      </View>

      {/* Expenses List */}
      <View style={styles.expensesList}>
        {filteredAndSortedExpenses.length === 0 ? (
          <Text style={styles.noExpensesText}>No expenses found</Text>
        ) : (
          filteredAndSortedExpenses.map(exp => (
            <ExpenseCard
              key={exp.id}
              emoji={exp.emoji}
              name={exp.category}
              date={new Date(exp.date).toDateString()}
              amount={exp.amount}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default AllTransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width(15),
    marginTop: Platform.OS === 'ios' ? height(64) : height(20),
    marginBottom: Platform.OS === 'ios' ? height(20) : height(40),
  },
  header: {
    fontSize: font(20),
    fontWeight: '600',
    textAlign: 'center',
    color: '#2F7E79',
  },
  headerSpacer: {
    width: width(24),
  },
  searchContainer: {
    marginTop: height(4),
    paddingHorizontal: width(15),
  },
  searchInput: {
    height: height(45),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: width(8),
    paddingHorizontal: width(10),
    fontSize: font(14),
  },
  filtersContainerRow: {
    marginTop: height(20),
    paddingHorizontal: width(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterItemRow: {
    flex: 1,
    marginRight: width(10),
  },
  filterLabel: {
    fontSize: font(14),
    fontWeight: '500',
    marginBottom: height(5),
    color: '#000000',
  },
  dropdownRow: {
    height: height(45),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: width(8),
    paddingHorizontal: width(10),
  },
  dropdownItem: {
    padding: height(10),
  },
  dropdownItemText: {
    fontSize: font(14),
    color: '#000000',
  },
  expensesList: {
    padding: width(20),
  },
  noExpensesText: {
    textAlign: 'center',
    marginTop: height(20),
    color: '#666',
  },
});
