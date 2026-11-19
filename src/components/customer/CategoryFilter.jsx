import React from 'react';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar touch-pan-x">
        
        {/* "All" button */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs active:scale-95 ${
            selectedCategory === 'all'
              ? 'bg-bubble-600 text-white shadow-bubble shadow-bubble-600/25 ring-2 ring-bubble-300'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span className="text-sm">✨</span>
          <span>Full Menu</span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat._id;
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => onSelectCategory(cat._id)}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs active:scale-95 ${
                isSelected
                  ? 'bg-bubble-600 text-white shadow-bubble shadow-bubble-600/25 ring-2 ring-bubble-300'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="text-sm">{cat.icon || '🧋'}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}

      </div>
    </div>
  );
}
