import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: ProductId;
    amazonUrl: string;
    title: string;
    featured: boolean;
    originalPrice: bigint;
    createdAt: bigint;
    recommended: boolean;
    description: string;
    imageUrl: string;
    category: CategoryId;
    rating: number;
    price: bigint;
    reviewCount: bigint;
}
export interface SiteSettings {
    heroImageUrl: string;
    heroSubtitle: string;
    siteName: string;
    heroTitle: string;
}
export type CategoryId = bigint;
export type ProductId = bigint;
export interface Category {
    id: CategoryId;
    icon: string;
    name: string;
    color: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCategory(category: Category): Promise<CategoryId>;
    createProduct(product: Product): Promise<ProductId>;
    deleteCategory(categoryId: CategoryId): Promise<void>;
    deleteProduct(productId: ProductId): Promise<void>;
    getAllCategories(): Promise<Array<Category>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategoryById(categoryId: CategoryId): Promise<Category>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getProductById(productId: ProductId): Promise<Product>;
    getProductsByCategory(categoryId: CategoryId): Promise<Array<Product>>;
    getRecommendedProducts(): Promise<Array<Product>>;
    getSiteSettings(): Promise<SiteSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedSampleData(): Promise<void>;
    updateCategory(category: Category): Promise<void>;
    updateProduct(product: Product): Promise<void>;
    updateSiteSettings(settings: SiteSettings): Promise<void>;
}
