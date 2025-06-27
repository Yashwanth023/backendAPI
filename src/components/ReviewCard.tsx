
import { Review } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={review.user?.avatar} />
              <AvatarFallback>
                {review.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{review.user?.name || 'Anonymous'}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="ml-1 text-sm font-medium">{review.rating}/5</span>
          </Badge>
        </div>
        <CardTitle className="text-base">{review.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 leading-relaxed">
          {review.content}
        </p>
      </CardContent>
    </Card>
  );
};
