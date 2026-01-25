import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AdvancedFilter from '../components/advancedFilter';
import { AddTaskModal } from '../components/modals/addTaskModal';
import { FiterModal } from '../components/modals/fiterModal';
import { Todo } from "../types/todo";
import { supabase } from "../utils/supabase";


export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTab, setActiveTab] = useState<('all' | 'active' | 'done')>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('Newest First');

  const handleTabPress = (tab: 'all' | 'active' | 'done') => {
    setActiveTab(tab);
  };


  const handleShowFilterModal = () => {
    setShowFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSelectedSort('Newest First');
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSelectPriority = (priority: string) => {
    setSelectedPriority(priority);
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedPriority !== 'All' || selectedSort !== 'Newest First';

  const handleSelectSort = (sort: string) => {
    setSelectedSort(sort);
  };

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
            <Text style={styles.headerTopLeftTitle}>My Tasks</Text>
            <Text style={styles.headerTopLeftSubtitle}>10 tasks remaining</Text>
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


      <View style={styles.taskContainer}>
        <View style={styles.noTaskContainer}>
          <Ionicons name="today-outline" size={40} color="black" style={styles.noTaskContainerIcon} />
          <View style={styles.noTaskContainerTitleContainer}>
            <Text style={styles.noTaskContainerTitle}>No task yet</Text>
            <Text style={styles.noTaskContainerSubtitle}>Tap the + button to add your first task</Text>
          </View>
        </View>
      </View>


      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseFilterModal}
      >
        <FiterModal selectedCategory={selectedCategory} selectedPriority={selectedPriority}
          selectedSort={selectedSort} onHandleCloseFilterModal={handleCloseFilterModal} hasActiveFilters={hasActiveFilters}
          onHandleClearFilters={handleClearFilters} onHandleSelectCategory={handleSelectCategory}
          onHandleSelectPriority={handleSelectPriority} onHandleSelectSort={handleSelectSort} />
      </Modal>
      <TouchableOpacity style={styles.addTaskButton} onPress={() => setShowAddTaskModal(true)}>
        <Ionicons name="add-outline" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        visible={showAddTaskModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddTaskModal(false)}
      >
        <AddTaskModal onHandleCloseAddTaskModal={() => setShowAddTaskModal(false)} />
      </Modal>
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
  headerTopLeftTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTopLeftSubtitle: {
    fontSize: 16,
    color: 'gray',
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
  taskContainer: {
  },
  noTaskContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 20,
    marginTop: 100,
  },
  noTaskContainerIcon: {
    backgroundColor: 'lightgray',
    borderRadius: 100,
    padding: 20,
  },
  noTaskContainerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  noTaskContainerSubtitle: {
    fontSize: 16,
    color: 'gray',
  },
  noTaskContainerTitleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
});
