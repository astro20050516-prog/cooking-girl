import React, { useState } from 'react';
import { ChefHat, Shuffle, Plus } from 'lucide-react';
import type { Recipe } from '../types';

interface NavbarProps {
  onNavigate: (page: 'list' | 'create' | 'detail', recipeId?: string) => void;
  recipes: Recipe[];
  currentUser: { name: string; avatar: string };
  onSwitchUser: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  recipes,
  currentUser,
  onSwitchUser,
}) => {
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedRecipe, setRecommendedRecipe] = useState<Recipe | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [recommendCategory, setRecommendCategory] = useState<string>('');

  const allTags = Array.from(
    new Set(recipes.flatMap((r) => r.tags || []))
  );

  const handleRandomRecommend = () => {
    const pool = recommendCategory
      ? recipes.filter((r) => r.tags?.includes(recommendCategory))
      : recipes;

    if (pool.length === 0) {
      alert(`在此分類「${recommendCategory}」下目前尚無食譜，請重新選擇分類！`);
      return;
    }

    setIsSpinning(true);
    
    // 模擬轉盤滾動效果
    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setRecommendedRecipe(pool[randomIndex]);
      count++;
      if (count > 8) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 150);
  };

  const openRecommendationModal = () => {
    setRecommendedRecipe(null);
    setRecommendCategory('');
    setShowRecommendation(true);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer hover:opacity-90"
            onClick={() => onNavigate('list')}
          >
            <ChefHat className="h-8 w-8 text-pink-500 mr-2" />
            <span className="font-bold text-xl bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
              Cooking Girl
            </span>
            <span className="ml-2 text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-medium">
              食譜分享平台
            </span>
          </div>

          {/* 右側操作 */}
          <div className="flex items-center space-x-3">
            {/* 今天吃什麼 */}
            <button
              onClick={openRecommendationModal}
              className="inline-flex items-center px-3 py-2 border border-orange-200 rounded-full text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              <Shuffle className="h-4 w-4 mr-1.5" />
              今天吃什麼
            </button>

            {/* 新增食譜 */}
            <button
              onClick={() => onNavigate('create')}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-full text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              分享食譜
            </button>

            {/* 用戶身分切換 */}
            <button
              onClick={onSwitchUser}
              className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-xs"
              title="點擊切換虛擬用戶"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-6 w-6 rounded-full mr-2 bg-gray-100 border border-pink-200"
              />
              <span className="max-w-[80px] truncate">{currentUser.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 隨機推薦浮窗 */}
      {showRecommendation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-gray-100 transform scale-100 transition-all">
            <h3 className="text-xl font-bold text-center text-gray-900 mb-4 flex items-center justify-center">
              🎲 今天吃什麼推薦 🎲
            </h3>
            
            {/* 分類選取器 (抽選前必選) */}
            <div className="mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-100/50">
              <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider text-center">
                👉 請先選擇想吃的料理分類
              </label>
              <select
                disabled={isSpinning}
                value={recommendCategory}
                onChange={(e) => setRecommendCategory(e.target.value)}
                className="w-full text-xs font-semibold text-gray-700 border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-hidden focus:ring-1 focus:ring-pink-500 text-center"
              >
                <option value="">🔮 不限分類 (隨機推薦)</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    🏷️ {tag}
                  </option>
                ))}
              </select>
            </div>

            {recommendedRecipe ? (
              <div className={`transition-all duration-300 ${isSpinning ? 'opacity-50 blur-[1px] scale-95' : 'opacity-100 scale-100'}`}>
                <div className="relative rounded-2xl overflow-hidden aspect-video mb-4 border border-gray-100">
                  <img
                    src={recommendedRecipe.coverImage}
                    alt={recommendedRecipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    ⏰ {recommendedRecipe.cookTime}分鐘
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-800 text-center mb-1">
                  {recommendedRecipe.title}
                </h4>
                <p className="text-sm text-gray-500 text-center line-clamp-2 px-2 mb-4">
                  {recommendedRecipe.description}
                </p>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 mb-4 p-4 text-center">
                <Shuffle className="h-10 w-10 text-gray-300 mb-2 animate-bounce" />
                <span className="text-xs font-medium">選好上面的分類後，點擊下方按鈕開始抽籤！</span>
              </div>
            )}

            <div className="flex space-x-3 mt-4">
              <button
                disabled={isSpinning}
                onClick={handleRandomRecommend}
                className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {recommendedRecipe ? '再抽一次' : '🎲 開始推薦'}
              </button>
              <button
                disabled={isSpinning || !recommendedRecipe}
                onClick={() => {
                  if (recommendedRecipe) {
                    onNavigate('detail', recommendedRecipe.id);
                    setShowRecommendation(false);
                  }
                }}
                className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 disabled:opacity-50"
              >
                決定是它了！
              </button>
            </div>

            <button
              onClick={() => setShowRecommendation(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
