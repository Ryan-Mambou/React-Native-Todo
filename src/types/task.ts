export interface Task {
    title: string;
    description: string;
    categoryId: string;
    priority: string;
    dueDate: Date;
    status?: 'pending' | 'completed';
    created_at?: Date;
    updated_at?: Date;
}