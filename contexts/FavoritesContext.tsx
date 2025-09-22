"use client";

import React, { useContext, useState, ReactNode, createContext } from 'react';

interface FavoritesContextType {
  favorites: Set<number>;
  addToFavorites: (authorId: number) => void;
  removeFromFavorites: (authorId: number) => void;
  isFavorite: (authorId: number) => boolean;
  toggleFavorite: (authorId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('Favorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const addToFavorites = (authorId: number) => {
    setFavorites(prev => new Set([...prev, authorId]));
  };

  const removeFromFavorites = (authorId: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      newSet.delete(authorId);
      return newSet;
    });
  };

  const isFavorite = (authorId: number) => {
    return favorites.has(authorId);
  };

  const toggleFavorite = (authorId: number) => {
    if (isFavorite(authorId)) {
      removeFromFavorites(authorId);
    } else {
      addToFavorites(authorId);
    }
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};