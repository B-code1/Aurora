import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSavedMovies } from '../../contexts/SavedMoviesContext';
import YouTubePlayerModal from '../../components/YouTubePlayerModal';
import axios from 'axios';

const TMDB_API_KEY = '494b1da00b4c1403f92226e7163d4f81';
const BASE_URL = 'https://api.themoviedb.org/3';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780';

const Saved = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [youtubeModalVisible, setYoutubeModalVisible] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState({ videoId: null, movieTitle: '' });
  
  // Use the shared saved movies context
  const { savedMovies, loading, removeSavedMovie } = useSavedMovies();

  // Search through saved movies
  const searchSavedMovies = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredMovies(savedMovies);
      return;
    }

    const filtered = savedMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.overview.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  const handleSearch = () => {
    searchSavedMovies(searchQuery);
  };

  const handleSearchSubmit = () => {
    searchSavedMovies(searchQuery);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredMovies(savedMovies);
  };

  // Update filtered movies when savedMovies changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredMovies(savedMovies);
    } else {
      searchSavedMovies(searchQuery);
    }
  }, [savedMovies]);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9C01" />
          <Text style={styles.loadingText}>Loading saved movies...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Saved Movies</Text>
          <Text style={styles.headerSubtitle}>
            {savedMovies.length} movie{savedMovies.length !== 1 ? 's' : ''} saved
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search saved movies..."
            placeholderTextColor="#7b7b8b"
            value={searchQuery}
            onChangeText={searchSavedMovies}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={searchQuery ? clearSearch : handleSearch}
          >
            <IconSymbol 
              name={searchQuery ? "xmark" : "magnifyingglass"} 
              size={20} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>

        {/* Movies List */}
        <View style={styles.moviesSection}>
          {filteredMovies.length === 0 ? (
            <View style={styles.emptyContainer}>
              {searchQuery ? (
                <>
                  <IconSymbol name="magnifyingglass" size={48} color="#7b7b8b" />
                  <Text style={styles.emptyText}>No saved movies found</Text>
                  <Text style={styles.emptySubtext}>
                    No movies match "{searchQuery}"
                  </Text>
                  <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
                    <Text style={styles.clearSearchText}>Clear Search</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <IconSymbol name="bookmark" size={48} color="#7b7b8b" />
                  <Text style={styles.emptyText}>No saved movies yet</Text>
                  <Text style={styles.emptySubtext}>
                    Movies you save will appear here
                  </Text>
                </>
              )}
            </View>
          ) : (
            <>
              {searchQuery && (
                <Text style={styles.searchResultsText}>
                  {filteredMovies.length} result{filteredMovies.length !== 1 ? 's' : ''} for "{searchQuery}"
                </Text>
              )}
              
              {filteredMovies.map((movie) => (
                <View key={movie.id} style={styles.movieItem}>
                  <View style={styles.movieHeader}>
                    <View style={styles.userInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {movie.original_language ? movie.original_language.toUpperCase() : 'EN'}
                        </Text>
                      </View>
                      <View style={styles.movieInfo}>
                        <Text style={styles.movieTitle} numberOfLines={1}>
                          {movie.title}
                        </Text>
                        <Text style={styles.movieRating}>
                          Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
                        </Text>
                        <Text style={styles.movieYear}>
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.movieActions}>
                      <TouchableOpacity 
                        style={styles.removeButton} 
                        onPress={() => removeSavedMovie(movie.id)}
                      >
                        <IconSymbol 
                          name="bookmark.fill" 
                          size={20} 
                          color="#FF9C01" 
                        />
                      </TouchableOpacity>
                      {/* More options button */}
                      <TouchableOpacity>
                        <Text style={styles.moreButton}>⋮</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.movieImageContainer}
                    onPress={() => openTrailer(movie.id, movie.title)}
                  >
                    <Image
                      source={{ 
                        uri: movie.backdrop_path 
                          ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` 
                          : 'https://via.placeholder.com/780x440?text=No+Image'
                      }}
                      style={styles.movieImage}
                      resizeMode="cover"
                    />
                    <View style={styles.playButton}>
                      <IconSymbol name="play.fill" size={24} color="#FFFFFF" />
                      <Text style={styles.trailerText}>Watch Trailer</Text>
                    </View>
                  </TouchableOpacity>
                  
                  <View style={styles.movieDescription}>
                    <Text style={styles.overview} numberOfLines={3}>
                      {movie.overview}
                    </Text>
                    <View style={styles.movieDetails}>
                      <Text style={styles.popularity}>Popularity: {movie.popularity}</Text>
                      <Text style={styles.savedDate}>
                        Saved: {new Date(movie.savedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
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
    paddingVertical: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#CDCDE0',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
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
  moviesSection: {
    paddingBottom: 100,
  },
  searchResultsText: {
    color: '#CDCDE0',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
    textAlign: 'center',
  },
  movieItem: {
    marginBottom: 32,
  },
  movieHeader: {
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
    fontSize: 12,
    fontWeight: 'bold',
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  movieRating: {
    color: '#CDCDE0',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  movieYear: {
    color: '#CDCDE0',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  movieActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    padding: 8,
    marginRight: 8,
  },
  moreButton: {
    color: '#CDCDE0',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  movieImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  movieImage: {
    width: '100%',
    height: 240,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -25 }],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  trailerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  movieDescription: {
    marginTop: 12,
  },
  overview: {
    color: '#CDCDE0',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
    lineHeight: 20,
  },
  movieDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popularity: {
    color: '#CDCDE0',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  savedDate: {
    color: '#FF9C01',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#CDCDE0',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  clearSearchButton: {
    backgroundColor: '#FF9C01',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  clearSearchText: {
    color: '#161622',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default Saved;