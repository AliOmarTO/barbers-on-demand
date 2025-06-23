import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Types
interface BarberShop {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  tags: string[];
}

// Mock data
const recommendedShops: BarberShop[] = [
  {
    id: '1',
    name: 'Classic Cuts',
    rating: 5.0,
    reviews: 97,
    location: 'Downtown, Toronto',
    image:
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80',
    tags: ['Barber Shop'],
  },
  {
    id: '2',
    name: 'Fade Masters',
    rating: 5.0,
    reviews: 1238,
    location: '1314 King Street West',
    image:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    tags: ['Barber Shop'],
  },
];

const newShops: BarberShop[] = [
  {
    id: '3',
    name: "Gentleman's Grooming",
    rating: 4.9,
    reviews: 135,
    location: 'Midtown, Toronto',
    image:
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    tags: ['Barber Shop'],
  },
  {
    id: '4',
    name: 'Style Studio',
    rating: 5.0,
    reviews: 56,
    location: 'Yorkville, Toronto',
    image:
      'https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    tags: ['Barber Shop'],
  },
];

const mobileBarbers: BarberShop[] = [
  {
    id: '5',
    name: 'Liam Edwards',
    rating: 4.8,
    reviews: 203,
    location: 'Liberty Village, Toronto',
    image:
      'https://plus.unsplash.com/premium_photo-1689533448099-2dc408030f0f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Mobile Barber'],
  },
  {
    id: '6',
    name: 'Jane Kim',
    rating: 4.7,
    reviews: 189,
    location: 'Queen West, Toronto',
    image:
      'https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Mobile Barber'],
  },
];

// Shop Card Component
const ShopCard = ({ shop }: { shop: BarberShop }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: shop.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.shopName}>{shop.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{shop.rating}</Text>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.reviews}> ({shop.reviews})</Text>
        </View>
        <Text style={styles.location}>{shop.location}</Text>
        <View style={styles.tagsContainer}>
          {shop.tags.map((tag, index) => (
            <View key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Section Header Component
const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

// Shop List Component
const ShopList = ({ shops }: { shops: BarberShop[] }) => (
  <FlatList
    data={shops}
    renderItem={({ item }) => <ShopCard shop={item} />}
    keyExtractor={(item) => item.id}
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.shopList}
  />
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome Ali</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Recommended" />
          <ShopList shops={recommendedShops} />
        </View>

        <View style={styles.section}>
          <SectionHeader title="New to BoD" />
          <ShopList shops={newShops} />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Mobile Barbers" />
          <ShopList shops={mobileBarbers} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  notificationButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  shopList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  card: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontWeight: 'bold',
    marginRight: 2,
  },
  reviews: {
    color: '#666',
  },
  location: {
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#4b5563',
  },
});
