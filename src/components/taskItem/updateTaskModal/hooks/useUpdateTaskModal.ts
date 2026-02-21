import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import taskService from '../../../../services/task';
import { Task } from '../../../../types/task';

interface UpdateTaskFormData {
    title: string;
    description?: string;
    category_id: string;
    priority: string;
    dueDate: Date;
}

const schema: yup.ObjectSchema<UpdateTaskFormData> = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().optional(),
    category_id: yup.string().optional(),
    priority: yup.string().required('Priority is required'),
    dueDate: yup.date().required('Due date is required'),
}) as yup.ObjectSchema<UpdateTaskFormData>;

export const useUpdateTaskModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const queryClient = useQueryClient();

    const formState = useForm<UpdateTaskFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            category_id: '',
            priority: 'medium',
            dueDate: new Date(),
        },
    });

    const { handleSubmit, reset } = formState;

    useEffect(() => {
        if (taskToEdit) {
            const dueDate = typeof taskToEdit.dueDate === 'string'
                ? new Date(taskToEdit.dueDate)
                : taskToEdit.dueDate;
            reset({
                title: taskToEdit.title,
                description: taskToEdit.description || '',
                category_id: taskToEdit.category_id != null ? String(taskToEdit.category_id) : '',
                priority: taskToEdit.priority || 'medium',
                dueDate: dueDate || new Date(),
            });
        }
    }, [taskToEdit, reset]);

    const { mutate: updateTask, isPending } = useMutation({
        mutationFn: async (payload: UpdateTaskFormData) => {
            if (!taskToEdit?.id) throw new Error('Task id is required');
            const updatedTask: Task = {
                ...taskToEdit,
                title: payload.title,
                description: payload.description || '',
                category_id: payload.category_id ? Number(payload.category_id) : taskToEdit.category_id,
                priority: payload.priority,
                dueDate: payload.dueDate,
            };
            return taskService.updateTask(taskToEdit.id, updatedTask);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            closeModal();
        },
    });

    const openModal = useCallback((task: Task) => {
        setTaskToEdit(task);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setTaskToEdit(null);
    }, []);

    const onSubmit = handleSubmit((data) => updateTask(data));

    return {
        isOpen,
        openModal,
        closeModal,
        taskToEdit,
        formState,
        onSubmit,
        isSubmitting: isPending,
    };
};
