import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
  Modal,
} from "react-native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { pixelNormalize } from "../components/Normalise";
import { MaterialIcons } from "@expo/vector-icons";
import Amenities from "../components/Amenities";

const HotelInforScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImages, setModalImages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: `${route.params.name}`,
      headerTitleStyle: {
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
    });
  }, []);

  const difference = route.params.oldPrice - route.params.newPrice;
  const offerPrice = (Math.abs(difference) / route.params.oldPrice) * 100;

  const pixelNormalize = (size) => {
    return size;
  };

  const handleShowMorePress = () => {
    setModalImages(route.params.photos);
    setModalVisible(true);
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <Pressable
            style={{ flexDirection: "row", flexWrap: "wrap", margin: 10 }}
          >
            {route.params.photos.slice(0, 5).map((photo, index) => (
              <View key={index} style={{ margin: 6 }}>
                <Image
                  style={{
                    width: 120,
                    height: pixelNormalize(80),
                    borderRadius: pixelNormalize(4),
                  }}
                  source={{ uri: photo }}
                />
              </View>
            ))}
            <Pressable
              style={{ alignItems: "center", justifyContent: "center" }}
              onPress={handleShowMorePress}
            >
              <Text style={{ textAlign: "center", marginLeft: 20 }}>
                Show More
              </Text>
            </Pressable>
          </Pressable>

          <View
            style={{
              marginHorizontal: 12,
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                {route.params.name}
              </Text>
              <Text style={{ fontSize: 22, fontWeight: "italic" }}>
                {route.params.address}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 7,
                }}
              >
                <MaterialIcons name="stars" size={24} color="green" />
                <Text>{route.params.rating}</Text>
              </View>
            </View>
          </View>

          <Text
            style={{
              borderColor: "#E0E0E0",
              borderWidth: 3,
              height: 1,
              marginTop: 15,
            }}
          />
          <Text
            style={{
              marginTop: 10,
              fontSize: 17,
              fontWeight: "500",
              marginHorizontal: 12,
            }}
          >
            Price for {route.params.nights} Night and {route.params.adults} adults
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 12,
              marginTop: 4,
              gap: 8,
            }}
          >
            <Text
              style={{
                color: "red",
                fontSize: 20,
              }}
            >
              {route.params.averagePrice * route.params.nights}$
            </Text>
            <Text style={{ fontSize: 18 }}>
              Payment: {route.params.payment}
            </Text>
          </View>

          <Text
            style={{
              borderColor: "#E0E0E0",
              borderWidth: 3,
              height: 1,
              marginTop: 15,
            }}
          />
          <View
            style={{
              margin: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 60,
            }}
          >
            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "600", marginBottom: 3 }}
              >
                Check In
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "#007FFF" }}
              >
                {route.params.selectedDates.startDate}
              </Text>
            </View>

            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "600", marginBottom: 3 }}
              >
                Check Out
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "#007FFF" }}
              >
                {route.params.selectedDates.endDate}
              </Text>
            </View>
          </View>
          <View style={{ margin: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 3 }}>
              Rooms and Guests
            </Text>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#007FFF" }}
            >
              {route.params.rooms} rooms {route.params.adults} adults{" "}
              {route.params.children} children
            </Text>
          </View>

          <Text
            style={{
              borderColor: "#E0E0E0",
              borderWidth: 3,
              height: 1,
              marginTop: 15,
            }}
          />
          <Amenities />

          <Text
            style={{
              borderColor: "#E0E0E0",
              borderWidth: 3,
              height: 1,
              marginTop: 15,
            }}
          />
        </ScrollView>
      </SafeAreaView>

      <Pressable
        onPress={() =>
          navigation.navigate("Rooms", {
            userId: route.params.userId,
            rooms: route.params.rooms,
            oldPrice: route.params.oldPrice,
            newPrice: route.params.newPrice,
            name: route.params.name,
            address: route.params.address,
            children: route.params.children,
            adults: route.params.adults,
            rating: route.params.rating,
            startDate: route.params.selectedDates.startDate,
            city: route.params.city,
            nights: route.params.nights,
            endDate: route.params.selectedDates.endDate,
          })
        }
        style={{
          backgroundColor: "#6CB4EE",
          position: "absolute",
          bottom: 20,
          padding: 15,
          width: "95%",
          marginHorizontal: 10,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 17,
          }}
        >
          Select Availabilty
        </Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView horizontal>
              {modalImages.map((image, index) => (
                <Image key={index} style={styles.modalImage} source={{ uri: image }} />
              ))}
            </ScrollView>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default HotelInforScreen;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    height: 300,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    margin: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007FFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
