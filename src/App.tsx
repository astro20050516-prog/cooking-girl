import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SearchFilter } from './components/SearchFilter';
import { RecipeCard } from './components/RecipeCard';
import { RecipeForm } from './components/RecipeForm';
import { RecipeDetail } from './components/RecipeDetail';
import { DEFAULT_RECIPES } from './data/defaultRecipes';
import type { Recipe, Collection } from './types';
import { ChefHat, Trash2 } from 'lucide-react';

const USERS = [
  { name: '新手廚娘小花', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lily' },
  { name: '美食探險家阿明', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Buster' },
  { name: '烘焙達人莉莉', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Missy' }
];

const DEFAULT_COLLECTIONS: Collection[] = [
  { id: 'col-1', name: '🍳 快手早餐' },
  { id: 'col-2', name: '🥘 經典午晚餐' },
  { id: 'col-3', name: '🧁 烘焙挑戰' }
];

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentPage, setCurrentPage] = useState<'list' | 'create' | 'detail'>('list');
  const [activeRecipeId, setActiveRecipeId] = useState<string | undefined>(undefined);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // 搜尋、篩選與排序狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');

  // 當前用戶狀態
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const currentUser = USERS[currentUserIndex];

  // 收藏清單彈窗狀態
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [activeCollectionRecipeId, setActiveCollectionRecipeId] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');

  // 載入資料
  useEffect(() => {
    // 載入食譜
    const savedRecipes = localStorage.getItem('cooking-girl-recipes');
    if (savedRecipes) {
      try {
        setRecipes(JSON.parse(savedRecipes));
      } catch (e) {
        setRecipes(DEFAULT_RECIPES);
      }
    } else {
      setRecipes(DEFAULT_RECIPES);
      localStorage.setItem('cooking-girl-recipes', JSON.stringify(DEFAULT_RECIPES));
    }

    // 載入收藏清單
    const savedCollections = localStorage.getItem('cooking-girl-collections');
    if (savedCollections) {
      try {
        setCollections(JSON.parse(savedCollections));
      } catch (e) {
        setCollections(DEFAULT_COLLECTIONS);
      }
    } else {
      setCollections(DEFAULT_COLLECTIONS);
      localStorage.setItem('cooking-girl-collections', JSON.stringify(DEFAULT_COLLECTIONS));
    }
  }, []);

  // 儲存食譜
  const saveRecipes = (updatedRecipes: Recipe[]) => {
    setRecipes(updatedRecipes);
    localStorage.setItem('cooking-girl-recipes', JSON.stringify(updatedRecipes));
  };

  // 切換用戶
  const handleSwitchUser = () => {
    setCurrentUserIndex((prev) => (prev + 1) % USERS.length);
  };

  // 新增或更新食譜
  const handleAddOrUpdateRecipe = (formData: Omit<Recipe, 'id' | 'createdAt' | 'comments' | 'isFavorite' | 'author' | 'likesCount' | 'likedBy' | 'collections'> & { id?: string }) => {
    const today = new Date().toISOString().split('T')[0];
    
    if (formData.id) {
      // 編輯模式
      const updated = recipes.map((r) => {
        if (r.id === formData.id) {
          return {
            ...r,
            ...formData,
            comments: r.comments || [],
            isFavorite: r.isFavorite || false,
            collections: r.collections || [],
          } as Recipe;
        }
        return r;
      });
      saveRecipes(updated);
      alert('食譜修改成功！');
    } else {
      // 新增模式
      const newRecipe: Recipe = {
        ...formData,
        id: `recipe-${Date.now()}`,
        createdAt: today,
        isFavorite: false,
        comments: [],
        author: currentUser.name,
        likesCount: 0,
        likedBy: [],
        collections: [],
      };
      saveRecipes([newRecipe, ...recipes]);
      alert('食譜發布成功！');
    }
    
    setEditingRecipe(null);
    setCurrentPage('list');
  };

  // 刪除食譜
  const handleDeleteRecipe = (id: string) => {
    const updated = recipes.filter((r) => r.id !== id);
    saveRecipes(updated);
    if (activeRecipeId === id) {
      setCurrentPage('list');
      setActiveRecipeId(undefined);
    }
  };

  // 打開收藏清單彈窗
  const handleOpenCollectionModal = (id: string) => {
    setActiveCollectionRecipeId(id);
    setShowCollectionModal(true);
  };

  // 把食譜加入或移出特定的收藏清單
  const handleToggleRecipeCollection = (recipeId: string, colId: string) => {
    const updated = recipes.map((r) => {
      if (r.id === recipeId) {
        const cols = r.collections || [];
        const isExist = cols.includes(colId);
        const newCols = isExist ? cols.filter(id => id !== colId) : [...cols, colId];
        return {
          ...r,
          collections: newCols,
          // 只要有加入任何一個收藏清單，就算是收藏狀態
          isFavorite: newCols.length > 0,
        };
      }
      return r;
    });
    saveRecipes(updated);
  };

  // 建立新收藏清單
  const handleCreateCollection = () => {
    const name = newCollectionName.trim();
    if (!name) return;
    
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name: name,
    };
    const updated = [...collections, newCol];
    setCollections(updated);
    localStorage.setItem('cooking-girl-collections', JSON.stringify(updated));
    setNewCollectionName('');
  };

  // 刪除收藏清單
  const handleDeleteCollection = (colId: string) => {
    if (!window.confirm('確定要刪除這個收藏清單嗎？（該清單內的食譜不會被刪除）')) return;
    const updatedCols = collections.filter(c => c.id !== colId);
    setCollections(updatedCols);
    localStorage.setItem('cooking-girl-collections', JSON.stringify(updatedCols));
    if (selectedCollectionId === colId) {
      setSelectedCollectionId('');
    }
    // 同步移除所有食譜中該清單 ID
    const updatedRecipes = recipes.map(r => {
      if (r.collections?.includes(colId)) {
        const newCols = r.collections.filter(id => id !== colId);
        return {
          ...r,
          collections: newCols,
          isFavorite: newCols.length > 0,
        };
      }
      return r;
    });
    saveRecipes(updatedRecipes);
  };

  // 切換點讚狀態
  const handleToggleLike = (id: string) => {
    const updated = recipes.map((r) => {
      if (r.id === id) {
        const likedBy = r.likedBy || [];
        const likesCount = r.likesCount || 0;
        if (likedBy.includes(currentUser.name)) {
          return {
            ...r,
            likesCount: Math.max(0, likesCount - 1),
            likedBy: likedBy.filter((name) => name !== currentUser.name),
          };
        } else {
          return {
            ...r,
            likesCount: likesCount + 1,
            likedBy: [...likedBy, currentUser.name],
          };
        }
      }
      return r;
    });
    saveRecipes(updated);
  };

  // 新增留言
  const handleAddComment = (recipeId: string, content: string) => {
    const todayStr = new Date().toLocaleString('zh-TW', { hour12: false }).replace(/\//g, '-');
    const newComment = {
      id: `comment-${Date.now()}`,
      author: currentUser.name,
      avatar: currentUser.avatar,
      content,
      createdAt: todayStr,
    };

    const updated = recipes.map((r) => {
      if (r.id === recipeId) {
        return {
          ...r,
          comments: [...(r.comments || []), newComment],
        };
      }
      return r;
    });
    saveRecipes(updated);
  };

  // 刪除留言（限留言本人）
  const handleDeleteComment = (recipeId: string, commentId: string) => {
    const updated = recipes.map((r) => {
      if (r.id === recipeId) {
        return {
          ...r,
          comments: (r.comments || []).filter(c => c.id !== commentId),
        };
      }
      return r;
    });
    saveRecipes(updated);
  };

  // 頁面跳轉
  const handleNavigate = (page: 'list' | 'create' | 'detail', recipeId?: string) => {
    setCurrentPage(page);
    if (recipeId) {
      setActiveRecipeId(recipeId);
    }
    if (page === 'create') {
      setEditingRecipe(null);
    }
  };

  // 獲取所有獨特的 tags 供篩選
  const allTags = Array.from(
    new Set(recipes.flatMap((r) => r.tags || []))
  );

  // 篩選與排序邏輯
  const filteredRecipes = recipes
    .filter((recipe) => {
      // 搜尋關鍵字
      const matchSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchTag = selectedTag ? recipe.tags.includes(selectedTag) : true;
      const matchDifficulty = selectedDifficulty ? recipe.difficulty === selectedDifficulty : true;
      
      // 收藏清單多級過濾
      let matchCollection = true;
      if (selectedCollectionId === 'all-fav') {
        matchCollection = recipe.isFavorite || false;
      } else if (selectedCollectionId !== '') {
        matchCollection = recipe.collections?.includes(selectedCollectionId) || false;
      }

      return matchSearch && matchTag && matchDifficulty && matchCollection;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'time-asc') {
        return a.cookTime - b.cookTime;
      }
      if (sortBy === 'time-desc') {
        return b.cookTime - a.cookTime;
      }
      if (sortBy === 'difficulty-asc') {
        const diffWeight = { easy: 1, medium: 2, hard: 3 };
        return diffWeight[a.difficulty] - diffWeight[b.difficulty];
      }
      return 0;
    });

  const activeRecipe = recipes.find((r) => r.id === activeRecipeId);
  const activeCollectionRecipe = recipes.find((r) => r.id === activeCollectionRecipeId);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col text-left">
      <Navbar
        onNavigate={handleNavigate}
        recipes={recipes}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentPage === 'list' && (
          <div>
            {/* 熱門橫幅 */}
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-3xl p-6 sm:p-10 text-white mb-8 shadow-xs">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">今天，想做點什麼料理呢？</h2>
                <p className="text-white/80 text-sm sm:text-base mb-6">
                  Cooking Girl 提供您多樣化且實用的食譜，支援份量自由換算、智慧搜尋與完整步驟說明，快來發掘並分享屬於您的美味吧！
                </p>
                <button
                  onClick={() => handleNavigate('create')}
                  className="bg-white text-pink-600 font-bold px-6 py-2.5 rounded-full hover:bg-pink-50 transition-colors shadow-xs"
                >
                  開始分享食譜
                </button>
              </div>
            </div>

            {/* 搜尋篩選區 */}
            <SearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedCollectionId={selectedCollectionId}
              setSelectedCollectionId={setSelectedCollectionId}
              collections={collections}
              allTags={allTags}
            />

            {/* 食譜卡片列表 */}
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    currentUserName={currentUser.name}
                    onClick={() => handleNavigate('detail', recipe.id)}
                    onToggleFavorite={(e, id) => {
                      e.stopPropagation();
                      handleOpenCollectionModal(id);
                    }}
                    onEdit={(e, id) => {
                      e.stopPropagation();
                      const toEdit = recipes.find((r) => r.id === id);
                      if (toEdit) {
                        setEditingRecipe(toEdit);
                        setCurrentPage('create');
                      }
                    }}
                    onDelete={(e, id) => {
                      e.stopPropagation();
                      if (window.confirm('確定要刪除這道食譜嗎？')) {
                        handleDeleteRecipe(id);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
                <ChefHat className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-1">找不到符合的食譜</h3>
                <p className="text-gray-400 text-sm">試著換個搜尋關鍵字或清除篩選條件吧！</p>
              </div>
            )}
          </div>
        )}

        {currentPage === 'create' && (
          <RecipeForm
            initialRecipe={editingRecipe}
            onSubmit={handleAddOrUpdateRecipe}
            onCancel={() => {
              setEditingRecipe(null);
              setCurrentPage('list');
            }}
          />
        )}

        {currentPage === 'detail' && activeRecipe && (
          <RecipeDetail
            recipe={activeRecipe}
            onBack={() => setCurrentPage('list')}
            onToggleFavorite={handleOpenCollectionModal}
            onToggleLike={handleToggleLike}
            onEdit={(id) => {
              const toEdit = recipes.find((r) => r.id === id);
              if (toEdit) {
                setEditingRecipe(toEdit);
                setCurrentPage('create');
              }
            }}
            onDelete={handleDeleteRecipe}
            currentUser={currentUser}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        )}
      </main>

      {/* 收藏清單多選與管理彈窗 */}
      {showCollectionModal && activeCollectionRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-gray-100 transform scale-100 transition-all text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
              📁 編輯收藏清單
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              勾選要把<strong>「{activeCollectionRecipe.title}」</strong>加入哪些清單：
            </p>
            
            {/* 清單列表 */}
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4 pr-1">
              {collections.map((col) => {
                const hasIt = activeCollectionRecipe.collections?.includes(col.id) || false;
                return (
                  <div key={col.id} className="flex items-center justify-between p-2 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 flex-1">
                      <input
                        type="checkbox"
                        checked={hasIt}
                        onChange={() => handleToggleRecipeCollection(activeCollectionRecipe.id, col.id)}
                        className="rounded-md border-gray-300 text-pink-500 focus:ring-pink-500 h-4 w-4"
                      />
                      <span className="truncate">{col.name}</span>
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCollection(col.id);
                      }}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors ml-2"
                      title="刪除此清單"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 建立新清單 */}
            <div className="pt-3 border-t border-gray-100 mb-6">
              <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">
                ➕ 建立新收藏清單
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="例如：週日野餐趣"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-pink-500 focus:outline-hidden text-xs"
                />
                <button
                  type="button"
                  onClick={handleCreateCollection}
                  className="px-3 py-1.5 bg-pink-50 text-pink-500 hover:bg-pink-100 rounded-lg text-xs font-bold transition-colors"
                >
                  建立
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setShowCollectionModal(false);
                setActiveCollectionRecipeId(null);
              }}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
            >
              完成並關閉
            </button>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-gray-100 py-6 mt-12 text-center text-xs text-gray-400 font-medium">
        &copy; 2026 Cooking Girl. All rights reserved. 點擊頂部頭像可切換不同模擬身分喔！
      </footer>
    </div>
  );
}

export default App;
