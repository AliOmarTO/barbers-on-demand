import HomeScreen from '@/components/screens/HomeScreen';
import SettingsScreen from '@/components/screens/SettingsScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
const Drawer = createDrawerNavigator();

const Layout = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};
export default Layout;
