export type ListingCategory = 'racquet' | 'shoes' | 'bag' | 'apparel' | 'accessories' | 'balls';
export type ListingCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor';
export type ListingStatus = 'available' | 'pending' | 'sold';

export interface EquipmentListing {
    id: string;
    seller_id: string;
    title: string;
    description: string;
    category: ListingCategory;
    condition: ListingCondition;
    price: number;
    currency: string;
    images: string[];
    location?: string;
    status: ListingStatus;
    created_at: string;
    updated_at: string;
    // Joins
    profiles?: {
        id: string;
        full_name?: string;
        avatar_url?: string;
    };
}

export interface CreateListingInput {
    title: string;
    description: string;
    category: ListingCategory;
    condition: ListingCondition;
    price: number;
    location?: string;
    images: File[];
}
