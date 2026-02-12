import { Category } from "../types/category";

const adaptCategoryToSelectInput = (category: Category) => {
    return {
        label: category.name,
        value: String(category.id),
    };
};

export default adaptCategoryToSelectInput;