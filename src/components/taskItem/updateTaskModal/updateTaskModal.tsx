import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Controller, FormProvider, UseFormReturn } from 'react-hook-form';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import adaptCategoryToSelectInput from '../../../adapters/adaptCategoryToSelectInput';
import { useCategories } from '../../../hooks/useGetCategories';
import { Task } from '../../../types/task';
import SelectModal from '../../modals/selectModal';

interface UpdateTaskFormData {
    title: string;
    description?: string;
    category_id: string;
    priority: string;
    dueDate: Date;
}

interface UpdateTaskModalProps {
    task: Task | null;
    onClose: () => void;
    formState: UseFormReturn<UpdateTaskFormData>;
    onSubmit: () => void;
    isSubmitting: boolean;
}

const priorities = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
];

export const UpdateTaskModal = ({ task, onClose, formState, onSubmit, isSubmitting }: UpdateTaskModalProps) => {
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showPriorityPicker, setShowPriorityPicker] = useState(false);

    const { categories } = useCategories();
    const categoriesOptions = categories?.map(adaptCategoryToSelectInput) || [];

    const { control, setValue, watch, formState: { errors } } = formState;

    const selectedCategory = watch('category_id') ?? '';
    const selectedPriority = watch('priority') ?? 'medium';


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

    if (!task) return null;

    return (
        <FormProvider {...formState}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit Task</Text>
                        <TouchableOpacity onPress={onClose}>
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
                                        style={[styles.input, errors.title && styles.inputError]}
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
                                        style={[styles.input, styles.descriptionInput, errors.description && styles.inputError]}
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
                                        style={[styles.dropdownInput, errors.category_id && styles.inputError]}
                                        onPress={() => setShowCategoryPicker(true)}
                                    >
                                        <Text style={styles.dropdownText}>
                                            {categoriesOptions.find(cat => String(cat.value) === String(value ?? ''))?.label || 'No category'}
                                        </Text>
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
                                        style={[styles.dropdownInput, errors.priority && styles.inputError]}
                                        onPress={() => setShowPriorityPicker(true)}
                                    >
                                        <Text style={styles.dropdownText}>
                                            {priorities.find(p => p.value === value)?.label || 'Medium'}
                                        </Text>
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
                                            value={value || new Date()}
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

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.updateButton, isSubmitting && styles.buttonDisabled]}
                            onPress={onSubmit}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.updateButtonText}>
                                {isSubmitting ? 'Updating...' : 'Update Task'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>

            <Modal
                visible={showCategoryPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCategoryPicker(false)}
            >
                <SelectModal
                    title="Select Category"
                    options={categoriesOptions}
                    selectedOption={selectedCategory}
                    onSelect={handleCategorySelect}
                    onClose={() => setShowCategoryPicker(false)}
                />
            </Modal>
            <Modal
                visible={showPriorityPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPriorityPicker(false)}
            >
                <SelectModal
                    title="Select Priority"
                    options={priorities}
                    selectedOption={selectedPriority}
                    onSelect={handlePrioritySelect}
                    onClose={() => setShowPriorityPicker(false)}
                />
            </Modal>
        </FormProvider>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
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
    input: {
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
        alignItems: 'flex-start',
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 12,
    },
    updateButton: {
        flex: 4,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
});
