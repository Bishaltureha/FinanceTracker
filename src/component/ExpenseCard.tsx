import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {width, height, font} from '../utils/responsive';

type ExpenseCardProps = {
  emoji: string;
  name: string;
  date: string;
  amount: number;
};

const ExpenseCard = ({emoji, name, date, amount}: ExpenseCardProps) => {
  return (
    <View style={styles.card}>
      {/* Left Side (Emoji + Details) */}
      <View style={styles.left}>
        <View style={styles.emojiBox}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>

        <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>

      {/* Right Side (Amount) */}
      <Text style={styles.amount}>₹{amount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: height(8),
    backgroundColor: '#fff',
    padding: width(12),
    borderRadius: width(12),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: width(4),
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f2f2f2',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiBox: {
    width: width(50),
    height: width(50),
    borderRadius: width(8),
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width(10),
  },
  emoji: {
    fontSize: font(24),
  },
  details: {
    justifyContent: 'center',
    gap: height(1),
  },
  name: {
    fontSize: font(16),
    fontWeight: '600',
    color: '#000000',
  },
  date: {
    fontSize: font(12),
    color: 'gray',
    marginTop: height(2),
  },
  amount: {
    fontSize: font(16),
    fontWeight: 'bold',
    color: '#2e86de',
  },
});

export default ExpenseCard;
