import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SelectModal from './selectModal';

interface AddTaskModalProps {
  onHandleCloseAddTaskModal: () => void;
}

export const AddTaskModal = ({ onHandleCloseAddTaskModal }: AddTaskModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('No category');
  const [selectedPriority, setSelectedPriority] = useState<string>('Medium');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [selected, setSelected] = useState<Date>();
  const categories = ['No category', 'Personal', 'Work', 'Shopping'];
  const priorities = ['Low', 'Medium', 'High'];


  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setSelected(selectedDate);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryPicker(false);
  };

  const handlePrioritySelect = (priority: string) => {
    setSelectedPriority(priority);
    setShowPriorityPicker(false);
  };

  return (
    <Pressable style={styles.modalOverlay} onPress={onHandleCloseAddTaskModal}>
      <Pressable style={styles.addTaskModal} onPress={(e) => e.stopPropagation()}>
        <View style={styles.addTaskModalHeader}>
          <Text style={styles.addTaskModalTitle}>Add New Task</Text>
          <TouchableOpacity onPress={onHandleCloseAddTaskModal}>
            <Ionicons name="close-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Task Name *</Text>
          <TextInput
            style={styles.addTaskModalInput}
            placeholder="What needs to be done?"
            placeholderTextColor="gray"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.addTaskModalInput, styles.descriptionInput]}
            placeholder="Add some details..."
            placeholderTextColor="gray"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Category</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => setShowCategoryPicker(true)}>
            <Text style={styles.dropdownText}>{selectedCategory}</Text>
            <Ionicons name="chevron-down-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Priority</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => setShowPriorityPicker(true)}>
            <Text style={styles.dropdownText}>{selectedPriority}</Text>
            <Ionicons name="chevron-down-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Due Date</Text>
          <View style={styles.dateInputContainer}>
            <DateTimePicker
              mode="date"
              value={selected ?? new Date()}
              onChange={(event, selectedDate) => handleDateChange(selectedDate)}
            />
          </View>
        </View>

        <View style={styles.actionRowContainer}>
          <TouchableOpacity style={styles.addTaskModalButton} onPress={() => { }}>
            <Text style={styles.addTaskModalButtonText}>Add Task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelTaskModalButton} onPress={onHandleCloseAddTaskModal}>
            <Text style={styles.cancelTaskModalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
      <Modal
        visible={showCategoryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <SelectModal title="Select Category" options={categories} selectedOption={selectedCategory} onSelect={handleCategorySelect} onClose={() => setShowCategoryPicker(false)} />
      </Modal>
      <Modal
        visible={showPriorityPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPriorityPicker(false)}
      >
        <SelectModal title="Select Priority" options={priorities} selectedOption={selectedPriority} onSelect={handlePrioritySelect} onClose={() => setShowPriorityPicker(false)} />
      </Modal>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  addTaskModal: {
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
  addTaskModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  addTaskModalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: 'black',
    backgroundColor: 'white',
  },
  descriptionInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  calendarIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  dateInput: {
    paddingLeft: 40,
  },
  actionRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 5,
  },
  addTaskModalButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 12,
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelTaskModalButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelTaskModalButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  addTaskModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  priorityItem: {
    fontSize: 16,
    color: 'black',
  },
  priorityItemText: {
    fontSize: 16,
    color: 'black',
  },
});


