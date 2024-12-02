import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const ConfirmScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Confirmation",
      headerTitleStyle: styles.headerTitle,
      headerStyle: styles.headerStyle,
    });
  }, [navigation]);

  const confirmBooking = async () => {
    try {
      const roomRef = await addDoc(collection(db, 'booking_detail'), {
        ...route.params,
        status: 0,
      });
      navigation.navigate("Main");
    } catch (error) {
      console.error('Error saving data: ', error);
      alert('Error saving data');
    }
  };

  return (
    <View>
      <Pressable style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{route.params.name}</Text>
          <Text style={styles.address}>{route.params.address}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="stars" size={24} color="green" />
            <Text style={styles.rating}>{route.params.rating}</Text>
          </View>
        </View>

        <View style={styles.datesContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Check In</Text>
            <Text style={styles.dateValue}>{route.params.startDate}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Check Out</Text>
            <Text style={styles.dateValue}>{route.params.endDate}</Text>
          </View>
        </View>

        <View style={styles.roomsContainer}>
          <Text style={styles.roomsLabel}>Rooms and Guests</Text>
          <Text style={styles.roomsValue}>
            {route.params.rooms} rooms --- {route.params.adults} adults
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>
            {route.params.newPrice * route.params.nights}$
          </Text>
        </View>

        <Pressable onPress={confirmBooking} style={styles.bookNowButton}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </Pressable>
      </Pressable>
    </View>
  );
};

export default ConfirmScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerStyle: {
    backgroundColor: "#003580",
    height: 110,
    borderBottomColor: "transparent",
    shadowColor: "transparent",
  },
  infoContainer: {
    marginHorizontal: 12,
    marginTop: 10,
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
  },
  address: {
    fontSize: 22,
    fontWeight: "italic",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    gap: 6,
  },
  rating: {
    fontSize: 16,
  },
  datesContainer: {
    margin: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 60,
  },
  dateItem: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007FFF",
  },
  roomsContainer: {
    margin: 12,
  },
  roomsLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
  },
  roomsValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007FFF",
  },
  priceContainer: {
    margin: 12,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007FFF",
  },
  bookNowButton: {
    backgroundColor: "#003580",
    width: 120,
    padding: 5,
    marginHorizontal: 12,
    marginBottom: 20,
    borderRadius: 4,
  },
  bookNowText: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});
