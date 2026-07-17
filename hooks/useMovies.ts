import { useState, useEffect } from 'react';
import {
  Movie,
  MOVIES,
  getFeaturedMovies,
  getTrendingMovies,
  getMoviesByCategory,
} from '../services/movieService';

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>(MOVIES);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // Simulate async data load
    const timer = setTimeout(() => {
      setMovies(MOVIES);
      setFeaturedMovies(getFeaturedMovies());
      setTrendingMovies(getTrendingMovies());
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  function filterByCategory(category: string) {
    setActiveCategory(category);
    setMovies(getMoviesByCategory(category));
  }

  return {
    movies,
    featuredMovies,
    trendingMovies,
    loading,
    activeCategory,
    filterByCategory,
  };
}
