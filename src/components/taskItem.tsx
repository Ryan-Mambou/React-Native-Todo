import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../types/category';
import { Task } from '../types/task';

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
        <TouchableOpacity style={[styles.container, isCompleted && styles.completedContainer]} onPress={onToggleComplete} activeOpacity={0.7}>
            <View style={styles.leftSection}>
                <View style={styles.checkboxContainer}>
                    {isCompleted ? (
                        <Ionicons name="checkmark-circle" size={24} color="black" />
                    ) : (
                        <Ionicons name="ellipse-outline" size={24} color="#9CA3AF" />
                    )}
                </View>

                <View style={styles.taskDetails}>
                    <Text style={[styles.taskTitle, isCompleted && styles.completedText]}>{task.title}</Text>
                    <Text style={[styles.taskDescription, isCompleted && styles.completedText]}>{task.description}</Text>

                    <View style={styles.metaRow}>
                        {category && (
                            <View style={[styles.categoryTag, { backgroundColor: category.color || '#9333EA' }]}>
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

            <View style={[styles.priorityTag, { backgroundColor: priorityColors.bg }]}>
                <Text style={[styles.priorityText, { color: priorityColors.text }]}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
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
    completedText: {
        textDecorationLine: 'line-through',
    },
});

export default TaskItem;