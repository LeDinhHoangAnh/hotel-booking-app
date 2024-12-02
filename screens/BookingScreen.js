import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

const BookingScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "IStay",
      headerTitleStyle: styles.headerTitle,
      headerStyle: styles.header,
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const unsubscribeSnapshot = onSnapshot(query(collection(db, "booking_detail"), where('userId', '==', user.uid)), (snapshot) => {
          const listBookingDetail = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          listBookingDetail.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
          setBookings(listBookingDetail);
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setBookings([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'waiting';
      case 1:
        return 'accept';
      case 2:
        return 'reject';
      default:
        return 'unknown';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 0:
        return styles.waiting;
      case 1:
        return styles.accept;
      case 2:
        return styles.reject;
      default:
        return styles.default;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#003580" style={styles.loadingIndicator} />
      ) : bookings.length > 0 ? (
        <ScrollView>
          {bookings.map((item) => (
            <Pressable key={item.id} style={styles.bookingItem}>
              <Text style={styles.bookingTitle}>{item.name}</Text>
              <Text style={styles.bookingTitle}>{item.address}</Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="stars" size={24} color="green" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <Text style={styles.infoText}>Room: {item.rooms} room</Text>
              <Text style={styles.infoText}>Price: {item.newPrice * item.nights}$</Text>
              <Text style={styles.infoText}>Check-in: {item.startDate}</Text>
              <Text style={styles.infoText}>Check-out: {item.endDate}</Text>
              <Text style={[styles.status, getStatusStyle(item.status)]}>
                {getStatusText(item.status)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noBookingsText}>No bookings available</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  header: {
    backgroundColor: '#003580',
    height: 110,
    borderBottomColor: 'transparent',
    shadowColor: 'transparent',
  },
  bookingItem: {
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 20,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    padding: 14,
    borderRadius: 6,
  },
  bookingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  ratingText: {
    marginLeft: 3,
    fontSize: 15,
    fontWeight: '400',
  },
  infoText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#555',
  },
  noBookingsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#555',
  },
  status: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    textAlign: 'center'
  },
  waiting: {
    backgroundColor: 'yellow',
    color: 'black',
  },
  accept: {
    backgroundColor: 'green',
    color: 'white',
  },
  reject: {
    backgroundColor: 'red',
    color: 'white',
  },
  default: {
    backgroundColor: 'gray',
    color: 'white',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BookingScreen;
