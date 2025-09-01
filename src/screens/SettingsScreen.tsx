import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {Storage} from '../storage/storage';
import {Category} from '../utils/types';
import {generateId} from '../utils/dateUtils';

const SettingsScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const loadedCategories = await Storage.getCategories();
      setCategories(loadedCategories);
    } catch (error) {
      Alert.alert('Error', 'Failed to load categories');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCategories();
    }, []),
  );

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    if (
      categories.some(
        cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase(),
      )
    ) {
      Alert.alert('Error', 'A category with this name already exists');
      return;
    }

    setLoading(true);
    try {
      const newCategory: Category = {
        id: generateId(),
        name: newCategoryName.trim(),
        emoji: newCategoryEmoji.trim() || '💰',
      };

      await Storage.addCategory(newCategory);
      await loadCategories();

      setShowAddModal(false);
      setNewCategoryName('');
      setNewCategoryEmoji('');

      Alert.alert('Success', `Added category: ${newCategory.name}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string,
  ) => {
    // Check if it's a default category
    const defaultCategoryNames = [
      'Food',
      'Transport',
      'Shopping',
      'Bills',
      'Other',
    ];
    if (defaultCategoryNames.includes(categoryName)) {
      Alert.alert('Error', 'Cannot delete default categories');
      return;
    }

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await Storage.deleteCategory(categoryId);
              await loadCategories();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete category');
            }
          },
        },
      ],
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all expenses and custom categories. Are you absolutely sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'This action cannot be undone. All your expense data will be lost forever.',
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Delete Everything',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await Storage.clearAllData();
                      await Storage.initializeDefaultCategories();
                      await loadCategories();
                      Alert.alert('Success', 'All data has been cleared');
                    } catch (error) {
                      Alert.alert('Error', 'Failed to clear data');
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  const renderCategoryItem = ({item}: {item: Category}) => {
    const isDefault = [
      'Food',
      'Transport',
      'Shopping',
      'Bills',
      'Other',
    ].includes(item.name);

    return (
      <View style={styles.categoryItem}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryEmoji}>{item.emoji || '💰'}</Text>
          <Text style={styles.categoryName}>{item.name}</Text>
          {isDefault && <Text style={styles.defaultTag}>Default</Text>}
        </View>
        {!isDefault && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteCategory(item.id, item.name)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowAddModal(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowAddModal(false)}
            style={styles.modalCancelButton}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Category</Text>
          <TouchableOpacity
            onPress={handleAddCategory}
            style={[
              styles.modalSaveButton,
              loading && styles.modalSaveButtonDisabled,
            ]}
            disabled={loading}>
            <Text style={styles.modalSaveText}>
              {loading ? 'Adding...' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Category Name *</Text>
            <TextInput
              style={styles.modalInput}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Enter category name"
              maxLength={50}
            />
            <Text style={styles.modalHelper}>
              Choose a descriptive name for your category
            </Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Emoji (Optional)</Text>
            <TextInput
              style={styles.modalInput}
              value={newCategoryEmoji}
              onChangeText={setNewCategoryEmoji}
              placeholder="Pick an emoji (e.g., 🎮, 🏥, ⛽)"
              maxLength={2}
            />
            <Text style={styles.modalHelper}>
              Add an emoji to make your category more visual
            </Text>
          </View>

          {newCategoryName && (
            <View style={styles.modalPreview}>
              <Text style={styles.modalPreviewTitle}>Preview</Text>
              <View style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryEmoji}>
                    {newCategoryEmoji || '💰'}
                  </Text>
                  <Text style={styles.categoryName}>
                    {newCategoryName || 'Category Name'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesContainer}>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearAllData}>
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
          <Text style={styles.dangerHelper}>
            This will permanently delete all expenses and custom categories
          </Text>
        </View>
      </ScrollView>

      {renderAddModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    marginTop: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    flex: 1,
  },
  defaultTag: {
    backgroundColor: '#E5E5EA',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 12,
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerHelper: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalCancelButton: {
    padding: 4,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  modalSaveButton: {
    padding: 4,
  },
  modalSaveButtonDisabled: {
    opacity: 0.5,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1C1C1E',
  },
  modalInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  modalHelper: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
  },
  modalPreview: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  modalPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1C1C1E',
  },
});

export default SettingsScreen;
