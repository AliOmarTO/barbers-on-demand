import React, { useRef, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Text, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BarberCard from '@/components/BarberCard';

const mockCurrentLocation = {
  latitude: 43.6276, // Etobicoke approx latitude
  longitude: -79.5372, // Etobicoke approx longitude
};

const mockBarbers = [
  {
    id: 1,
    name: 'Tom Marelli',
    price: '45',
    rating: 4.8,
    reviews: 124,
    address: '123 King St W, Toronto',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    coordinate: { latitude: 43.6532, longitude: -79.3832 },
  },
  {
    id: 2,
    name: 'Dean Scott',
    price: '65',
    rating: 4.6,
    reviews: 98,
    address: '456 Queen St W, Toronto',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    coordinate: { latitude: 43.6617, longitude: -79.395 },
  },
  {
    id: 3,
    name: 'Melisa Bart',
    price: '70',
    rating: 4.9,
    reviews: 156,
    address: '789 Yonge St, Toronto',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    coordinate: { latitude: 43.6487, longitude: -79.3817 },
  },
  {
    id: 4,
    name: 'Jordan Singh',
    price: '60',
    rating: 4.7,
    reviews: 87,
    address: '321 Bloor St W, Toronto',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    coordinate: { latitude: 43.6205, longitude: -79.5132 },
  },
  {
    id: 5,
    name: 'Alex Vaughan',
    price: '55',
    rating: 4.5,
    reviews: 112,
    address: '654 Dundas St E, Toronto',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    coordinate: { latitude: 43.8372, longitude: -79.5083 },
  },
  {
    id: 6,
    name: 'Alex Vaughan',
    price: '55',
    rating: 4.5,
    reviews: 112,
    address: '654 Dundas St E, Toronto',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    coordinate: { latitude: 43.8372, longitude: -79.5083 },
  },
];

export default function BarberMapScreen() {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  const mapRef = useRef<MapView>(null);

  const snapToMarker = (coordinate: { latitude: number; longitude: number }) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...coordinate,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      ); // 500ms animation duration
      sheetRef.current?.snapToIndex(0); // Close the bottom sheet
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 43.7, // Roughly center of GTA
          longitude: -79.4, // Roughly center of GTA
          latitudeDelta: 0.3, // Large enough to cover GTA north-south
          longitudeDelta: 0.3, // Large enough to cover GTA east-west
        }}
      >
        {/* Mock Current Location */}
        <Marker
          coordinate={mockCurrentLocation}
          title="Mocked Current Location"
          pinColor="blue" // differentiate with color
        />
        {/* Other barber markers */}
        {mockBarbers.map((barber) => (
          <Marker
            key={barber.id}
            coordinate={barber.coordinate}
            title={barber.name}
            description={`Price: ${barber.price}`}
          >
            <Callout>
              <View>
                <Text style={{ fontWeight: 'bold' }}>{barber.name}</Text>
                <Text>{barber.price}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <BottomSheet
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
        style={styles.sheetContent}
      >
        <Text style={styles.sheetTitle}>Available Barbers</Text>
        <BottomSheetFlatList
          data={mockBarbers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => snapToMarker(item.coordinate)}>
              <BarberCard barber={item} />
            </TouchableOpacity>
          )}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  barberCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  barberName: {
    fontSize: 16,
    fontWeight: '500',
  },
  barberPrice: {
    color: 'gray',
  },
});
