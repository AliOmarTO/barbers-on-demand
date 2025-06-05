// home screen for barber booking app

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
import BarberCard from '@/components/BarberCard';
import { useAtom } from 'jotai';
import { barbersAtom } from '@/store/barberAtom';

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

// Main Component
const BarberBookingScreen = () => {
  // jotai barbers
  const [barbersList] = useAtom(barbersAtom);
  const [barbers, setBarbers] = useState(barbersList);
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
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  addressText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
    fontWeight: '400',
  },
});

export default BarberBookingScreen;
