import { auth } from '@/firebaseConfig';
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

// smaple user
const userSample = {
  name: 'Alice Smith',
  avatar: 'https://avatar.iran.liara.run/public/25',
};

// Sample data for barbers
const barbers = [
  {
    id: '1',
    name: 'John Doe',
    image: 'https://avatar.iran.liara.run/public/25',
    rating: 4.5,
    price: 20,
  },

  {
    id: '2',
    name: 'Jane Smith',
    image: 'https://avatar.iran.liara.run/public/1',
    rating: 4.8,
    price: 25,
  },

  {
    id: '3',
    name: 'Mark Johnson',
    image: 'https://avatar.iran.liara.run/public/19',
    rating: 4.2,
    price: 15,
  },
];

const Header = ({ user }) => {
  return (
    <View style={styles.header}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />

      <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
    </View>
  );
};

// Component for rendering each barber card
const BarberCard = ({ barber }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: barber.image }} style={styles.image} />

      <Text style={styles.name}>{barber.name}</Text>

      <Text style={styles.rating}>Rating: ⭐⭐⭐⭐ </Text>

      <Text style={styles.price}>Price: ${barber.price}</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
};
export default function HomeScreen() {
  const user = auth.currentUser;
  return (
    <View style={styles.container}>
      <Header user={userSample} />
      <FlatList
        data={barbers}
        renderItem={({ item }) => <BarberCard barber={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

// Styles
// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#f5f5f5',

    padding: 16,
  },

  header: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 16,

    padding: 10,

    backgroundColor: '#ffffff',

    borderRadius: 8,

    elevation: 3,

    maxHeight: 60, // Limit height to make it more compact
  },

  avatar: {
    width: 50,

    height: 50,

    borderRadius: 25,

    marginRight: 10,
  },

  headerTextContainer: {
    justifyContent: 'center', // Center the text vertically
  },

  welcomeText: {
    fontSize: 18,

    fontWeight: 'bold',
  },

  list: {
    paddingBottom: 16,
  },

  card: {
    backgroundColor: '#fff',

    borderRadius: 8,

    elevation: 3,

    marginBottom: 16,

    padding: 16,
  },

  image: {
    width: 50,

    height: 50,

    borderRadius: 8,

    marginBottom: 10,
  },

  name: {
    fontSize: 18,

    fontWeight: 'bold',
  },

  rating: {
    fontSize: 14,

    color: '#888',
  },

  price: {
    fontSize: 16,

    marginBottom: 10,
  },

  button: {
    backgroundColor: '#3498db',

    padding: 10,

    borderRadius: 5,

    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',

    fontWeight: 'bold',
  },
});
