import React from 'react';
import { Heart, Clock, Utensils, Edit3, Trash2, ThumbsUp } from 'lucide-react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onEdit: (e: React.MouseEvent, id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  currentUserName: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onClick,
  onToggleFavorite,
  onEdit,
  onDelete,
  currentUserName,
}) => {
  const getDifficultyLabel = (diff: Recipe['difficulty']) => {
    switch (diff) {
      case 'easy':
        return { label: '簡單', color: 'bg-green-50 text-green-700 border-green-200' };
      case 'medium':
        return { label: '中等', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
      case 'hard':
        return { label: '困難', color: 'bg-red-50 text-red-700 border-red-200' };
      default:
        return { label: '簡單', color: 'bg-green-50 text-green-700 border-green-200' };
    }
  };

  const difficulty = getDifficultyLabel(recipe.difficulty);
  const isAuthor = recipe.author === currentUserName;

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-1"
    >
      {/* 封面照片與標記 */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-50">
        <img
          src={recipe.coverImage || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80'}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* 收藏按鈕 */}
        <button
          onClick={(e) => onToggleFavorite(e, recipe.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-xs hover:text-pink-500 transition-colors backdrop-blur-xs"
        >
          <Heart 
            className={`h-4.5 w-4.5 transition-all ${
              recipe.isFavorite ? 'fill-pink-500 text-pink-500 scale-110' : 'text-gray-600'
            }`} 
          />
        </button>

        {/* 難度標籤 */}
        <span className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-xs font-semibold border backdrop-blur-xs ${difficulty.color}`}>
          {difficulty.label}
        </span>
      </div>

      {/* 內容區 */}
      <div className="p-4 flex-1 flex flex-col">
        {/* 標題與標籤 */}
        <div className="mb-2">
          <div className="flex flex-wrap gap-1.5 mb-1.5 items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>
            {/* 發布作者 */}
            <span className="text-[9px] font-semibold text-pink-700 bg-pink-50 border border-pink-100 rounded-md px-1.5 py-0.5 max-w-[85px] truncate" title={`發布者: ${recipe.author}`}>
              ✍️ {recipe.author}
            </span>
          </div>
          <h3 className="font-bold text-gray-800 text-base line-clamp-1 group-hover:text-pink-500 transition-colors">
            {recipe.title}
          </h3>
        </div>

        {/* 簡短介紹 */}
        <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">
          {recipe.description || '這道美味的料理還沒有填寫簡介。'}
        </p>

        {/* 底部屬性列 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-[11px] font-medium text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-0.5 text-gray-400" />
              {recipe.cookTime} 分
            </span>
            <span className="flex items-center">
              <Utensils className="h-3.5 w-3.5 mr-0.5 text-gray-400" />
              {recipe.servings} 人份
            </span>
            <span className="flex items-center text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-sm border border-gray-100/50">
              <ThumbsUp className="h-3 w-3 mr-0.5 text-gray-400" />
              {recipe.likesCount || 0}
            </span>
          </div>

          {/* 後台操作按鈕 - 僅限發布作者本人 */}
          {isAuthor && (
            <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => onEdit(e, recipe.id)}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                title="編輯此食譜"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => onDelete(e, recipe.id)}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                title="刪除此食譜"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
