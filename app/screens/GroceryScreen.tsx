// GroceryScreen.tsx
// Displays the user's grocery list grouped by category.
// Supports adding, editing, checking off, deleting items, and sharing the list.
import React, { useState } from 'react';
import { Share } from 'react-native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import AddGroceryModal from '../components/AddGroceryModal';

const initialGroceryData = {
  Produce: [
    { id: '1', name: 'grape tomatoes', quantity: '½ pint', checked: false },
    { id: '2', name: 'carrots', quantity: '', checked: false },
  ],
  Pantry: [
    { id: '3', name: 'salt', quantity: '', checked: false },
    { id: '4', name: 'baking powder', quantity: '', checked: false },
  ],
};

export default function GroceryScreen() {
  const [groceryList, setGroceryList] = useState(initialGroceryData);
  const [showModal, setShowModal] = useState(false);  
  const [editingItem, setEditingItem] = useState<{
  category: string;
  item: {
    id: string;
    name: string;
    quantity: string;
    checked: boolean;
  };
} | null>(null);


  const toggleChecked = (category: string, id: string) => {
    const updated = { ...groceryList };
    updated[category] = updated[category].map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setGroceryList(updated);
  };
  const handleDeleteItem = (category: string, id: string) => {
    const updated = { ...groceryList };
    updated[category] = updated[category].filter(item => item.id !== id);
    setGroceryList(updated);
  };
  const startEditingItem = (category: string, item: any) => {
    setEditingItem({ category, item });
    setShowModal(true);
  };
  const handleAddItem = (category: string, newItem: any) => {
    setGroceryList((prev) => {
      const updated = { ...prev };
      if (!updated[category]) updated[category] = [];
      updated[category].push(newItem);
      return updated;
    });
    setShowModal(false);
  };
  const handleShareList = async () => {
  let sharedText = '';

  Object.entries(groceryList).forEach(([category, items]) => {
    const uncheckedItems = items.filter(item => !item.checked);
    if (uncheckedItems.length > 0) {
      sharedText += `\n🧺 ${category}:\n`;
      uncheckedItems.forEach(item => {
        sharedText += `• ${item.name}${item.quantity ? ` (${item.quantity})` : ''}\n`;
      });
    }
  });

  if (!sharedText.trim()) {
    sharedText = 'Your grocery list is empty or all items are checked.';
  }

  try {
    await Share.share({
      title: 'My Grocery List',
      message: sharedText,
    });
  } catch (error) {
    console.error('Error sharing list:', error);
  }
};

  return (
  <SafeAreaView style={styles.container}>
    <View style={styles.headerRow}>
  <Text style={styles.title}>My Grocery List</Text>
  <TouchableOpacity onPress={handleShareList} style={styles.shareBox}>
    <Ionicons name="share-outline" size={22} color="#4CAF50" />
  </TouchableOpacity>
</View>



    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      {Object.entries(groceryList).map(([category, items]) => (
        <View key={category} style={styles.categoryBlock}>
          <Text style={styles.categoryTitle}>{category}</Text>
          {items.map((item) => (
            <Swipeable
              key={item.id}
              renderRightActions={() => (
                <TouchableOpacity
                  onPress={() => handleDeleteItem(category, item.id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash-outline" size={24} color="white" />
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                style={styles.itemCard}
                onPress={() => toggleChecked(category, item.id)}
                onLongPress={() => startEditingItem(category, item)}
              >
                <Ionicons
                  name={item.checked ? 'checkbox' : 'square-outline'}
                  size={22}
                  color="#4CAF50"
                />
                <View style={{ marginLeft: 12 }}>
                  <Text
                    style={[
                      styles.itemText,
                      item.checked && styles.checked,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {item.quantity ? (
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            </Swipeable>
          ))}
        </View>
      ))}
    </ScrollView>

    {/* Floating Add Button */}
    <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
      <Ionicons name="add" size={28} color="white" />
    </TouchableOpacity>

    {/* Add/Edit Modal */}
    <AddGroceryModal
      visible={showModal}
      onClose={() => {
        setShowModal(false);
        setEditingItem(null);
      }}
      onAdd={handleAddItem}
      editingItem={editingItem}
    />
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9FCD7',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  categoryBlock: {
    marginTop: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#222',
  },
  quantityText: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  checked: {
    textDecorationLine: 'line-through',
    color: '#AAA',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#FFA726',
    padding: 18,
    borderRadius: 32,
    elevation: 5,
    zIndex: 999,
  },
  deleteBtn: {
  backgroundColor: '#FFA726',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
  marginVertical: 6,
  borderRadius: 12,
},
headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},

shareBox: {
  backgroundColor: 'white',
  borderRadius: 12,
  padding: 10,
  elevation: 2,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 4,
},
});
