"use client";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import type { Movie } from "../services/api";

// Define the context type
interface MovieContextType {
  favourites: Movie[];
  addToFavourites: (movie: Movie) => void;
  removeFromFavourites: (movieId: number) => void;
  isFavourite: (movieId: number) => boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};

// Provider props interface
interface MovieProviderProps {
  children: ReactNode;
}

const MovieProvider = ({ children }: MovieProviderProps) => {
  const [favourites, setFavourites] = useState<Movie[]>([]);

  useEffect(() => {
    const storedFavs = localStorage.getItem("favourites");
    if (storedFavs) setFavourites(JSON.parse(storedFavs));
  }, []);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  // Add movie to favourites
  const addToFavourites = (movie: Movie) => {
    setFavourites((prev) => {
      // Check if movie already exists to avoid duplicates
      if (prev.some((fav) => fav.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  // Remove movie from favourites
  const removeFromFavourites = (movieId: number) => {
    setFavourites((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  // Check if movie is in favourites
  const isFavourite = (movieId: number) => {
    return favourites.some((movie) => movie.id === movieId);
  };

  const value: MovieContextType = {
    favourites,
    addToFavourites,
    removeFromFavourites,
    isFavourite,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};

export { MovieProvider, useMovieContext };
