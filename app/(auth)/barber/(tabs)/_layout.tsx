import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: 'red',
        //tabBarStyle: hideTabs ? { display: 'none' } : undefined,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="management"
        options={{
          title: 'Management',
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'analytics',
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="booking-details"
        options={{
          href: null, // Disable navigation to this tab
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' }, // Hide the tab bar for this screen
        }}
      />
    </Tabs>
  );
}
