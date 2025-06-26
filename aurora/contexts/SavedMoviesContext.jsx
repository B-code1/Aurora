import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedMoviesContext = createContext();

export const useSavedMovies = () => {
  const context = useContext(SavedMoviesContext);
  if (!context) {
    throw new Error('useSavedMovies must be used within a SavedMoviesProvider');
  }
  return context;
};

export const SavedMoviesProvider = ({ children }) => {
  const [savedMovies, setSavedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved movies from AsyncStorage on app start
  useEffect(() => {
    loadSavedMovies();
  }, []);

  const loadSavedMovies = async () => {
    try {
      const savedMoviesJson = await AsyncStorage.getItem('savedMovies');
      if (savedMoviesJson) {
        const movies = JSON.parse(savedMoviesJson);
        setSavedMovies(movies);
      }
    } catch (error) {
      console.error('Error loading saved movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMoviesToStorage = async (movies) => {
    try {
      await AsyncStorage.setItem('savedMovies', JSON.stringify(movies));
    } catch (error) {
      console.error('Error saving movies to storage:', error);
    }
  };

  const isMovieSaved = (movieId) => {
    return savedMovies.some(movie => movie.id === movieId);
  };

  const addSavedMovie = (movie) => {
    const movieWithSaveDate = {
      ...movie,
      savedAt: new Date().toISOString()
    };
    const updatedMovies = [...savedMovies, movieWithSaveDate];
    setSavedMovies(updatedMovies);
    saveMoviesToStorage(updatedMovies);
  };

  const removeSavedMovie = (movieId) => {
    const updatedMovies = savedMovies.filter(movie => movie.id !== movieId);
    setSavedMovies(updatedMovies);
    saveMoviesToStorage(updatedMovies);
  };

  const toggleSaveMovie = (movie) => {
    if (isMovieSaved(movie.id)) {
      removeSavedMovie(movie.id);
    } else {
      addSavedMovie(movie);
    }
  };

  const value = {
    savedMovies,
    loading,
    isMovieSaved,
    addSavedMovie,
    removeSavedMovie,
    toggleSaveMovie,
  };

  return (
    <SavedMoviesContext.Provider value={value}>
      {children}
    </SavedMoviesContext.Provider>
  );
};
