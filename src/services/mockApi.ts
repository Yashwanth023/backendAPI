
import { Book, Review, User, ApiResponse, PaginatedResponse } from '@/types';

// LocalStorage keys
const STORAGE_KEYS = {
  BOOKS: 'bookReviewApp_books',
  REVIEWS: 'bookReviewApp_reviews',
  USERS: 'bookReviewApp_users'
};

// Initialize localStorage with default data if empty
const initializeLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
    const defaultBooks: Book[] = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        publishedYear: 1925,
        genre: 'Classic Literature',
        description: 'A classic American novel set in the Jazz Age.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0-06-112008-4',
        publishedYear: 1960,
        genre: 'Classic Literature',
        description: 'A gripping tale of racial injustice and childhood innocence.',
        coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0-452-28423-4',
        publishedYear: 1949,
        genre: 'Dystopian Fiction',
        description: 'A dystopian social science fiction novel and cautionary tale.',
        coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(defaultBooks));
  }

  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    const defaultReviews: Review[] = [
      {
        id: '1',
        bookId: '1',
        userId: '1',
        rating: 5,
        title: 'Absolutely brilliant!',
        content: 'This book is a masterpiece. Fitzgerald\'s writing is beautiful and the story is captivating.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        bookId: '1',
        userId: '2',
        rating: 4,
        title: 'Great classic',
        content: 'A well-written classic that captures the essence of the Jazz Age perfectly.',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(defaultReviews));
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers: User[] = [
      { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face' },
      { id: '2', name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
};

// LocalStorage helper functions
const getFromStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error);
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`LocalStorage SAVE: ${key} (${data.length} items)`);
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error);
  }
};

// Cache simulation with Redis-like interface
class MockCache {
  private cache = new Map<string, { data: any; expires: number }>();

  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
    console.log(`Cache SET: ${key} (TTL: ${ttl}ms)`);
  }

  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) {
      console.log(`Cache MISS: ${key} - falling back to LocalStorage`);
      return null;
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      console.log(`Cache EXPIRED: ${key} - falling back to LocalStorage`);
      return null;
    }
    
    console.log(`Cache HIT: ${key}`);
    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
    console.log(`Cache DELETE: ${key}`);
  }

  clear(): void {
    this.cache.clear();
    console.log('Cache CLEARED');
  }
}

const cache = new MockCache();

// Initialize localStorage on first load
initializeLocalStorage();

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Error simulation for testing robustness
const simulateRandomError = (errorRate: number = 0.1) => {
  if (Math.random() < errorRate) {
    throw new Error('Simulated service error - testing error handling');
  }
};

export class BookReviewAPI {
  // GET /books - List all books with pagination
  static async getBooks(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Book>>> {
    try {
      await delay(300);
      const cacheKey = `books:${page}:${limit}`;
      
      let cachedBooks = cache.get(cacheKey);
      if (cachedBooks) {
        return {
          success: true,
          data: cachedBooks,
          message: 'Books retrieved from cache'
        };
      }

      simulateRandomError(0.05); // 5% error rate

      const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBooks = books.slice(startIndex, endIndex);

      const result = {
        data: paginatedBooks,
        pagination: {
          page,
          limit,
          total: books.length,
          totalPages: Math.ceil(books.length / limit)
        }
      };

      cache.set(cacheKey, result, 300000); // 5 minutes TTL

      return {
        success: true,
        data: result,
        message: 'Books retrieved from LocalStorage'
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      return {
        success: false,
        data: { data: [], pagination: { page, limit, total: 0, totalPages: 0 } },
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // POST /books - Add a new book
  static async addBook(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Book>> {
    try {
      await delay(400);
      simulateRandomError(0.03); // 3% error rate

      const newBook: Book = {
        ...bookData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
      books.unshift(newBook);
      saveToStorage(STORAGE_KEYS.BOOKS, books);
      
      // Invalidate books cache
      cache.clear();

      return {
        success: true,
        data: newBook,
        message: 'Book added successfully to LocalStorage'
      };
    } catch (error) {
      console.error('Error adding book:', error);
      return {
        success: false,
        data: {} as Book,
        error: error instanceof Error ? error.message : 'Failed to add book'
      };
    }
  }

  // GET /books/{id}/reviews - Get reviews for a specific book
  static async getBookReviews(bookId: string): Promise<ApiResponse<Review[]>> {
    try {
      await delay(250);
      const cacheKey = `reviews:book:${bookId}`;
      
      let cachedReviews = cache.get(cacheKey);
      if (cachedReviews) {
        return {
          success: true,
          data: cachedReviews,
          message: 'Reviews retrieved from cache'
        };
      }

      simulateRandomError(0.05);

      const reviews = getFromStorage<Review>(STORAGE_KEYS.REVIEWS);
      const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
      const users = getFromStorage<User>(STORAGE_KEYS.USERS);

      const bookReviews = reviews
        .filter(review => review.bookId === bookId)
        .map(review => ({
          ...review,
          book: books.find(book => book.id === review.bookId),
          user: users.find(user => user.id === review.userId)
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      cache.set(cacheKey, bookReviews, 300000);

      return {
        success: true,
        data: bookReviews,
        message: 'Reviews retrieved from LocalStorage'
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch reviews'
      };
    }
  }

  // POST /books/{id}/reviews - Add a review for a book
  static async addReview(bookId: string, reviewData: Omit<Review, 'id' | 'bookId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Review>> {
    try {
      await delay(400);
      simulateRandomError(0.03);

      const newReview: Review = {
        ...reviewData,
        id: Date.now().toString(),
        bookId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const reviews = getFromStorage<Review>(STORAGE_KEYS.REVIEWS);
      reviews.unshift(newReview);
      saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
      
      // Invalidate related caches
      cache.delete(`reviews:book:${bookId}`);

      const books = getFromStorage<Book>(STORAGE_KEYS.BOOKS);
      const users = getFromStorage<User>(STORAGE_KEYS.USERS);

      const reviewWithRelations = {
        ...newReview,
        book: books.find(book => book.id === bookId),
        user: users.find(user => user.id === newReview.userId)
      };

      return {
        success: true,
        data: reviewWithRelations,
        message: 'Review added successfully to LocalStorage'
      };
    } catch (error) {
      console.error('Error adding review:', error);
      return {
        success: false,
        data: {} as Review,
        error: error instanceof Error ? error.message : 'Failed to add review'
      };
    }
  }

  // Utility method to clear all data (for testing)
  static async clearAllData(): Promise<ApiResponse<string>> {
    try {
      localStorage.removeItem(STORAGE_KEYS.BOOKS);
      localStorage.removeItem(STORAGE_KEYS.REVIEWS);
      localStorage.removeItem(STORAGE_KEYS.USERS);
      cache.clear();
      
      // Reinitialize with default data
      initializeLocalStorage();
      
      return {
        success: true,
        data: 'All data cleared and reset',
        message: 'LocalStorage and cache cleared successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: '',
        error: 'Failed to clear data'
      };
    }
  }
}
