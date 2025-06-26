import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator,
  StatusBar 
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width, height } = Dimensions.get('window');

const YouTubePlayerModal = ({ visible, onClose, videoId, movieTitle }) => {
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef();

  const onStateChange = (state) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  };

  const onReady = () => {
    setLoading(false);
  };

  const handleClose = () => {
    setPlaying(false);
    onClose();
  };

  const togglePlayback = () => {
    setPlaying((prev) => !prev);
  };

  if (!visible || !videoId) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <IconSymbol name="xmark" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {movieTitle}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Video Player Container */}
        <View style={styles.videoContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF9C01" />
              <Text style={styles.loadingText}>Loading trailer...</Text>
            </View>
          )}
          
          <YoutubePlayer
            ref={playerRef}
            height={height * 0.25}
            width={width}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
            onReady={onReady}
            onError={(error) => {
              console.error('YouTube Player Error:', error);
              setLoading(false);
            }}
            webViewStyle={styles.webView}
            webViewProps={{
              injectedJavaScript: `
                var element = document.getElementsByClassName('container')[0];
                element.style.position = 'unset';
                element.style.paddingBottom = 'unset';
                true;
              `,
            }}
          />
        </View>

        {/* Controls */}
        {!loading && (
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.playButton} 
              onPress={togglePlayback}
            >
              <IconSymbol 
                name={playing ? "pause.fill" : "play.fill"} 
                size={24} 
                color="#FFFFFF" 
              />
              <Text style={styles.playButtonText}>
                {playing ? 'Pause' : 'Play'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.info}>
              <Text style={styles.infoText}>Tap to close when done watching</Text>
            </View>
          </View>
        )}

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#161622',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
  },
  webView: {
    backgroundColor: '#000000',
  },
  controls: {
    backgroundColor: '#161622',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9C01',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  playButtonText: {
    color: '#161622',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  infoText: {
    color: '#CDCDE0',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 34,
    backgroundColor: '#161622',
  },
});

export default YouTubePlayerModal;
