import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const Create = () => {
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: ''
  });
  const [uploading, setUploading] = useState(false);

  // Handle video upload
  const openVideoPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'],
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets[0]) {
        setForm({ ...form, video: result.assets[0] });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video file');
    }
  };

  // Handle thumbnail upload
  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image file');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!form.title || !form.video || !form.thumbnail) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success!', 
        'Your video has been uploaded successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setForm({
                title: '',
                video: null,
                thumbnail: null,
                prompt: ''
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Upload Video</Text>
        </View>

        <View style={styles.form}>
          {/* Video Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Video Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Give your video a catchy title..."
              placeholderTextColor="#7b7b8b"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
          </View>

          {/* Upload Video */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Upload Video</Text>
            <TouchableOpacity style={styles.uploadContainer} onPress={openVideoPicker}>
              {form.video ? (
                <View style={styles.uploadedFile}>
                  <IconSymbol name="checkmark.circle.fill" size={24} color="#FF9C01" />
                  <Text style={styles.uploadedFileName} numberOfLines={1}>
                    {form.video.name}
                  </Text>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <View style={styles.uploadIcon}>
                    <IconSymbol name="folder" size={24} color="#FF9C01" />
                  </View>
                  <Text style={styles.uploadText}>Choose a file</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Thumbnail Image */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Thumbnail Image</Text>
            <TouchableOpacity style={styles.uploadContainer} onPress={openImagePicker}>
              {form.thumbnail ? (
                <View style={styles.thumbnailPreview}>
                  <Image source={{ uri: form.thumbnail.uri }} style={styles.thumbnailImage} />
                  <View style={styles.thumbnailOverlay}>
                    <IconSymbol name="checkmark.circle.fill" size={24} color="#FF9C01" />
                  </View>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <View style={styles.uploadIcon}>
                    <IconSymbol name="folder" size={24} color="#FF9C01" />
                  </View>
                  <Text style={styles.uploadText}>Choose a file</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* AI Prompt */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>AI Prompt</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="The AI prompt of your video..."
              placeholderTextColor="#7b7b8b"
              value={form.prompt}
              onChangeText={(text) => setForm({ ...form, prompt: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, uploading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={uploading}
          >
            <Text style={styles.submitButtonText}>
              {uploading ? 'Uploading...' : 'Submit & Publish'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  form: {
    paddingBottom: 100,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    borderWidth: 2,
    borderColor: '#232533',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  uploadContainer: {
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#232533',
    borderStyle: 'dashed',
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 156, 1, 0.1)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadText: {
    color: '#FF9C01',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  uploadedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 156, 1, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
  },
  uploadedFileName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginLeft: 12,
    flex: 1,
  },
  thumbnailPreview: {
    position: 'relative',
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 4,
  },
  submitButton: {
    backgroundColor: '#FF9C01',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#161622',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default Create;