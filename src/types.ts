export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Step {
  instruction: string;
  image?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  cookTime: number; // in minutes
  servings: number; // default number of portions
  createdAt: string;
  isFavorite?: boolean;
  comments?: Comment[];
  author: string; // 發布此食譜的虛擬用戶名
  likesCount?: number; // 點讚數
  likedBy?: string[]; // 點讚的使用者清單
  collections?: string[]; // 收藏清單 ID 陣列
}

export interface Collection {
  id: string;
  name: string;
}
