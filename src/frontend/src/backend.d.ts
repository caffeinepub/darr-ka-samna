import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Logo {
    contentType: string;
    data: Uint8Array;
}
export type Time = bigint;
export interface Comment {
    name: string;
    message: string;
    timestamp: Time;
}
export interface Story {
    id: bigint;
    title: string;
    content: string;
    thumbnail?: Logo;
    viewCount: bigint;
    timestamp: Time;
    excerpt: string;
    category: StoryCategory;
    youtubeUrl?: string;
}
export interface UserProfile {
    name: string;
}
export enum StoryCategory {
    trueStories = "trueStories",
    indianHorror = "indianHorror",
    hauntedPlaces = "hauntedPlaces",
    psychologicalHorror = "psychologicalHorror"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(storyId: bigint, name: string, message: string): Promise<void>;
    addStory(title: string, excerpt: string, content: string, category: StoryCategory, youtubeUrl: string | null): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteLogo(): Promise<void>;
    deleteThumbnail(storyId: bigint): Promise<void>;
    followWebsite(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getComments(storyId: bigint): Promise<Array<Comment>>;
    getFollowerCount(): Promise<bigint>;
    getLatestStories(limit: bigint): Promise<Array<Story>>;
    getLogo(): Promise<Logo | null>;
    getStoriesByCategory(category: StoryCategory): Promise<Array<Story>>;
    getStory(id: bigint): Promise<Story>;
    getThumbnail(storyId: bigint): Promise<Logo | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    incrementStoryViewCount(id: bigint): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchStories(queryText: string): Promise<Array<Story>>;
    toggleNightMode(_userId: string, nightModeEnabled: boolean): Promise<boolean>;
    uploadLogo(logoData: Uint8Array, contentType: string): Promise<void>;
    uploadThumbnail(storyId: bigint, thumbnailData: Uint8Array, contentType: string): Promise<void>;
}
