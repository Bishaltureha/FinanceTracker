import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Storage} from '../storage/storage';
import {Expense, Category, DEFAULT_CATEGORIES} from '../utils/types';
import {generateId} from '../utils/dateUtils';
import {width, height, font} from '../utils/responsive';

const AddExpenseScreen = () => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Food');

  useFocusEffect(
    useCallback(() => {
      const loadCategories = async () => {
        const saved = await Storage.getCategories();
        if (saved.length === 0) {
          await Storage.saveCategories(DEFAULT_CATEGORIES);
          setCategories(DEFAULT_CATEGORIES);
        } else {
          setCategories(saved);
        }
      };
      loadCategories();
    }, []),
  );

  const handleAddExpense = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const selectedCat = categories.find(cat => cat.name === selectedCategory);

    const expense: Expense = {
      id: generateId(),
      amount: parseFloat(amount),
      emoji: selectedCat?.emoji || '💰',
      category: selectedCategory,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      name: selectedCat?.name || 'Other',
    };
    await Storage.addExpense(expense);

    setAmount('');
    setNote('');
    setSelectedCategory('Food');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}>
        {/* Amount Section */}
        <Text style={[styles.label, styles.topLabel]}>
          How much did you spend?
        </Text>
        <View style={styles.amountBox}>
          <Text style={styles.amountDisplay}>
            {amount ? `₹ ${amount}` : '₹ 0.00'}
          </Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="Enter amount"
            placeholderTextColor="#999"
            maxLength={5}
          />
        </View>

        {/* Category Dropdown */}
        <Text style={styles.label}>Category *</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.dropdownText}
          selectedTextStyle={styles.dropdownText}
          containerStyle={styles.dropdownContainer}
          data={categories.map(cat => ({
            label: `${cat.emoji} ${cat.name}`,
            value: cat.name,
          }))}
          labelField="label"
          valueField="value"
          placeholder="Select category"
          value={selectedCategory}
          onChange={item => setSelectedCategory(item.value)}
          maxHeight={200}
          renderItem={item => (
            <View style={styles.dropdownItem}>
              <Text style={styles.dropdownItemText}>{item.label}</Text>
            </View>
          )}
        />

        {/* Note */}
        <Text style={styles.label}>Note</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          value={note}
          onChangeText={setNote}
          placeholder="Optional"
          placeholderTextColor="#999"
          multiline
        />
      </ScrollView>

      {/* Add Button fixed at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    paddingHorizontal: width(20),
    paddingBottom: height(120),
  },
  topLabel: {
    marginTop: height(8),
    fontSize: font(22),
  },
  label: {
    fontSize: font(16),
    fontWeight: '600',
    marginTop: height(20),
    color: '#000000',
  },
  amountBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: height(20),
    marginTop: height(20),
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  amountDisplay: {
    fontSize: font(32),
    fontWeight: 'bold',
    color: '#2F7E79',
    marginBottom: height(10),
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: height(10),
    fontSize: font(18),
    width: '100%',
    textAlign: 'center',
    color: '#000',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: width(10),
    paddingVertical: height(12),
    marginTop: height(10),
  },
  dropdownText: {
    fontSize: font(16),
    color: '#333',
  },
  dropdownContainer: {
    borderRadius: 10,
  },
  dropdownItem: {
    padding: height(12),
  },
  dropdownItemText: {
    fontSize: font(16),
    color: '#000',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: height(10),
    marginTop: height(10),
    fontSize: font(16),
    color: '#000',
  },
  noteInput: {
    height: height(100),
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    bottom: height(20),
    left: width(20),
    right: width(20),
  },
  addButton: {
    backgroundColor: '#2F7E79',
    padding: height(15),
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: font(18),
    fontWeight: '700',
  },
});
