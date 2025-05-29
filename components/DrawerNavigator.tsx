// import { auth } from '@/firebaseConfig';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import React from 'react';
// import { Button } from 'react-native';
// import HomeScreen from './screens/HomeScreen';
// import SettingsScreen from './screens/SettingsScreen';
// const Drawer = createDrawerNavigator();

// export default function DrawerNavigator() {
//   const user = auth.currentUser;
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         headerShown: true,
//       }}
//     >
//       <Drawer.Screen name="Home" component={HomeScreen} />
//       <Drawer.Screen name="Settings" component={SettingsScreen} />
//       <Button title="Sign out" onPress={() => auth.signOut()} />
//     </Drawer.Navigator>
//   );
// }
