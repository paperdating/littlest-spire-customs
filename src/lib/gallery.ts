export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  /** Short price guidance shown on the card, e.g. "From $85" or "$40" */
  priceHint: string;
  /** Emoji fallback when no image is set */
  emoji: string;
  /**
   * Path to image in /public, e.g. "/gallery/plush.jpg"
   * Leave empty or omit to use the emoji placeholder.
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

/**
 * EDIT THIS LIST to add / remove your work.
 *
 * To use a real photo:
 * 1. Put the image in public/gallery/ (e.g. public/gallery/plush.jpg)
 * 2. Set image: "/gallery/plush.jpg"
 *
 * Recommended image size: ~800–1200px wide, square or 4:3 works best.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "plush-companion",
    title: "Custom Plush Companion",
    description:
      "Soft embroidered creature with unique accessories. Fully poseable and made with high-quality fabrics.",
    tag: "Plush",
    priceHint: "From $85",
    emoji: "🧸",
    // image: "/gallery/plush-companion.jpg",
    orderType: "similar",
    details:
      "Each plush is hand-sewn. You can request different colors, sizes, or accessories inspired by this design.",
  },
  {
    id: "miniature-set",
    title: "Hand-Painted Miniature Set",
    description:
      "Detailed tabletop minis with custom color schemes. Perfect for RPG campaigns or display.",
    tag: "Miniatures",
    priceHint: "From $45",
    emoji: "🧙",
    // image: "/gallery/miniature-set.jpg",
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
    // image: "/gallery/jewelry-box.jpg",
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
    // image: "/gallery/bookmarks.jpg",
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
    // image: "/gallery/crystal-pendant.jpg",
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
    // image: "/gallery/dice-bag.jpg",
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
