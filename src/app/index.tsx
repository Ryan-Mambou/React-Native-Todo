import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AdvancedFilter from '../components/advancedFilter';
import { AddTaskModal } from '../components/modals/addTaskModal';
import { FiterModal } from '../components/modals/fiterModal';
import TaskItem from '../components/taskItem/taskItem';
import { useCategories } from '../hooks/useGetCategories';
import { useGetTasks } from '../hooks/useGetTasks';


export default function Index() {
  const [activeTab, setActiveTab] = useState<('all' | 'active' | 'done')>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('Newest First');
  const [isCompleted, setIsCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { categories } = useCategories();
  const { tasks } = useGetTasks();


  const handleTabPress = (tab: 'all' | 'active' | 'done') => {
    setActiveTab(tab);
  };

  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
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

  const handleSearch = (text: string) => {
    setSearchQuery(text);
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

  const filteredTasks = React.useMemo(() => {
    if (!tasks) return [];
    let result = [...tasks];

    if (activeTab === 'active') {
      result = result.filter((task) => task.status !== 'completed');
    } else if (activeTab === 'done') {
      result = result.filter((task) => task.status === 'completed');
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((task) =>
        task.title.toLowerCase().includes(query) ||
        (task.description?.toLowerCase().includes(query) ?? false)
      );
    }


    if (selectedCategory !== 'All') {
      result = result.filter((task) => String(task.category_id) === selectedCategory);
    }


    if (selectedPriority !== 'All') {
      result = result.filter((task) => task.priority.toLowerCase() === selectedPriority.toLowerCase());
    }

    // Sort
    result.sort((a, b) => {
      switch (selectedSort) {
        case 'Due Date': {
          const dateA = typeof a.dueDate === 'string' ? new Date(a.dueDate).getTime() : new Date(a.dueDate).getTime();
          const dateB = typeof b.dueDate === 'string' ? new Date(b.dueDate).getTime() : new Date(b.dueDate).getTime();
          return dateA - dateB;
        }
        case 'Priority': {
          const order = { high: 0, medium: 1, low: 2 };
          const priorityA = order[a.priority?.toLowerCase() as keyof typeof order] ?? 3;
          const priorityB = order[b.priority?.toLowerCase() as keyof typeof order] ?? 3;
          return priorityA - priorityB;
        }
        case 'A-Z':
          return (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' });
        case 'Newest First':
        default: {
          const dateA = a.created_at ? (typeof a.created_at === 'string' ? new Date(a.created_at).getTime() : new Date(a.created_at).getTime()) : 0;
          const dateB = b.created_at ? (typeof b.created_at === 'string' ? new Date(b.created_at).getTime() : new Date(b.created_at).getTime()) : 0;
          return dateB - dateA;
        }
      }
    });

    return result;
  }, [tasks, activeTab, searchQuery, selectedCategory, selectedPriority, selectedSort]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View style={styles.headerTopLeft}>
            <Text style={styles.headerTopLeftTitle}>My Tasks</Text>
            <Text style={styles.headerTopLeftSubtitle}>{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} remaining</Text>
          </View>
          <View style={styles.headerTopRight}>
            <Ionicons name="color-palette-outline" size={24} color="black" />
            <Text>Manage Categories</Text>
          </View>
        </View>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={24} color="gray" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search tasks..."
            placeholderTextColor="gray" value={searchQuery} onChangeText={handleSearch} />
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
        {tasks?.length === 0 && (<View style={styles.noTaskContainer}>
          <Ionicons name="today-outline" size={40} color="black" style={styles.noTaskContainerIcon} />
          <View style={styles.noTaskContainerTitleContainer}>
            <Text style={styles.noTaskContainerTitle}>No task yet</Text>
            <Text style={styles.noTaskContainerSubtitle}>Tap the + button to add your first task</Text>
          </View>
        </View>)}

        {tasks && tasks.length > 0 && filteredTasks.length === 0 && (
          <View style={styles.noTaskContainer}>
            <Ionicons name="filter-outline" size={40} color="black" style={styles.noTaskContainerIcon} />
            <View style={styles.noTaskContainerTitleContainer}>
              <Text style={styles.noTaskContainerTitle}>No tasks match your filters</Text>
              <Text style={styles.noTaskContainerSubtitle}>Try adjusting your filters or search</Text>
            </View>
          </View>
        )}

        {filteredTasks.length > 0 && (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item, index) => item.id ?? `${item.title}-${index}`}
            renderItem={({ item }) => {
              const category = categories?.find(cat => cat.id === item.category_id);
              return <TaskItem task={item} category={category} isCompleted={isCompleted} onToggleComplete={handleToggleComplete} />;
            }}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        )}
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
    backgroundColor: '#f1f5f9',
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
    backgroundColor: '#f1f5f9',
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
    flex: 1,
  },
  noTaskContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 100,
    gap: 20,
  },
  noTaskContainerIcon: {
    backgroundColor: '#f1f5f9',
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
