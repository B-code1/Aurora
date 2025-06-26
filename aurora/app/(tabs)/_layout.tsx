import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
        screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>["name"] =
            "home-outline";
          if (route.name === "home") iconName = "home-outline";
          else if (route.name === "profile") iconName = "person-outline";
          else if (route.name === "create") iconName = "add-circle-outline";
          else if (route.name === "saved") iconName = "bookmark-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#aaa",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        })
      })}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
         
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
         
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          
        }}
      />
    </Tabs>
  );
}
