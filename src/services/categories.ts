import { Category } from "../types/category";
import { supabase } from "../utils/supabase";

export const categoriesService = {
    getCategories: async (): Promise<Category[]> => {
        const { data, error } = await supabase.from('Category').select('*');
        if (error) {
            throw error;
        }
        return data;
    },
    createCategory: async (category: Category) => {
        const { data, error } = await supabase.from('Category').insert(category);
        if (error) {
            throw error;
        }
        return data;
    },
    updateCategory: async (id: string, category: Category) => {
        const { data, error } = await supabase.from('Category').update(category).eq('id', id);
        if (error) {
            throw error;
        }
        return data;
    },
    deleteCategory: async (id: string) => {
        const { data, error } = await supabase.from('Category').delete().eq('id', id);
        if (error) {
            throw error;
        }
        return data;
    }
}