export interface MovieReview {
    id: number;
    userId: number;
    movieId: number;
    reviewText: string;
    rating: number;
    createdAt: Date;
} 