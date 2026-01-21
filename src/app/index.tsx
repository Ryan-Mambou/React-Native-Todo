import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AdvancedFilter from '../components/advancedFilter';
import { Todo } from "../types/todo";
import { supabase } from "../utils/supabase";


export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTab, setActiveTab] = useState<('all' | 'active' | 'done')>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('Newest First');

  const handleTabPress = (tab: 'all' | 'active' | 'done') => {
    setActiveTab(tab);
  };


  const handleShowFilterModal = () => {
    setShowFilterModal(true);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSelectedSort('Newest First');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedPriority !== 'All' || selectedSort !== 'Newest First';
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from('Todos').select('*');
      if (error) {
        console.error('Error fetching todos:', error);
      } else {
        setTodos(data);
      }
    };
    fetchTodos();
  }, []);
  

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
        <View style={styles.headerTopLeft}>
          <Text>My Tasks</Text>
          <Text>10 tasks remaining</Text>
        </View>
        <View style={styles.headerTopRight}>
          <Ionicons name="color-palette-outline" size={24} color="black" />
          <Text>Manage Categories</Text>
        </View>
        </View>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search-outline" size={24} color="gray" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search tasks..." 
        placeholderTextColor="gray" />
      </View>
        <View style={styles.headerBottom}>
          <View style={styles.statusFilter}>
            {['All', 'Active', 'Done'].map((status) => (
              <Text key={status} style={[styles.tabText, activeTab === status ? styles.activeTabText : {}]}
              onPress={() => handleTabPress(status as 'all' | 'active' | 'done')}>
                {status}
              </Text>
            ))}
          </View>
          <AdvancedFilter onHandleShowFilterModal={handleShowFilterModal} hasActiveFilters={hasActiveFilters} />
        </View>
      </View>

    <View
    >
      <View>
      <Text>Back into react native!</Text>
      </View>
    </View>

    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <Pressable 
        style={styles.modalOverlay}
        onPress={() => setShowFilterModal(false)}
      >
        <Pressable style={styles.filterModal} onPress={(e) => e.stopPropagation()}>
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Category</Text>
            <View style={styles.filterOptions}>
              {['All', 'Personal', 'Work', 'Shopping'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    selectedCategory === category && styles.filterOptionSelected
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedCategory === category && styles.filterOptionTextSelected
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Priority</Text>
            <View style={styles.filterOptions}>
              {['All', 'High', 'Medium', 'Low'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.filterOption,
                    selectedPriority === priority && styles.filterOptionSelectedPriority
                  ]}
                  onPress={() => setSelectedPriority(priority)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedPriority === priority && styles.filterOptionTextSelected
                  ]}>
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <View style={styles.filterOptions}>
              {['Newest First', 'Due Date', 'Priority', 'A-Z'].map((sort) => (
                <TouchableOpacity
                  key={sort}
                  style={[
                    styles.filterOption,
                    selectedSort === sort && styles.filterOptionSelectedPriority
                  ]}
                  onPress={() => setSelectedSort(sort)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedSort === sort && styles.filterOptionTextSelected
                  ]}>
                    {sort}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.clearFiltersButton}
            onPress={handleClearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear Filters</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
    <TouchableOpacity style={styles.addTaskButton} onPress={() => {}}>
      <Ionicons name="add-outline" size={24} color="white" />
    </TouchableOpacity>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',

  },
  headerTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomColor: 'gray',
    marginBottom: 10,
  },

  headerTopLeft: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  headerTopRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInputContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    paddingLeft: 40,
  },
  searchIcon: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -2 }], 
  },
  headerBottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomColor: 'gray',
  },
  statusFilter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    gap: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  activeTabText: {
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
  },
  tabText: {
    color: 'gray',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterOptionSelected: {
    backgroundColor: '#4CAF50',
  },
  filterOptionSelectedPriority: {
    backgroundColor: '#1A1A1A',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  clearFiltersButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  addTaskButton: {
    backgroundColor: 'black',
    color: 'white',
    padding: 10,
    borderRadius: 20,
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
