import React, { useState } from 'react';
import { ArrowLeft, Clock, Utensils, Heart, MessageSquare, Edit3, Trash2, ThumbsUp, RotateCcw } from 'lucide-react';
import type { Recipe } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleLike: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentUser: { name: string; avatar: string };
  onAddComment: (recipeId: string, content: string) => void;
  onDeleteComment: (recipeId: string, commentId: string) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onBack,
  onToggleFavorite,
  onToggleLike,
  onEdit,
  onDelete,
  currentUser,
  onAddComment,
  onDeleteComment,
}) => {
  const [servingsSlider, setServingsSlider] = useState(recipe.servings);
  const [commentText, setCommentText] = useState('');

  const scaleRatio = servingsSlider / recipe.servings;

  const formatAmount = (amount: number) => {
    const scaled = amount * scaleRatio;
    return parseFloat(scaled.toFixed(2));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(recipe.id, commentText);
    setCommentText('');
  };

  const getDifficultyLabel = (diff: Recipe['difficulty']) => {
    switch (diff) {
      case 'easy': return { label: '簡單', color: 'bg-green-50 text-green-700 border-green-200' };
      case 'medium': return { label: '中等', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
      case 'hard': return { label: '困難', color: 'bg-red-50 text-red-700 border-red-200' };
      default: return { label: '簡單', color: 'bg-green-50 text-green-700 border-green-200' };
    }
  };

  const difficulty = getDifficultyLabel(recipe.difficulty);
  const isAuthor = recipe.author === currentUser.name;
  const isLiked = recipe.likedBy?.includes(currentUser.name) || false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回與操作 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5 mr-1.5" />
          返回食譜列表
        </button>

        {isAuthor ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(recipe.id)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5 mr-1 text-gray-400" />
              編輯
            </button>
            <button
              onClick={() => {
                if (window.confirm('確定要刪除這道食譜嗎？')) {
                  onDelete(recipe.id);
                }
              }}
              className="inline-flex items-center px-3 py-1.5 border border-red-100 rounded-lg text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1 text-red-400" />
              刪除
            </button>
          </div>
        ) : (
          <div className="flex items-center text-xs font-semibold text-pink-700 bg-pink-50 border border-pink-100/50 rounded-full px-3.5 py-1.5 shadow-2xs">
            ✍️ 發布者：{recipe.author}
          </div>
        )}
      </div>

      {/* 標題與封面圖 */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="relative aspect-video w-full max-h-[400px] overflow-hidden bg-gray-50">
          <img
            src={recipe.coverImage}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {recipe.tags.map((tag) => (
                <span key={tag} className="text-xs font-bold bg-white/20 backdrop-blur-xs text-white px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {recipe.title}
            </h1>
            <p className="text-white/80 text-sm max-w-2xl font-medium">
              {recipe.description || '暫無食譜簡介'}
            </p>
          </div>

          {/* 互動按鈕群組 (右上角) */}
          <div className="absolute top-6 right-6 flex items-center space-x-2.5">
            {/* 點讚按鈕 */}
            <button
              onClick={() => onToggleLike(recipe.id)}
              className={`inline-flex items-center px-4 py-2.5 rounded-full text-xs font-bold shadow-md transition-all backdrop-blur-xs ${
                isLiked
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-white/90 text-gray-700 hover:bg-white hover:text-orange-500'
              }`}
              title={isLiked ? '取消點讚' : '給食譜點讚'}
            >
              <ThumbsUp className={`h-4.5 w-4.5 mr-1.5 ${isLiked ? 'fill-white text-white' : 'text-gray-600'}`} />
              {recipe.likesCount || 0}
            </button>

            {/* 收藏按鈕 */}
            <button
              onClick={() => onToggleFavorite(recipe.id)}
              className="p-3 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md hover:text-pink-500 transition-colors backdrop-blur-xs"
              title={recipe.isFavorite ? '編輯收藏清單' : '收藏此食譜'}
            >
              <Heart 
                className={`h-4.5 w-4.5 transition-all ${
                  recipe.isFavorite ? 'fill-pink-500 text-pink-500 scale-110' : 'text-gray-600'
                }`} 
              />
            </button>
          </div>
        </div>

        {/* 屬性面板 */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 py-6 text-center bg-gray-50/50">
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">準備難度</span>
            <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border ${difficulty.color}`}>
              {difficulty.label}
            </span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">烹飪時間</span>
            <span className="inline-flex items-center text-sm font-bold text-gray-800">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              {recipe.cookTime} 分鐘
            </span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">發布日期</span>
            <span className="text-sm font-bold text-gray-800">
              {recipe.createdAt}
            </span>
          </div>
        </div>

        {/* 食材與份量調整 */}
        <div className="p-6 sm:p-8">
          <div className="bg-pink-50/40 border border-pink-100/50 rounded-2xl p-5 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  第三階段特色互動
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-800 flex items-center">
                    <Utensils className="h-4.5 w-4.5 mr-1.5 text-pink-500" />
                    份量調整：{servingsSlider} 人份 (原始為 {recipe.servings} 人份)
                  </h3>
                  {servingsSlider !== recipe.servings && (
                    <button
                      type="button"
                      onClick={() => setServingsSlider(recipe.servings)}
                      className="inline-flex items-center text-xs font-bold text-pink-600 hover:text-pink-700 bg-white border border-pink-200 px-2 py-0.5 rounded-md transition-all shadow-2xs"
                      title="還原為原始設定份量"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      還原預設
                    </button>
                  )}
                </div>
              </div>
              <div className="flex-1 max-w-xs flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={servingsSlider}
                  onChange={(e) => setServingsSlider(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <span className="font-bold text-pink-600 text-sm w-12 text-right">
                  {servingsSlider} 人份
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 食材清單 (佔 1 欄) */}
            <div className="md:col-span-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                食材清單
              </h3>
              <ul className="space-y-3.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between items-center text-sm border-b border-dashed border-gray-50 pb-2">
                    <span className="text-gray-700 font-medium">{ing.name}</span>
                    <span className="font-bold text-pink-600">
                      {formatAmount(ing.amount)} <span className="text-xs text-gray-500 font-normal">{ing.unit}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 烹飪步驟 (佔 2 欄) */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                料理步驟
              </h3>
              <div className="space-y-6">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-pink-500 text-white font-bold text-sm shadow-xs">
                        {i + 1}
                      </span>
                      {i < recipe.steps.length - 1 && (
                        <div className="w-0.5 h-full bg-pink-100 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-gray-800 text-sm leading-relaxed mb-3">
                        {step.instruction}
                      </p>
                      {step.image && (
                        <div className="rounded-xl overflow-hidden max-w-md border border-gray-100">
                          <img
                            src={step.image}
                            alt={`步驟 ${i + 1}`}
                            className="w-full h-auto object-cover max-h-48"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 留言板區塊 */}
        <div className="border-t border-gray-100 p-6 sm:p-8 bg-gray-50/30">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-pink-500" />
            心得分享 ({recipe.comments?.length || 0})
          </h3>

          {/* 新增留言 */}
          <form onSubmit={handleCommentSubmit} className="flex gap-3 items-start mb-6">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-9 w-9 rounded-full bg-gray-100 border border-pink-100"
            />
            <div className="flex-1">
              <textarea
                rows={2}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`以「${currentUser.name}」身份留言，分享您烹飪這道菜的心得...`}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:outline-hidden text-sm bg-white resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50 transition-colors"
                >
                  送出留言
                </button>
              </div>
            </div>
          </form>

          {/* 留言列表 */}
          <div className="space-y-4">
            {recipe.comments && recipe.comments.length > 0 ? (
              recipe.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs group">
                  <img
                    src={comment.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${comment.author}`}
                    alt={comment.author}
                    className="h-8 w-8 rounded-full bg-gray-100 shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800">{comment.author}</span>
                        <span className="text-[10px] text-gray-400">{comment.createdAt}</span>
                      </div>
                      {/* 只有留言本人可以刪除留言 */}
                      {comment.author === currentUser.name && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('確定要刪除這則心得分享嗎？')) {
                              onDeleteComment(recipe.id, comment.id);
                            }
                          }}
                          className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                          title="刪除這則心得"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs">
                尚未有心得分享，快來當第一個留言的人吧！
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
