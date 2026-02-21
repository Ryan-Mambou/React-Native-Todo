import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../../types/category';
import { Task } from '../../types/task';
import { DeleteTaskModal } from './deleteTaskModal/deleteTaskModal';
import { useDeleteTaskModal } from './deleteTaskModal/hooks/useDeleteTaskModal';
import { useUpdateTaskModal } from './updateTaskModal/hooks/useUpdateTaskModal';
import { UpdateTaskModal } from './updateTaskModal/updateTaskModal';

interface TaskItemProps {
    task: Task;
    category?: Category;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

const TaskItem = ({ task, category, isCompleted, onToggleComplete }: TaskItemProps) => {
    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}`;
    };
    const { isOpen: isUpdateModalOpen, openModal: openUpdateModal, closeModal: closeUpdateModal, taskToEdit, formState: updateFormState, onSubmit: updateOnSubmit, isSubmitting: isUpdating } = useUpdateTaskModal();
    const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, handleCancel: handleDeleteCancel, handleDelete, isDeleting } = useDeleteTaskModal();


    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return { bg: '#FEE2E2', text: '#DC2626' };
            case 'medium':
                return { bg: '#FEF3C7', text: '#D97706' };
            case 'low':
                return { bg: '#D1FAE5', text: '#059669' };
            default:
                return { bg: '#FEF3C7', text: '#D97706' };
        }
    };

    const priorityColors = getPriorityColor(task.priority);

    return (
        <View style={[styles.container, isCompleted && styles.completedContainer]}>
            <View style={styles.leftSection}>
                <TouchableOpacity style={styles.checkboxContainer} onPress={onToggleComplete}>
                    {isCompleted ? (
                        <Ionicons name="checkmark-circle" size={24} color="black" />
                    ) : (
                        <Ionicons name="ellipse-outline" size={24} color="#9CA3AF" />
                    )}
                </TouchableOpacity>

                <View style={styles.taskDetails}>
                    <Text style={[styles.taskTitle, isCompleted && styles.completedText]}>{task.title}</Text>
                    <Text style={[styles.taskDescription, isCompleted && styles.completedText]}>{task.description}</Text>

                    <View style={styles.metaRow}>
                        {category && (
                            <View style={[styles.categoryTag, { backgroundColor: category.color }]}>
                                <Text style={styles.categoryText}>{category.name}</Text>
                            </View>
                        )}
                        <View style={styles.dateContainer}>
                            <Ionicons name="calendar-outline" size={14} color="#EF4444" />
                            <Text style={styles.dateText}>{formatDate(task.dueDate)}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.rightSection}>
                <View style={[styles.priorityTag, { backgroundColor: priorityColors.bg }]}>
                    <Text style={[styles.priorityText, { color: priorityColors.text }]}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Text>
                </View>
                <View style={styles.actionButtons}>
                    <Ionicons name='pencil-outline' size={18} color="#9CA3AF" onPress={() => openUpdateModal(task)} />
                    <Ionicons name='trash-outline' size={18} color="#9CA3AF" onPress={() => task.id && openDeleteModal(task.id)} />
                </View>
            </View>
            <Modal visible={isUpdateModalOpen} transparent animationType="fade" onRequestClose={closeUpdateModal}>
                <UpdateTaskModal
                    task={taskToEdit}
                    onClose={closeUpdateModal}
                    formState={updateFormState}
                    onSubmit={updateOnSubmit}
                    isSubmitting={isUpdating}
                />
            </Modal>
            <Modal visible={isDeleteModalOpen} transparent={true} animationType="fade" onRequestClose={handleDeleteCancel}>
                <DeleteTaskModal onCancel={handleDeleteCancel} onDelete={handleDelete} isDeleting={isDeleting} />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    completedContainer: {
        opacity: 0.5,
    },
    leftSection: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
    checkboxContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    taskDetails: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    taskDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
        marginLeft: 0,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryTag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#EF4444',
        fontWeight: '500',
    },
    priorityTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 2,
    },
    priorityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    rightSection: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
    },
    completedText: {
        textDecorationLine: 'line-through',
    },
});

export default TaskItem;