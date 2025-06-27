
import { Book } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Calendar, User } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onViewReviews: (book: Book) => void;
}

export const BookCard = ({ book, onViewReviews }: BookCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-2">
        <div className="aspect-[3/4] w-full mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📚</div>
                <div className="text-sm">No Cover</div>
              </div>
            </div>
          )}
        </div>
        <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pt-0">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-1" />
            <span className="font-medium">{book.author}</span>
          </div>
          
          {book.publishedYear && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{book.publishedYear}</span>
            </div>
          )}
          
          {book.genre && (
            <Badge variant="secondary" className="text-xs">
              {book.genre}
            </Badge>
          )}
          
          {book.description && (
            <p className="text-sm text-gray-600 line-clamp-3 mt-2">
              {book.description}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={() => onViewReviews(book)}
          className="w-full"
          variant="outline"
        >
          <Star className="w-4 h-4 mr-2" />
          View Reviews
        </Button>
      </CardFooter>
    </Card>
  );
};
