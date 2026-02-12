import adaptCategoryToSelectInput from '@/src/adapters/adaptCategoryToSelectInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider } from 'react-hook-form';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAddTask } from '../../hooks/useAddTask';
import { useCategories } from '../../hooks/useGetCategories';
import SelectModal from './selectModal';
interface AddTaskModalProps {
  onHandleCloseAddTaskModal: () => void;
}

export const AddTaskModal = ({ onHandleCloseAddTaskModal }: AddTaskModalProps) => {
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const priorities = [{
    label: 'Low',
    value: 'low',
  }, {
    label: 'Medium',
    value: 'medium',
  }, {
    label: 'High',
    value: 'high',
  }]
  const { categories } = useCategories();
  const categoriesOptions = categories?.map(adaptCategoryToSelectInput) || [];
  const { formState, onSubmit, isSubmitting } = useAddTask({ onHandleCloseAddTaskModal });
  const { control, setValue, getValues, watch, formState: { errors } } = formState;


  const selectedCategory = watch('category_id') ?? '';
  const selectedPriority = watch('priority') ?? 'medium';
  const selectedDate = watch('dueDate');

  useEffect(() => {
    setValue('priority', 'medium');
    setValue('dueDate', new Date());
  }, [setValue]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setValue('dueDate', selectedDate, { shouldValidate: true });
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setValue('category_id', categoryId, { shouldValidate: true });
    setShowCategoryPicker(false);
  };

  const handlePrioritySelect = (priority: string) => {
    setValue('priority', priority, { shouldValidate: true });
    setShowPriorityPicker(false);
  };


  return (
    <FormProvider {...formState}>
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
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    style={[
                      styles.addTaskModalInput,
                      errors.title && styles.inputError
                    ]}
                    placeholder="What needs to be done?"
                    placeholderTextColor="gray"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {errors.title && (
                    <Text style={styles.errorText}>{errors.title.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    style={[
                      styles.addTaskModalInput,
                      styles.descriptionInput,
                      errors.description && styles.inputError
                    ]}
                    placeholder="Add some details..."
                    placeholderTextColor="gray"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {errors.description && (
                    <Text style={styles.errorText}>{errors.description.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category</Text>
            <Controller
              control={control}
              name="category_id"
              render={({ field: { value } }) => (
                <>
                  <TouchableOpacity
                    style={[
                      styles.dropdownInput,
                      errors.category_id && styles.inputError
                    ]}
                    onPress={() => setShowCategoryPicker(true)}
                  >
                    <Text style={styles.dropdownText}>{categoriesOptions.find(cat => String(cat.value) === String(value ?? ''))?.label || 'No category'}</Text>
                    <Ionicons name="chevron-down-outline" size={20} color="gray" />
                  </TouchableOpacity>
                  {errors.category_id && (
                    <Text style={styles.errorText}>{errors.category_id.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Priority</Text>
            <Controller
              control={control}
              name="priority"
              render={({ field: { value } }) => (
                <>
                  <TouchableOpacity
                    style={[
                      styles.dropdownInput,
                      errors.priority && styles.inputError
                    ]}
                    onPress={() => setShowPriorityPicker(true)}
                  >
                    <Text style={styles.dropdownText}>{priorities.find(priority => priority.value === value)?.label || 'Medium'}</Text>
                    <Ionicons name="chevron-down-outline" size={20} color="gray" />
                  </TouchableOpacity>
                  {errors.priority && (
                    <Text style={styles.errorText}>{errors.priority.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Due Date</Text>
            <Controller
              control={control}
              name="dueDate"
              render={({ field: { value } }) => (
                <>
                  <View style={styles.dateInputContainer}>
                    <DateTimePicker
                      mode="date"
                      value={value}
                      onChange={handleDateChange}
                    />
                  </View>
                  {errors.dueDate && (
                    <Text style={styles.errorText}>{errors.dueDate.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.actionRowContainer}>
            <TouchableOpacity
              style={[styles.addTaskModalButton, isSubmitting && styles.buttonDisabled]}
              onPress={onSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.addTaskModalButtonText}>
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </Text>
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
          <SelectModal title="Select Category" options={categoriesOptions} selectedOption={selectedCategory || ''} onSelect={handleCategorySelect} onClose={() => setShowCategoryPicker(false)} />
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
    </FormProvider>
  );
};

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
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
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
  buttonDisabled: {
    opacity: 0.6,
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


