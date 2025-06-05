// BarberCard.tsx
'use client';

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { selectedBarberAtom } from '@/store/barberAtom';
import { Barber } from '@/types';

// StarRating component inside this file for convenience (or you can export/import separately)
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

const BarberCard = ({ barber }: { barber: Barber }) => {
  const router = useRouter();
  const setSelectedBarber = useSetAtom(selectedBarberAtom);

  const handleBookNow = () => { 
    setSelectedBarber(barber);
    router.push('/(auth)/(tabs)/home/select-time');
  }
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.barberInfoContainer}>
          <Image source={{ uri: barber.avatar }} style={styles.avatar} />
          <View style={styles.barberDetails}>
            <Text style={styles.barberName}>{barber.name}</Text>
            <StarRating rating={barber.rating} />
            <Text style={styles.clientCount}>{barber.clients} clients</Text>
            <View style={styles.addressContainer}>
              <Ionicons name="location-outline" size={12} color="#888" />
              <Text style={styles.addressText}>{barber.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceActionContainer}>
          <Text style={styles.price}>${barber.price}</Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookNow}
            activeOpacity={0.8}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#AD1017',
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
});

export default BarberCard;
