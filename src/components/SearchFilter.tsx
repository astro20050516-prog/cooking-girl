import React from 'react';
import { Search, Heart } from 'lucide-react';
import type { Collection } from '../types';

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedCollectionId: string;
  setSelectedCollectionId: (id: string) => void;
  collections: Collection[];
  allTags: string[];
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  selectedDifficulty,
  setSelectedDifficulty,
  sortBy,
  setSortBy,
  selectedCollectionId,
  setSelectedCollectionId,
  collections,
  allTags,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs mb-8 space-y-4">
      {/* 搜尋與收藏篩選 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋食譜標題或食材（例如：雞蛋、五花肉）..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm placeholder-gray-400"
          />
        </div>
        
        {/* 收藏清單多級過濾 */}
        <div className="relative flex items-center shrink-0">
          <Heart className={`absolute left-3 h-4.5 w-4.5 ${selectedCollectionId ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} />
          <select
            value={selectedCollectionId}
            onChange={(e) => setSelectedCollectionId(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-pink-500 focus:border-pink-500 appearance-none min-w-[160px]"
          >
            <option value="">📂 全部食譜</option>
            <option value="all-fav">❤️ 全部已收藏</option>
            {collections.length > 0 && (
              <optgroup label="📁 自訂收藏清單">
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    📁 {col.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            ▼
          </div>
        </div>
      </div>

      {/* 分類與排序進階篩選 */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-50">
        {/* 標籤分類 */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs font-semibold text-gray-400 mr-1.5 uppercase tracking-wider">分類:</span>
          <button
            onClick={() => setSelectedTag('')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedTag === ''
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 排序與難度 */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 難度篩選 */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">難度:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs font-medium text-gray-700 border border-gray-200 rounded-lg p-1.5 bg-white focus:outline-hidden focus:ring-1 focus:ring-pink-500"
            >
              <option value="">全部</option>
              <option value="easy">簡單</option>
              <option value="medium">中等</option>
              <option value="hard">困難</option>
            </select>
          </div>

          {/* 排序 */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">排序:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-medium text-gray-700 border border-gray-200 rounded-lg p-1.5 bg-white focus:outline-hidden focus:ring-1 focus:ring-pink-500"
            >
              <option value="date-desc">日期：新到舊</option>
              <option value="date-asc">日期：舊到新</option>
              <option value="time-asc">烹調時間：短到長</option>
              <option value="time-desc">烹調時間：長到短</option>
              <option value="difficulty-asc">難度：簡單到困難</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
