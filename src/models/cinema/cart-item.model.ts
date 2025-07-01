export interface CartItem {
    id: number;
    userId: number;
    projectionId: number;
    status: CartItemStatus;
}

export enum CartItemStatus {
    BOOKED = 'BOOKED',
    WATCHED = 'WATCHED',
    CANCELLED = 'CANCELLED'
} 