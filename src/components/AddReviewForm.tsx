
import { useState } from 'react';
import { Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Loader2 } from 'lucide-react';

interface AddReviewFormProps {
  onAddReview: (reviewData: Omit<Review, 'id' | 'bookId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  loading: boolean;
}

export const AddReviewForm = ({ onAddReview, loading }: AddReviewFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
    userId: '1', // Mock current user
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      return;
    }

    await onAddReview(formData);
    
    // Reset form
    setFormData({
      title: '',
      content: '',
      rating: 5,
      userId: '1',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const renderStarRating = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => handleRatingChange(i + 1)}
        className="p-1 hover:scale-110 transition-transform"
      >
        <Star
          className={`w-6 h-6 ${
            i < formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
          }`}
        />
      </button>
    ));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="w-5 h-5" />
          <span>Write a Review</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your review a title"
              required
            />
          </div>
          
          <div>
            <Label>Rating *</Label>
            <div className="flex items-center space-x-1 mt-1">
              {renderStarRating()}
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating}/5 stars
              </span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="content">Review Content *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your thoughts about this book..."
              rows={4}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loading || !formData.title || !formData.content}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing Review...
              </>
            ) : (
              'Publish Review'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
