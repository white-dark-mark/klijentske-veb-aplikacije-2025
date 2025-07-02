export interface CartItem {
    id: number;
    userId: number;
    projectionId: number;
    status: CartItemStatus | string; // Allow both enum and string values for compatibility
    rating?: number; // 1-5 stars, only for WATCHED projections
    bookedAt?: Date; // When the projection was booked
}

export enum CartItemStatus {
    BOOKED = 'BOOKED',
    WATCHED = 'WATCHED', 
    CANCELLED = 'CANCELLED'
} 