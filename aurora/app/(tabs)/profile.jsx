import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from '@/components/ui/IconSymbol';

const Profile = () => {
  const userVideos = [
    {
      id: 1,
      title: "Businessman Work with Laptop...",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      username: "jsmastery"
    },
    {
      id: 2,
      title: "Bull trading with computer Bulls...",
      thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      username: "jsmastery"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.signOutButton}>
            <IconSymbol name="arrow.right.square" size={20} color="#FF9C01" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>

          {/* Username */}
          <Text style={styles.username}>jsmastery</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1.2k</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
          </View>
        </View>

        {/* User Videos */}
        <View style={styles.videosSection}>
          {userVideos.map((video) => (
            <TouchableOpacity key={video.id} style={styles.videoItem}>
              <View style={styles.videoHeader}>
                <View style={styles.userInfo}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' }}
                    style={styles.userAvatar}
                  />
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle} numberOfLines={1}>
                      {video.title}
                    </Text>
                    <Text style={styles.videoUsername}>{video.username}</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Text style={styles.moreButton}>⋮</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.videoThumbnailContainer}>
                <Image
                  source={{ uri: video.thumbnail }}
                  style={styles.videoThumbnail}
                  resizeMode="cover"
                />
                <View style={styles.playButton}>
                  <IconSymbol name="play.fill" size={24} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  signOutButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    
    paddingTop: 2,
    backgroundColor: '#161622',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FF9C01',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  username: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#CDCDE0',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  videosSection: {
    paddingHorizontal: 16,
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
  userAvatar: {
    width: 46,
    height: 46,
    borderRadius: 8,
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  videoUsername: {
    color: '#CDCDE0',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  moreButton: {
    color: '#CDCDE0',
    fontSize: 20,
    fontWeight: 'bold',
  },
  videoThumbnailContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: 240,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#161622',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#232533',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    // Active state styling handled by color props
  },
  navLabel: {
    color: '#7b7b8b',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  activeNavLabel: {
    color: '#FF9C01',
  },
});

export default Profile;