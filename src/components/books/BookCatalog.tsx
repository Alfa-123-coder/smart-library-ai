import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, SlidersHorizontal, Grid, List, Sparkles, 
  Bookmark, CheckCircle2, ArrowUpRight, BookOpen, AlertCircle
} from 'lucide-react';
import { Book, Category } from '../../types';

interface BookCatalogProps {
  books: Book[];
  categories: Category[];
  onSelectBook: (bookId: string) => void;
  onBorrowBook: (bookId: string) => void;
  onReserveBook: (bookId: string) => void;
  onAskAI: (book: Book) => void;
  initialCategory?: string;
  initialSearch?: string;
}

export const BookCatalog: React.FC<BookCatalogProps> = ({
  books,
  categories,
  onSelectBook,
  onBorrowBook,
  onReserveBook,
  onAskAI,
  initialCategory,
  initialSearch = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'year' | 'title'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredBooks = useMemo(() => {
    return books
      .filter((b) => {
        const matchesCat = selectedCategory === 'all' || b.category_id === selectedCategory;
        const matchesSearch = 
          !searchQuery.trim() ||
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
          b.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAvail = !availabilityOnly || b.availableCopies > 0;
        return matchesCat && matchesSearch && matchesAvail;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'year') return b.publication_year - a.publication_year;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        // Default popular
        return (b.ratingCount || 0) - (a.ratingCount || 0);
      });
  }, [books, selectedCategory, searchQuery, availabilityOnly, sortBy]);

  return (
    <div className="space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E06953]">
            University Stacks & Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1D1D1F] tracking-tight mt-1">
            Discover Books
          </h1>
          <p className="text-xs sm:text-sm text-[#656157] mt-1">
            Showing {filteredBooks.length} titles available across departments
          </p>
        </div>

        {/* View Mode & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-xl p-1 border border-[#EAE7DF] shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#F5F4EE] text-[#1D1D1F]' : 'text-[#8A857A] hover:text-[#1D1D1F]'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#F5F4EE] text-[#1D1D1F]' : 'text-[#8A857A] hover:text-[#1D1D1F]'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white text-xs font-medium text-[#1D1D1F] rounded-xl border border-[#EAE7DF] shadow-xs focus:outline-none"
          >
            <option value="popular">Sort: Most Popular</option>
            <option value="rating">Sort: Highest Rating</option>
            <option value="year">Sort: Publication Year</option>
            <option value="title">Sort: Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#EAE7DF] shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8A857A] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author name, ISBN barcode, or topic..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F5F4EE] border border-[#E0DDD2] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1D1D1F]"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#1D1D1F] text-white shadow-xs'
                : 'bg-[#F5F4EE] text-[#656157] hover:bg-[#EAE8E0]'
            }`}
          >
            All Categories ({books.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.category_id}
              onClick={() => setSelectedCategory(c.category_id)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === c.category_id
                  ? 'bg-[#1D1D1F] text-white shadow-xs'
                  : 'bg-[#F5F4EE] text-[#656157] hover:bg-[#EAE8E0]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0EEE6] text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-[#656157]">
            <input
              type="checkbox"
              checked={availabilityOnly}
              onChange={(e) => setAvailabilityOnly(e.target.checked)}
              className="rounded text-[#E06953] focus:ring-[#E06953]"
            />
            <span>Show available copies only (instant loan ready)</span>
          </label>

          <span className="text-[#8A857A]">
            {filteredBooks.length} of {books.length} items
          </span>
        </div>
      </div>

      {/* Books Display */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE7DF] p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-[#8A857A] mx-auto opacity-50" />
          <h3 className="text-base font-serif font-bold text-[#1D1D1F]">No Matching Titles Found</h3>
          <p className="text-xs text-[#656157] max-w-sm mx-auto">
            Try adjusting your search terms or clearing the category filters to browse all catalog volumes.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setAvailabilityOnly(false); }}
            className="px-4 py-2 bg-[#1D1D1F] text-white text-xs rounded-full font-medium mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableCopies > 0;
            return (
              <div
                key={book.book_id}
                className="group flex flex-col justify-between bg-white p-3.5 rounded-2xl border border-[#EAE7DF] hover:border-[#DDD8CC] transition-all shadow-xs hover:shadow-md"
              >
                {/* Book Cover with 3D shadow */}
                <div 
                  onClick={() => onSelectBook(book.book_id)}
                  className="cursor-pointer"
                >
                  <div className="w-full aspect-[2/3] rounded-md overflow-hidden book-card-shadow bg-[#232323] mb-3 relative">
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold backdrop-blur-xs text-white bg-black/60">
                      ★ {book.rating}
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-[#E06953] uppercase tracking-wider block truncate">
                    {book.category_name}
                  </span>
                  <h3 className="text-xs font-serif font-bold text-[#1D1D1F] line-clamp-1 group-hover:text-[#E06953] transition-colors mt-0.5">
                    {book.title}
                  </h3>
                  <p className="text-[11px] text-[#8A857A] truncate">
                    {book.authors.join(', ')}
                  </p>
                </div>

                {/* Copies & Quick Action Footer */}
                <div className="pt-3 mt-2 border-t border-[#F0EEE6] flex items-center justify-between text-[11px]">
                  <span className={`font-semibold ${isAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {isAvailable ? `${book.availableCopies} available` : 'On loan'}
                  </span>

                  <button
                    onClick={() => onSelectBook(book.book_id)}
                    className="p-1.5 rounded-full hover:bg-[#F5F4EE] text-[#1D1D1F] transition-colors"
                    title="View Book Details"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-[#EAE7DF] divide-y divide-[#F0EEE6] overflow-hidden shadow-xs">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableCopies > 0;
            return (
              <div
                key={book.book_id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF9F5] transition-colors"
              >
                <div 
                  onClick={() => onSelectBook(book.book_id)}
                  className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
                >
                  <div className="w-12 h-16 rounded overflow-hidden book-card-shadow shrink-0 bg-[#232323]">
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-serif font-bold text-[#1D1D1F] truncate hover:text-[#E06953]">
                        {book.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F4EE] text-[#8A857A]">
                        {book.publication_year}
                      </span>
                    </div>
                    <p className="text-xs text-[#656157] truncate">
                      By {book.authors.join(', ')} • {book.category_name} • ISBN: {book.isbn}
                    </p>
                    <p className="text-[11px] text-[#8A857A] line-clamp-1">
                      {book.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-[#F0EEE6] sm:pl-4">
                  <div className="text-right hidden sm:block">
                    <div className={`text-xs font-bold ${isAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {isAvailable ? `${book.availableCopies} Copies Available` : 'All On Loan'}
                    </div>
                    <div className="text-[10px] text-[#8A857A]">Total: {book.totalCopies} copies</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAvailable ? (
                      <button
                        onClick={() => onBorrowBook(book.book_id)}
                        className="px-3.5 py-1.5 bg-[#1D1D1F] text-white text-xs font-medium rounded-full hover:bg-[#333336] transition-all"
                      >
                        Borrow
                      </button>
                    ) : (
                      <button
                        onClick={() => onReserveBook(book.book_id)}
                        className="px-3.5 py-1.5 bg-[#E06953] text-white text-xs font-medium rounded-full hover:bg-[#D45943] transition-all"
                      >
                        Reserve
                      </button>
                    )}
                    <button
                      onClick={() => onSelectBook(book.book_id)}
                      className="px-3 py-1.5 bg-[#F5F4EE] text-[#1D1D1F] text-xs font-medium rounded-full hover:bg-[#EAE8E0] transition-all"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
