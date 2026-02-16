import { StoryCategory } from '../backend';

export interface Category {
  id: string;
  label: string;
  value: StoryCategory;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'indian-horror',
    label: 'Indian Horror',
    value: StoryCategory.indianHorror,
    description: 'Terrifying tales rooted in Indian folklore and mythology',
  },
  {
    id: 'haunted-places',
    label: 'Haunted Places',
    value: StoryCategory.hauntedPlaces,
    description: 'Spine-chilling stories from cursed and haunted locations',
  },
  {
    id: 'true-stories',
    label: 'True Stories',
    value: StoryCategory.trueStories,
    description: 'Real-life horror experiences that will make you question reality',
  },
  {
    id: 'psychological-horror',
    label: 'Psychological Horror',
    value: StoryCategory.psychologicalHorror,
    description: 'Mind-bending tales that will haunt your thoughts',
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((cat) => cat.id === id);
}

export function getCategoryByIdOrThrow(id: string): Category {
  const category = getCategoryById(id);
  if (!category) {
    throw new Error(`Category not found: ${id}`);
  }
  return category;
}

export function getCategoryLabel(value: StoryCategory): string {
  const category = categories.find((cat) => cat.value === value);
  return category?.label || 'Unknown';
}
