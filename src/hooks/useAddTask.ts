import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import todoService from '../services/task';
import { Task } from '../types/task';

interface AddTaskFormData {
    title: string;
    description?: string;
    category_id: string;
    priority: string;
    dueDate: Date;
}

const schema: yup.ObjectSchema<AddTaskFormData> = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().optional(),
    category_id: yup.string().required('Category is required'),
    priority: yup.string().required('Priority is required'),
    dueDate: yup.date().required('Due date is required'),
}) as yup.ObjectSchema<AddTaskFormData>;

interface UseAddTaskProps {
    onHandleCloseAddTaskModal: () => void;
}

export const useAddTask = ({ onHandleCloseAddTaskModal }: UseAddTaskProps) => {
    const queryClient = useQueryClient();
    const formState = useForm<AddTaskFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            category_id: '',
            priority: '',
            dueDate: new Date(),
        },
    });

    const { handleSubmit } = formState;

    const { mutate: addTask, isPending } = useMutation({
        mutationFn: async (payload: AddTaskFormData) => {

            const task: Task = {
                title: payload.title,
                description: payload.description || '',
                category_id: Number(payload.category_id),
                priority: payload.priority,
                dueDate: payload.dueDate,
            };

            return todoService.createTask(task);
        },
        onSuccess: () => {
            formState.reset();
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            onHandleCloseAddTaskModal();
        }
    });

    const onSubmit = (data: AddTaskFormData) => {
        addTask(data);
    };

    return {
        formState,
        onSubmit: handleSubmit(onSubmit),
        isSubmitting: isPending,
    };
};