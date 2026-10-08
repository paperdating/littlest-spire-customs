export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  /** Short price guidance shown on the card, e.g. "From $85" or "$40" */
  priceHint: string;
  /** Emoji fallback when no images are set */
  emoji: string;
  /**
   * Multiple photos for this listing.
   * Paths relative to /public, e.g. "/gallery/plush-1.jpg"
   */
  images?: string[];
  /**
   * Single photo (legacy). Prefer `images` when you have more than one.
   * Still supported for convenience.
   */
  image?: string;
  /**
   * - similar: made-to-order version inspired by this piece
   * - available: currently available / can be purchased as-is (or remade)
   */
  orderType: "similar" | "available";
  /** Optional longer details */
  details?: string;
}

/** All image paths for an item (images[] first, then single image) */
export function getItemImages(item: GalleryItem): string[] {
  if (item.images && item.images.length > 0) return item.images;
  if (item.image) return [item.image];
  return [];
}

/**
 * EDIT THIS LIST to add / remove your work.
 *
 * Multiple photos per listing:
 *   images: [
 *     "/gallery/plush-1.jpg",
 *     "/gallery/plush-2.jpg",
 *     "/gallery/plush-3.jpg",
 *   ],
 *
 * Put files in public/gallery/
 * Recommended size: ~800–1200px wide, square or 4:3.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "crochet-doll",
    title: "Custom Original Character Crochet Dolls",
    description:
      "Let me create a custom doll of your OC!",
    tag: "Crochet Dolls",
    priceHint: "From $85 + $20 shipping",
    emoji: "🧸",
    images: [
    "/gallery/doll-1.png",
    "/gallery/doll-2.jpg",
    "/gallery/doll-3.jpg",
	"/gallery/doll-4.jpg",
	"/gallery/doll-5.jpg",
    // ],
    orderType: "similar",
    details:
      "Each doll is about 10 inches high, and always handmade. I have made: DND (humanoid) characters, FFXIV characters, yumeshippers. If you're interested in a non-humanoid character, please send me a message first!",
  },
  {
    id: "miniature-set",
    title: "Hand-Painted Miniature Set",
    description:
      "Detailed tabletop minis with custom color schemes. Perfect for RPG campaigns or display.",
    tag: "Miniatures",
    priceHint: "From $45",
    emoji: "🧙",
    orderType: "similar",
    details:
      "Painted with acrylics and sealed. Tell me the faction, colors, or character concept you want.",
  },
  {
    id: "jewelry-box",
    title: "Enchanted Jewelry Box",
    description:
      "Wooden box with hand-carved details and soft velvet lining. A keepsake piece.",
    tag: "Woodcraft",
    priceHint: "From $120",
    emoji: "📦",
    orderType: "similar",
    details:
      "Can be personalized with initials, motifs, or different wood stains.",
  },
  {
    id: "fantasy-bookmarks",
    title: "Fantasy Bookmark Collection",
    description:
      "Laser-cut and hand-finished metal bookmarks with fantasy motifs.",
    tag: "Accessories",
    priceHint: "From $25",
    emoji: "🔖",
    orderType: "available",
    details:
      "Often available as ready-made sets or made-to-order with your preferred design.",
  },
  {
    id: "crystal-pendant",
    title: "Wire-Wrapped Crystal Pendant",
    description:
      "Hand-wrapped pendant with genuine crystal and oxidized copper wire.",
    tag: "Jewelry",
    priceHint: "From $40",
    emoji: "💎",
    orderType: "similar",
  },
  {
    id: "dice-bag",
    title: "Embroidered Dice Bag",
    description:
      "Lined fabric dice bag with custom embroidery. Fits a full polyhedral set comfortably.",
    tag: "Accessories",
    priceHint: "From $35",
    emoji: "🎲",
    orderType: "similar",
  },
];

export function getGalleryItem(id: string): GalleryItem | undefined {
  return galleryItems.find((item) => item.id === id);
}

/** Unique tags for filter chips, sorted alphabetically */
export function getGalleryTags(): string[] {
  const tags = new Set(galleryItems.map((i) => i.tag));
  return Array.from(tags).sort();
}
