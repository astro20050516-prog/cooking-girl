import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, Image as ImageIcon, Camera } from 'lucide-react';
import type { Recipe, Ingredient, Step } from '../types';

interface RecipeFormProps {
  initialRecipe?: Recipe | null;
  onSubmit: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'comments' | 'isFavorite' | 'author' | 'likesCount' | 'likedBy'> & { id?: string }) => void;
  onCancel: () => void;
}

interface FormIngredient extends Ingredient {
  isCustomUnit?: boolean;
}

const COMMON_UNITS = ['克', '公克', '毫升', 'ml', '顆', '個', '片', '隻', '條', '把', '匙', '大匙', '小匙', '杯', '適量', '少許', '自訂'];

const isPresetUnit = (unit: string) => COMMON_UNITS.filter(u => u !== '自訂').includes(unit);

// 前端 Canvas 圖片壓縮：防止 Base64 塞爆 LocalStorage 5MB 配額
const compressImage = (file: File, maxWidth = 1000, quality = 0.72): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const RecipeForm: React.FC<RecipeFormProps> = ({
  initialRecipe,
  onSubmit,
  onCancel,
}) => {
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(2);
  
  // 食材狀態（擴充 isCustomUnit 旗標，避免打字時輸入框突然消失）
  const [ingredients, setIngredients] = useState<FormIngredient[]>([
    { name: '', amount: 0, unit: '克', isCustomUnit: false }
  ]);
  
  // 步驟狀態
  const [steps, setSteps] = useState<Step[]>([
    { instruction: '', image: '' }
  ]);
  
  // 標籤狀態
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // 常用推薦標籤
  const commonTags = ['中式', '西式', '日式', '烘焙', '甜點', '早餐', '午晚餐', '10分鐘料理', '健康輕食'];

  // 處理相機/相簿照片檔案（自動進行客戶端壓縮）
  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      onSuccess(compressed);
    } catch {
      alert('圖片處理失敗，請嘗試選擇其他圖片！');
    }
  };

  useEffect(() => {
    if (initialRecipe) {
      setTitle(initialRecipe.title);
      setCoverImage(initialRecipe.coverImage);
      setDescription(initialRecipe.description);
      setDifficulty(initialRecipe.difficulty);
      setCookTime(initialRecipe.cookTime);
      setServings(initialRecipe.servings);
      setIngredients(
        initialRecipe.ingredients.map((ing) => ({
          ...ing,
          isCustomUnit: !isPresetUnit(ing.unit),
        }))
      );
      setSteps([...initialRecipe.steps]);
      setTags([...initialRecipe.tags]);
    }
  }, [initialRecipe]);

  // 食材動態操作
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 0, unit: '克', isCustomUnit: false }]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: keyof FormIngredient, value: any) => {
    const updated = [...ingredients];
    (updated[index] as any)[field] = value;
    if (field === 'amount') {
      updated[index].amount = Number(value) || 0;
    }
    setIngredients(updated);
  };

  // 步驟動態操作
  const handleAddStep = () => {
    setSteps([...steps, { instruction: '', image: '' }]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, field: keyof Step, value: string) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  // 標籤操作
  const handleAddTag = () => {
    const cleanTag = tagInput.trim();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const toggleCommonTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  // 第一步的下一步驗證
  const handleNextStep1 = () => {
    if (!title.trim()) {
      alert('【必填錯誤】請填寫食譜標題！');
      return;
    }
    if (!coverImage.trim()) {
      alert('【必填錯誤】請提供封面照片！您可以拍照、從相簿選取，或是貼上圖片 URL。');
      return;
    }
    if (!cookTime || cookTime <= 0) {
      alert('【必填錯誤】請填寫有效的烹調時間（分鐘數需大於 0）！');
      return;
    }
    if (!servings || servings <= 0) {
      alert('【必填錯誤】請填寫有效的預設份量（人份數需大於 0）！');
      return;
    }
    setFormStep(2);
  };

  // 第二步的下一步驗證
  const handleNextStep2 = () => {
    if (ingredients.length === 0) {
      alert('【必填錯誤】請至少新增一項食材！');
      return;
    }

    // 檢查每一個食材是否漏填
    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];
      if (!ing.name.trim()) {
        alert(`【必填錯誤】請填寫第 ${i + 1} 項食材的名稱！`);
        return;
      }
      if (!ing.amount || ing.amount <= 0) {
        alert(`【必填錯誤】食材「${ing.name}」的數量必須大於 0！`);
        return;
      }
      if (!ing.unit.trim()) {
        alert(`【必填錯誤】請填寫食材「${ing.name}」的單位！`);
        return;
      }
    }

    setFormStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 雙重防線驗證 - 步驟 1
    if (!title.trim()) {
      alert('【必填錯誤】請填寫食譜標題！');
      setFormStep(1);
      return;
    }
    if (!coverImage.trim()) {
      alert('【必填錯誤】請提供封面照片！');
      setFormStep(1);
      return;
    }
    if (!cookTime || cookTime <= 0) {
      alert('【必填錯誤】請填寫有效的烹調時間！');
      setFormStep(1);
      return;
    }
    if (!servings || servings <= 0) {
      alert('【必填錯誤】請填寫有效的預設份量！');
      setFormStep(1);
      return;
    }

    // 雙重防線驗證 - 步驟 2
    if (ingredients.length === 0) {
      alert('【必填錯誤】請至少新增一項食材！');
      setFormStep(2);
      return;
    }
    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];
      if (!ing.name.trim() || !ing.amount || ing.amount <= 0 || !ing.unit.trim()) {
        alert(`【必填錯誤】食材清單中有漏填資訊（名稱、數量與單位為必填且數量需大於 0）！`);
        setFormStep(2);
        return;
      }
    }

    // 雙重防線驗證 - 步驟 3
    const validSteps = steps.filter(step => step.instruction.trim() !== '');
    if (validSteps.length === 0) {
      alert('【必填錯誤】請至少填寫一個烹飪步驟說明！');
      return;
    }

    const cleanIngredients: Ingredient[] = ingredients.map(({ name, amount, unit }) => ({
      name,
      amount,
      unit,
    }));

    onSubmit({
      id: initialRecipe?.id,
      title,
      coverImage: coverImage.trim(),
      description,
      difficulty,
      cookTime,
      servings,
      ingredients: cleanIngredients,
      steps: validSteps,
      tags,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 返回按鈕 */}
      <button
        onClick={onCancel}
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        返回列表
      </button>

      {/* 步驟指示器 */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 -z-10" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-pink-500 transition-all duration-300 -z-10" 
            style={{ width: `${((formStep - 1) / 2) * 100}%` }}
          />

          {/* 步驟 1 */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
              formStep >= 1 ? 'bg-pink-500 text-white shadow-xs' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className="text-[10px] font-bold text-gray-500 mt-1">基本資訊</span>
          </div>

          {/* 步驟 2 */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
              formStep >= 2 ? 'bg-pink-500 text-white shadow-xs' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className="text-[10px] font-bold text-gray-500 mt-1">食材清單</span>
          </div>

          {/* 步驟 3 */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
              formStep >= 3 ? 'bg-pink-500 text-white shadow-xs' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className="text-[10px] font-bold text-gray-500 mt-1">烹飪步驟</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
          {initialRecipe ? '✏️ 編輯您的美味食譜' : '🍳 分享您的獨家食譜'}
          <span className="text-sm font-semibold text-pink-500 ml-2">({formStep}/3 步驟)</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 步驟一：基本資訊 */}
          {formStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">食譜標題 *</label>
                  <input
                    type="text"
                    required
                    placeholder="例如：香脆黃金炸豬排"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:outline-hidden text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">封面照片 *</label>
                  <div className="mt-1 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center relative shrink-0">
                      {coverImage ? (
                        <>
                          <img src={coverImage} alt="封面預覽" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCoverImage('')}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors text-xs font-bold"
                            title="移除照片"
                          >
                            &times;
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-4 text-gray-400">
                          <ImageIcon className="h-8 w-8 mx-auto mb-1 text-gray-300" />
                          <span className="text-xs">尚無照片</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <label className="inline-flex items-center px-4 py-2 border border-pink-200 rounded-xl text-xs font-semibold text-pink-500 bg-pink-50 hover:bg-pink-100 cursor-pointer transition-colors">
                          <Camera className="h-4 w-4 mr-1.5" />
                          拍照/從相簿選擇（自動壓縮）
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileChange(e, setCoverImage)}
                            className="hidden"
                          />
                        </label>
                        {coverImage && (
                          <button
                            type="button"
                            onClick={() => setCoverImage('')}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                          >
                            移除照片
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="或貼上網路圖片 URL..."
                          value={coverImage.startsWith('data:') ? '' : coverImage}
                          onChange={(e) => setCoverImage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-1 focus:ring-pink-500 focus:outline-hidden text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">簡短介紹</label>
                  <textarea
                    rows={3}
                    placeholder="簡單介紹一下這道菜的故事、口感或特色吧..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:outline-hidden text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">難度</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:outline-hidden text-sm bg-white"
                  >
                    <option value="easy">簡單 (Easy)</option>
                    <option value="medium">中等 (Medium)</option>
                    <option value="hard">困難 (Hard)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">烹調時間 (分鐘)</label>
                    <input
                      type="number"
                      min="1"
                      value={cookTime}
                      onChange={(e) => setCookTime(Math.max(1, Number(e.target.value)))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:outline-hidden text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">預設份量 (人份)</label>
                    <input
                      type="number"
                      min="1"
                      value={servings}
                      onChange={(e) => setServings(Math.max(1, Number(e.target.value)))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:outline-hidden text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 分類標籤 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">分類標籤</label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-pink-100 text-pink-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-pink-500 hover:text-pink-700 focus:outline-hidden font-bold"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 max-w-sm mb-4">
                  <input
                    type="text"
                    placeholder="輸入自訂標籤"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-pink-500 focus:outline-hidden text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200"
                  >
                    新增
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">推薦常用標籤:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {commonTags.map((tag) => {
                      const active = tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleCommonTag(tag)}
                          className={`px-2 py-1 rounded-md text-xs transition-colors ${
                            active
                              ? 'bg-pink-500 text-white font-semibold'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 下一步按鈕 */}
              <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all"
                >
                  下一步：填寫食材
                </button>
              </div>
            </div>
          )}

          {/* 步驟二：食材清單 */}
          {formStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700">食材清單 *</label>
                  <p className="text-xs text-gray-400 mt-0.5">請填寫這道菜所需的食材、數量與單位。</p>
                </div>
                
                <div className="space-y-3">
                  {ingredients.map((ing, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        required
                        placeholder="食材名稱（如：中筋麵粉）"
                        value={ing.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        className="flex-3 px-3 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-pink-500 focus:outline-hidden text-sm"
                      />
                      <input
                        type="number"
                        step="any"
                        min="0"
                        placeholder="份量（如：200）"
                        value={ing.amount || ''}
                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                        className="flex-1 min-w-[70px] px-3 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-pink-500 focus:outline-hidden text-sm"
                      />
                      
                      {/* 單位下拉式選單與獨立自訂輸入 */}
                      <div className="flex-1 min-w-[120px] flex gap-1">
                        <select
                          value={ing.isCustomUnit ? '自訂' : (ing.unit || '克')}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '自訂') {
                              const updated = [...ingredients];
                              updated[index].isCustomUnit = true;
                              updated[index].unit = '';
                              setIngredients(updated);
                            } else {
                              const updated = [...ingredients];
                              updated[index].isCustomUnit = false;
                              updated[index].unit = val;
                              setIngredients(updated);
                            }
                          }}
                          className="w-full px-2 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-pink-500 focus:outline-hidden text-sm bg-white"
                        >
                          {COMMON_UNITS.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                        
                        {/* 只要是自訂模式，始終維持輸入框存在，不因輸入常見詞閃退 */}
                        {ing.isCustomUnit && (
                          <input
                            type="text"
                            required
                            placeholder="自訂單位"
                            value={ing.unit}
                            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                            className="w-20 px-2 py-2 rounded-lg border border-pink-300 focus:ring-1 focus:ring-pink-500 focus:outline-hidden text-xs bg-pink-50/20"
                          />
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        disabled={ingredients.length === 1}
                        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="mt-4 w-full py-2.5 border-2 border-dashed border-pink-200 text-pink-500 hover:text-pink-600 rounded-xl text-xs font-bold hover:bg-pink-50/50 hover:border-pink-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  新增食材項目
                </button>
              </div>

              {/* 上一步與下一步按鈕 */}
              <div className="flex justify-between pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setFormStep(1)}
                  className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  上一步
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="px-8 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all"
                >
                  下一步：填寫步驟
                </button>
              </div>
            </div>
          )}

          {/* 步驟三：烹飪步驟 */}
          {formStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700">烹飪步驟 *</label>
                  <p className="text-xs text-gray-400 mt-0.5">請依序列出烹飪流程，並可選填步驟照片（支援相機/相簿並自動壓縮）。</p>
                </div>

                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-md">
                          步驟 {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(index)}
                          disabled={steps.length === 1}
                          className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      <textarea
                        required
                        rows={2}
                        placeholder="請描述此步驟的操作說明..."
                        value={step.instruction}
                        onChange={(e) => handleStepChange(index, 'instruction', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-1 focus:ring-pink-500 focus:outline-hidden text-sm bg-white"
                      />

                      <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex items-center px-3 py-1.5 border border-pink-200 rounded-lg text-xs font-semibold text-pink-500 bg-pink-50 hover:bg-pink-100 cursor-pointer transition-colors">
                          <Camera className="h-3.5 w-3.5 mr-1" />
                          拍照/選擇步驟照片（壓縮）
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileChange(e, (base64) => handleStepChange(index, 'image', base64))}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="或輸入步驟照片 URL (選填)..."
                          value={step.image?.startsWith('data:') ? '' : (step.image || '')}
                          onChange={(e) => handleStepChange(index, 'image', e.target.value)}
                          className="flex-1 min-w-[150px] px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-pink-500 focus:outline-hidden text-xs bg-white"
                        />
                        {step.image && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-10 h-7 rounded-md overflow-hidden border border-gray-200 bg-white shrink-0">
                              <img src={step.image} alt="步驟預覽" className="w-full h-full object-cover" />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleStepChange(index, 'image', '')}
                              className="text-[10px] text-red-500 hover:text-red-700 font-bold"
                            >
                              移除
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddStep}
                  className="mt-4 w-full py-2.5 border-2 border-dashed border-pink-200 text-pink-500 hover:text-pink-600 rounded-xl text-xs font-bold hover:bg-pink-50/50 hover:border-pink-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  新增烹飪步驟
                </button>
              </div>

              {/* 上一步與提交按鈕 */}
              <div className="flex justify-between pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  上一步
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all"
                >
                  保存食譜
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
