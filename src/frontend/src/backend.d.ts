import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Comment {
    content: string;
    userId: string;
    storyId: bigint;
    timestamp: Time;
}
export interface Story {
    id: bigint;
    title: string;
    content: string;
    timestamp: Time;
    excerpt: string;
    category: StoryCategory;
}
export enum StoryCategory {
    trueStories = "trueStories",
    indianHorror = "indianHorror",
    hauntedPlaces = "hauntedPlaces",
    psychologicalHorror = "psychologicalHorror"
}
export interface backendInterface {
    addComment(storyId: bigint, userId: string, content: string): Promise<void>;
    addStory(title: string, excerpt: string, content: string, category: StoryCategory): Promise<bigint>;
    getComments(storyId: bigint): Promise<Array<Comment>>;
    getLatestStories(limit: bigint): Promise<Array<Story>>;
    getStoriesByCategory(category: StoryCategory): Promise<Array<Story>>;
    getStory(id: bigint): Promise<Story>;
    searchStories(queryText: string): Promise<Array<Story>>;
    toggleNightMode(_userId: string, nightModeEnabled: boolean): Promise<boolean>;
}
