import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSavedMovies } from '../../contexts/SavedMoviesContext';
import YouTubePlayerModal from '../../components/YouTubePlayerModal';
import axios from 'axios';

const TMDB_API_KEY = '494b1da00b4c1403f92226e7163d4f81';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [youtubeModalVisible, setYoutubeModalVisible] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState({ videoId: null, movieTitle: '' });
  
  // Use the shared saved movies context
  const { savedMovies, isMovieSaved, toggleSaveMovie } = useSavedMovies();

  // Fetch trending movies
  const fetchTrendingMovies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`);
      return response.data.results.slice(0, 5);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return [];
    }
  };

  // Fetch popular movies
  const fetchPopularMovies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
      return response.data.results.slice(0, 10);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  };

  // Search movies
  const searchMovies = async (query) => {
    setSearchLoading(true);
    
    if (!query.trim()) {
      const movies = await fetchPopularMovies();
      setPopularMovies(movies);
      setSearchLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`);
      setPopularMovies(response.data.results.slice(0, 10));
    } catch (error) {
      console.error('Error searching movies:', error);
      setPopularMovies([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = () => {
    searchMovies(searchQuery);
  };

  const handleSearchSubmit = () => {
    searchMovies(searchQuery);
  };

  // Fetch movie trailer
  const fetchMovieTrailer = async (movieId) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`);
      const videos = response.data.results;
      
      // Find YouTube trailer
      const trailer = videos.find(video => 
        video.type === 'Trailer' && 
        video.site === 'YouTube'
      );
      
      return trailer ? trailer.key : null;
    } catch (error) {
      console.error('Error fetching trailer:', error);
      return null;
    }
  };

  // Open YouTube trailer in modal
  const openTrailer = async (movieId, movieTitle) => {
    try {
      const trailerKey = await fetchMovieTrailer(movieId);
      
      if (trailerKey) {
        setSelectedTrailer({ videoId: trailerKey, movieTitle });
        setYoutubeModalVisible(true);
      } else {
        Alert.alert('No Trailer Found', `No trailer available for "${movieTitle}"`);
      }
    } catch (error) {
      console.error('Error opening trailer:', error);
      Alert.alert('Error', 'Failed to load trailer');
    }
  };

  const closeTrailerModal = () => {
    setYoutubeModalVisible(false);
    setSelectedTrailer({ videoId: null, movieTitle: '' });
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [trending, popular] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies()
        ]);
        setTrendingMovies(trending);
        setPopularMovies(popular);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9C01" />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.usernameText}>jsmastery</Text>
          </View>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for movies..."
            placeholderTextColor="#7b7b8b"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            {searchLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <IconSymbol name="magnifyingglass" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Trending Movies Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Trending Movies</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScrollView}>
            {trendingMovies.map((movie, index) => (
              <TouchableOpacity key={movie.id} style={styles.trendingCard}>
                <Image
                  source={{ 
                    uri: movie.poster_path 
                      ? `${IMAGE_BASE_URL}${movie.poster_path}` 
                      : 'https://via.placeholder.com/300x400?text=No+Image'
                  }}
                  style={styles.trendingImage}
                  resizeMode="cover"
                />
                <View style={styles.movieOverlay}>
                  <Text style={styles.movieTitle} numberOfLines={2}>
                    {movie.title}
                  </Text>
                </View>
                {/* Play trailer button for trending movies */}
                <TouchableOpacity 
                  style={styles.playButtonTrending} 
                  onPress={() => openTrailer(movie.id, movie.title)}
                >
                  <IconSymbol name="play.fill" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                
                {/* Save button for trending movies */}
                <TouchableOpacity 
                  style={styles.saveButtonTrending} 
                  onPress={() => toggleSaveMovie(movie)}
                >
                  <IconSymbol 
                    name={isMovieSaved(movie.id) ? "bookmark.fill" : "bookmark"} 
                    size={20} 
                    color={isMovieSaved(movie.id) ? "#FF9C01" : "#FFFFFF"} 
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Page Indicators */}
          <View style={styles.pageIndicators}>
            {trendingMovies.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.indicator, 
                  index === 0 && styles.activeIndicator
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Movie List */}
        <View style={styles.videoList}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
          </Text>
          
          {popularMovies.length === 0 && searchQuery ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No movies found for "{searchQuery}"</Text>
              <Text style={styles.noResultsSubtext}>Try searching for a different movie</Text>
            </View>
          ) : (
            popularMovies.length > 0 && popularMovies.map((movie) => (
              <TouchableOpacity key={movie.id} style={styles.videoItem}>
                <View style={styles.videoHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {movie.original_language ? movie.original_language.toUpperCase() : 'EN'}
                      </Text>
                    </View>
                    <View style={styles.movieInfo}>
                      <Text style={styles.videoTitle} numberOfLines={1}>
                        {movie.title}
                      </Text>
                      <Text style={styles.username}>
                        Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
                      </Text>
                      <Text style={styles.releaseDate}>
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.movieActions}>
                    <TouchableOpacity 
                      style={styles.saveButton} 
                      onPress={() => toggleSaveMovie(movie)}
                    >
                      <IconSymbol 
                        name={isMovieSaved(movie.id) ? "bookmark.fill" : "bookmark"} 
                        size={20} 
                        color={isMovieSaved(movie.id) ? "#FF9C01" : "#CDCDE0"} 
                      />
                    </TouchableOpacity>
                    {/* More options button */}
                    <TouchableOpacity>
                      <Text style={styles.moreButton}>⋮</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.videoThumbnailContainer}
                  onPress={() => openTrailer(movie.id, movie.title)}
                >
                  <Image
                    source={{ 
                      uri: movie.backdrop_path 
                        ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` 
                        : 'https://via.placeholder.com/780x440?text=No+Image'
                    }}
                    style={styles.videoThumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.playButtonOverlay}>
                    <IconSymbol name="play.fill" size={32} color="#FFFFFF" />
                    <Text style={styles.watchTrailerText}>Watch Trailer</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.movieDescription}>
                  <Text style={styles.overview} numberOfLines={3}>
                    {movie.overview || 'No description available.'}
                  </Text>
                  <View style={styles.movieDetails}>
                    <Text style={styles.genre}>Popularity: {movie.popularity}</Text>
                    <Text style={styles.director}>Adult: {movie.adult ? 'Yes' : 'No'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Saved Movies Counter */}
        {savedMovies.length > 0 && (
          <View style={styles.savedCounter}>
            <Text style={styles.savedCounterText}>
              {savedMovies.length} movie{savedMovies.length !== 1 ? 's' : ''} saved
            </Text>
          </View>
        )}
      </ScrollView>

      {/* YouTube Player Modal */}
      <YouTubePlayerModal
        visible={youtubeModalVisible}
        onClose={closeTrailerModal}
        videoId={selectedTrailer.videoId}
        movieTitle={selectedTrailer.movieTitle}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#CDCDE0',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  welcomeText: {
    color: '#CDCDE0',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  usernameText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FF9C01',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#232533',
  },
  searchInput: {
    flex: 1,
    color: '#CDCDE0',
    fontSize: 16,
    paddingVertical: 16,
    fontFamily: 'Poppins-Regular',
  },
  searchButton: {
    padding: 8,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#CDCDE0',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  trendingScrollView: {
    marginBottom: 16,
  },
  trendingCard: {
    width: 170,
    height: 288,
    marginRight: 20,
    borderRadius: 33,
    overflow: 'hidden',
    position: 'relative',
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  movieOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  playButtonTrending: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(255, 156, 1, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  saveButtonTrending: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 8,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#232533',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FF9C01',
  },
  videoList: {
    paddingBottom: 100,
  },
  videoItem: {
    marginBottom: 32,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#FF9C01',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#161622',
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieInfo: {
    flex: 1,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  username: {
    color: '#CDCDE0',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  releaseDate: {
    color: '#CDCDE0',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  movieActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    padding: 8,
    marginRight: 8,
  },
  moreButton: {
    color: '#CDCDE0',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  videoThumbnailContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: 240,
    borderRadius: 12,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -30 }],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  watchTrailerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  movieDescription: {
    marginTop: 12,
  },
  overview: {
    color: '#CDCDE0',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  movieDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genre: {
    color: '#CDCDE0',
    fontSize: 12,     
    fontFamily: 'Poppins-Regular',
  },
  director: {
    color: '#CDCDE0',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noResultsText: {
    color: '#CDCDE0',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,      
  },
  noResultsSubtext: {
    color: '#7b7b8b',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',    
  },
  savedCounter: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    backgroundColor: '#FF9C01',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  savedCounterText: {
    color: '#161622',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Home;