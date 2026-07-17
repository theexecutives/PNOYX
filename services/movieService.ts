export type Movie = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  banner: string;
  poster?: string;
  genre: string;
  year: string;
  rating: number;
  duration?: string;
  is_free: boolean;
  is_featured: boolean;
  category: string;
  views?: number;
};

export const MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Sa Susunod na Habang Buhay',
    subtitle: 'A PNOYX Original',
    description: 'A story of love, loss, and the ties that bind across lifetimes.',
    banner: 'https://picsum.photos/seed/pnoyx1banner/800/450',
    poster: 'https://picsum.photos/seed/pnoyx1poster/400/600',
    genre: 'Drama · Romance',
    year: '2026',
    rating: 4.8,
    duration: '1h 42m',
    is_free: true,
    is_featured: true,
    category: 'Drama',
    views: 28400,
  },
  {
    id: 'm2',
    title: 'Anino ng Gabi',
    subtitle: 'PNOYX Exclusive',
    description: 'A detective races to unmask a shadow killer terrorizing Manila.',
    banner: 'https://picsum.photos/seed/pnoyx2banner/800/450',
    poster: 'https://picsum.photos/seed/pnoyx2poster/400/600',
    genre: 'Thriller · Crime',
    year: '2026',
    rating: 4.5,
    duration: '1h 58m',
    is_free: false,
    is_featured: true,
    category: 'Thriller',
    views: 19200,
  },
  {
    id: 'm3',
    title: 'Bituin ng Maynila',
    subtitle: 'PNOYX Premiere',
    description: 'A young singer chases stardom in the lights of Manila.',
    banner: 'https://picsum.photos/seed/pnoyx3banner/800/450',
    poster: 'https://picsum.photos/seed/pnoyx3poster/400/600',
    genre: 'Musical · Drama',
    year: '2025',
    rating: 4.3,
    duration: '2h 05m',
    is_free: false,
    is_featured: true,
    category: 'Drama',
    views: 15700,
  },
  {
    id: 'm4',
    title: 'Ang Lihim ng Isla',
    subtitle: 'PNOYX Thriller',
    description: 'Secrets buried deep on a remote island surface with deadly results.',
    banner: 'https://picsum.photos/seed/pnoyx4banner/800/450',
    poster: 'https://picsum.photos/seed/pnoyx4poster/400/600',
    genre: 'Thriller · Mystery',
    year: '2025',
    rating: 4.1,
    duration: '1h 52m',
    is_free: true,
    is_featured: false,
    category: 'Thriller',
    views: 11300,
  },
  {
    id: 'm5',
    title: 'Tawanan Natin',
    subtitle: 'PNOYX Comedy',
    description: 'A hilarious family reunion goes hilariously wrong in the best way.',
    banner: 'https://picsum.photos/seed/pnoyx5banner/800/450',
    poster: 'https://picsum.photos/seed/pnoyx5poster/400/600',
    genre: 'Comedy',
    year: '2026',
    rating: 4.6,
    duration: '1h 30m',
    is_free: true,
    is_featured: false,
    category: 'Comedy',
    views: 22100,
  },
  {
    id: 'm6',
    title: 'Dilim sa Umaga',
    subtitle: 'PNOYX Action',
    description: 'An ex-soldier returns home to defend his town from a ruthless syndicate.',
    banner: 'https://picsum.photos/seed/pnoyx6banner/800/450',
    poster: 'https://picsum.photos/seed/pnoyx6poster/400/600',
    genre: 'Action · Drama',
    year: '2026',
    rating: 4.4,
    duration: '2h 10m',
    is_free: false,
    is_featured: false,
    category: 'Action',
    views: 17800,
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'trending', label: 'Trending' },
  { id: 'free', label: 'Free' },
  { id: 'Drama', label: 'Drama' },
  { id: 'Action', label: 'Action' },
  { id: 'Romance', label: 'Romance' },
  { id: 'Thriller', label: 'Thriller' },
  { id: 'Comedy', label: 'Comedy' },
  { id: 'Short Film', label: 'Short Films' },
];

export type ReelItem = {
  id: string;
  title: string;
  creator: string;
  likes: number;
  comments: number;
  thumbnail: string;
  video_url: string;
  is_free: boolean;
  rating: number;
  category: string;
};

export const REELS: ReelItem[] = [
  {
    id: 'r1', title: 'Tahanan', creator: '@pnoyx.official',
    likes: 12600, comments: 258,
    thumbnail: 'https://picsum.photos/seed/reel1tall/400/700',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    is_free: true, rating: 4.5, category: 'Short Film',
  },
  {
    id: 'r2', title: 'Ulap sa Buwan', creator: '@carlonavarro',
    likes: 8900, comments: 134,
    thumbnail: 'https://picsum.photos/seed/reel2tall/400/700',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    is_free: true, rating: 4.2, category: 'Short Film',
  },
  {
    id: 'r3', title: 'Tawanan Tayo', creator: '@sheilaramos',
    likes: 21300, comments: 512,
    thumbnail: 'https://picsum.photos/seed/reel3tall/400/700',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    is_free: true, rating: 4.7, category: 'Comedy',
  },
  {
    id: 'r4', title: 'Lihim ng Puso', creator: '@ricovela',
    likes: 5400, comments: 89,
    thumbnail: 'https://picsum.photos/seed/reel4tall/400/700',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    is_free: false, rating: 4.3, category: 'Drama',
  },
  {
    id: 'r5', title: 'Kape at Kwento', creator: '@melissa.ong',
    likes: 9700, comments: 201,
    thumbnail: 'https://picsum.photos/seed/reel5tall/400/700',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    is_free: false, rating: 4.8, category: 'Drama',
  },
  {
    id: 'r6', title: 'Liwanag sa Dilim', creator: '@leopascual',
    likes: 15200, comments: 377,
    thumbnail: 'https://picsum.photos/seed/reel6tall/400/700',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    is_free: false, rating: 4.6, category: 'Thriller',
  },
];

export const TOP_UP_AMOUNTS = [
  { amount: 50, credits: 5 },
  { amount: 100, credits: 10 },
  { amount: 200, credits: 25 },
  { amount: 500, credits: 85 },
];

export function getFeaturedMovies(): Movie[] {
  return MOVIES.filter((m) => m.is_featured);
}

export function getTrendingMovies(): Movie[] {
  return [...MOVIES].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
}

export function getMoviesByCategory(category: string): Movie[] {
  if (category === 'all') return MOVIES;
  if (category === 'trending') return getTrendingMovies();
  if (category === 'free') return MOVIES.filter((m) => m.is_free);
  return MOVIES.filter((m) => m.category === category);
}
