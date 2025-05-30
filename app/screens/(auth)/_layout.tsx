import HomeScreen from '@/components/screens/HomeScreen';
import BarberBookingScreen from './BarberBookingScreen';
import SettingsScreen from '@/app/screens/(auth)/SettingsScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import MapScreen from './MapScreen';

const Drawer = createDrawerNavigator();

const Layout = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#cc001e',
        headerTitleStyle: {
          color: 'black',
        },
        drawerActiveTintColor: '#cc001e',
        drawerStyle: {
          backgroundColor: '#f6f6f6',
          width: 240,
        },
      }}
    >
      <Drawer.Screen name="Home" component={BarberBookingScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Map" component={MapScreen} />
    </Drawer.Navigator>
  );
};
export default Layout;
