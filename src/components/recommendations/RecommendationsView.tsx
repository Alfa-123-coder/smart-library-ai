import React from 'react';
import { Sparkles, ArrowUpRight, BookOpen, Star, TrendingUp } from 'lucide-react';
import { Book, User } from '../../types';
import { libraryService } from '../../services/libraryService';

interface RecommendationsViewProps {
  currentUser: User | null;
  onSelectBook: (bookId: string) => void;
  onAskAI: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  currentUser,
  onSelectBook,
  onAskAI,
}) => {
  const sections = libraryService.getRecommendations(currentUser?.id);

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E06953]">
            Machine-Learned Catalog Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1D1D1F] tracking-tight mt-1">
            Curated For You
          </h1>
          <p className="text-xs sm:text-sm text-[#656157] mt-1">
            Algorithmic recommendations combining active reading patterns, department curricula, and popularity metrics.
          </p>
        </div>

        <button
          onClick={onAskAI}
          className="px-5 py-2.5 bg-[#1D1D1F] text-white text-xs font-medium rounded-full shadow-xs hover:bg-[#333336] flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[#E06953]" />
          <span>Ask Library AI for Tailored Titles</span>
        </button>
      </div>

      {/* Sections */}
      {sections.map((sec, idx) => (
        <div key={idx} className="space-y-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1D1D1F]">
              {sec.title}
            </h2>
            <p className="text-xs text-[#8A857A]">
              {sec.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {sec.books.map((book) => (
              <div
                key={book.book_id}
                onClick={() => onSelectBook(book.book_id)}
                className="cursor-pointer group flex flex-col justify-between bg-white p-3.5 rounded-2xl border border-[#EAE7DF] hover:border-[#D6D2C4] shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="w-full aspect-[2/3] rounded-md overflow-hidden book-card-shadow bg-[#232323] mb-3 relative">
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      ★ {book.rating}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E06953] truncate block">
                    {book.category_name}
                  </span>
                  <h3 className="text-xs font-serif font-bold text-[#1D1D1F] line-clamp-1 group-hover:text-[#E06953] transition-colors mt-0.5">
                    {book.title}
                  </h3>
                  <p className="text-[11px] text-[#8A857A] truncate">
                    {book.authors.join(', ')}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-[#F0EEE6] flex items-center justify-between text-[10px]">
                  <span className={`font-semibold ${book.availableCopies > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {book.availableCopies > 0 ? `${book.availableCopies} Copies Available` : 'On Loan'}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-[#8A857A]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
