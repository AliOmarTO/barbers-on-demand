'use client';

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';

// Mock data with avatar URLs
const initialBarbers = [
  {
    id: '1',
    name: 'Tom Marelli',
    price: 45,
    rating: 5,
    clients: 120,
    avatar: 'https://avatar.iran.liara.run/public/1',
  },
  {
    id: '2',
    name: 'Dean Scott',
    price: 65,
    rating: 4.5,
    clients: 210,
    avatar: 'https://avatar.iran.liara.run/public/15',
  },
  {
    id: '3',
    name: 'Melisa Bart',
    price: 70,
    rating: 4.8,
    clients: 360,
    avatar: 'https://avatar.iran.liara.run/public/29',
  },
];

// Additional barbers to load when "Load more" is pressed
const additionalBarbers = [
  {
    id: '4',
    name: 'James Wilson',
    price: 55,
    rating: 4.7,
    clients: 180,
    avatar: 'https://avatar.iran.liara.run/public/18',
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    price: 60,
    rating: 4.9,
    clients: 290,
    avatar: 'https://avatar.iran.liara.run/public/1',
  },
];

// Search Bar Component
const SearchBar = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search barbers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={styles.ratingContainer}>
      {[...Array(fullStars)].map((_, i) => (
        <AntDesign key={`full-${i}`} name="star" size={14} color="#FFD700" />
      ))}
      {halfStar && <AntDesign key="half" name="staro" size={14} color="#FFD700" />}
      {[...Array(emptyStars)].map((_, i) => (
        <AntDesign key={`empty-${i}`} name="staro" size={14} color="#D3D3D3" />
      ))}
    </View>
  );
};

// Barber Card Component
const BarberCard = ({ barber }: { barber: any }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Left side - Barber info */}
        <View style={styles.barberInfoContainer}>
          <Image source={{ uri: barber.avatar }} style={styles.avatar} />
          <View style={styles.barberDetails}>
            <Text style={styles.barberName}>{barber.name}</Text>
            <StarRating rating={barber.rating} />
            <Text style={styles.clientCount}>{barber.clients} clients</Text>
          </View>
        </View>

        {/* Right side - Price and Book button */}
        <View style={styles.priceActionContainer}>
          <Text style={styles.price}>${barber.price}</Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => console.log(`Booking ${barber.name}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Main Component
const BarberBookingScreen = () => {
  const [barbers, setBarbers] = useState(initialBarbers);
  const [showingAll, setShowingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBarbers = barbers.filter((barber) =>
    barber.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => {
    if (!showingAll) {
      setBarbers([...barbers, ...additionalBarbers]);
      setShowingAll(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FlatList
        data={filteredBarbers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BarberCard barber={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      />

      {!showingAll && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
          activeOpacity={0.8}
        >
          <Text style={styles.loadMoreText}>Load more</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  dropdownButton: {
    padding: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barberInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    backgroundColor: '#F0F0F0',
  },
  barberDetails: {
    justifyContent: 'center',
    flex: 1,
  },
  barberName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1A1A1A',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  clientCount: {
    fontSize: 13,
    color: '#888',
    fontWeight: '400',
  },
  priceActionContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  bookButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 90,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  loadMoreButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 120,
    alignItems: 'center',
  },
  loadMoreText: {
    fontWeight: '600',
    color: '#333',
    fontSize: 15,
  },
  searchContainer: {
    margin: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
  },
});

export default BarberBookingScreen;
