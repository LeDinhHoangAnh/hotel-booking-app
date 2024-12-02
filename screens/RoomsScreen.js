import { StyleSheet, Text, View, ScrollView, Pressable, Modal,Image, ActivityIndicator } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Amenities from "../components/Amenities";

const RoomsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hotelId, setHotelId] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImages, setModalImages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Available Rooms",
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
  }, [navigation]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);

      try {
        const { city, name } = route.params || {};
        if (!city || !name) {
          console.error("City or name is not defined in route parameters");
          setLoading(false);
          return;
        }

        const hotelQuery = query(collection(db, "hotels"), where("name", "==", name));
        const hotelSnapshot = await getDocs(hotelQuery);
        if (hotelSnapshot.empty) {
          console.error("No matching hotel found.");
          setLoading(false);
          return;
        }

        hotelSnapshot.forEach((hotelDoc) => {
          const data = hotelDoc.data();
          setHotelId(hotelDoc.id);
          setPartnerId(data.uid);
        });

        const hotelDoc = hotelSnapshot.docs[0];
        const hotelData = hotelDoc.data();
        const hotelId = hotelDoc.id;
        const partnerId = hotelData.uid;

        const roomsQuery = query(
          collection(db, 'rooms'),
          where('id_hotel', '==', hotelId)
        );
        const roomsSnapshot = await getDocs(roomsQuery);

        if (roomsSnapshot.empty) {
          console.error("No rooms found for the specified hotel.");
          setLoading(false);
          return;
        }

        const roomData = [];
        roomsSnapshot.forEach((roomDoc) => {
          roomData.push(roomDoc.data());
        });

        setRooms(roomData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms: ", error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, [route.params.city, route.params.name]);

  const handleRoomSelection = (item) => {
    setSelectedRoom(item);
  };

  const handleInfoPress = (images) => {
    setModalImages(images);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      {loading ? (
        <ActivityIndicator size="large" color="#003580" style={styles.loadingIndicator} />
      ) : rooms.length > 0 ? (
          rooms.map((item, index) => (
            <Pressable
              key={index}
              style={styles.roomContainer}
            >
              <View style={styles.roomHeader}>
                <Text style={styles.roomName}>{item.name}</Text>
                <AntDesign name="infocirlceo" size={24} color="#007FFF" onPress={() => handleInfoPress(item.images)} />
              </View>
              <Text style={styles.roomInfo}>Number of bed: {item.bed}</Text>
              <Text style={styles.roomInfoGreen}>Size of room: {item.size} m²</Text>
              <View style={styles.roomPriceContainer}>
                <Text style={styles.roomOldPrice}>{item.oldPrice * route.params.nights}$</Text>
                <Text style={styles.roomNewPrice}>{item.newPrice * route.params.nights}$</Text>
              </View>
              <Amenities amenities={item.amenities} />
              <Pressable
                onPress={() => handleRoomSelection(item)}
                style={[
                  styles.selectButton,
                  selectedRoom && selectedRoom.name === item.name && styles.selectedButton,
                ]}
              >
                <Text style={styles.selectButtonText}>
                  {selectedRoom && selectedRoom.name === item.name ? "SELECTED" : "SELECT"}
                </Text>
                {selectedRoom && selectedRoom.name === item.name && (
                  <Entypo
                    onPress={() => setSelectedRoom(null)}
                    name="circle-with-cross"
                    size={24}
                    color="red"
                  />
                )}
              </Pressable>
            </Pressable>
          ))
        ) : (
          <Text style={styles.noRoomsText}>No rooms available</Text>
        )}
      </ScrollView>
      {selectedRoom && (
        <Pressable
          onPress={() =>
            navigation.navigate("User", {
              userId: route.params.userId,
              partnerId: partnerId,
              hotelId: hotelId,
              rooms: selectedRoom.name,
              oldPrice: selectedRoom.oldPrice,
              newPrice: selectedRoom.newPrice,
              name: route.params.name,
              address: route.params.address,
              children: route.params.children,
              adults: route.params.adults,
              rating: route.params.rating,
              startDate: route.params.startDate,
              nights: route.params.nights,
              endDate: route.params.endDate,
            })
          }
          style={styles.reserveButton}
        >
          <Text style={styles.reserveButtonText}>Reserve</Text>
        </Pressable>
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView horizontal>
              {modalImages && modalImages.map((image, index) => (
                <Image key={index} style={styles.modalImage} source={{ uri: image }} />
              ))}
            </ScrollView>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  roomContainer: {
    margin: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  roomHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  roomName: {
    color: "#007FFF",
    fontSize: 17,
    fontWeight: "500",
  },
  roomInfo: {
    marginTop: 3,
    fontSize: 16,
  },
  roomInfoGreen: {
    marginTop: 3,
    color: "green",
    fontSize: 16,
  },
  roomPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  roomOldPrice: {
    fontSize: 18,
    color: "red",
    textDecorationLine: "line-through",
  },
  roomNewPrice: {
    fontSize: 18,
    marginLeft: 10,
  },
  selectButton: {
    borderWidth: 2,
    borderColor: "#007FFF",
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  selectedButton: {
    backgroundColor: "#F0F8FF",
    borderColor: "#318CE7",
  },
  selectButtonText: {
    fontSize: 16,
    color: "#007FFF",
    fontWeight: "700",
  },
  reserveButton: {
    backgroundColor: "#007FFF",
    paddingVertical: 12,
    borderRadius: 3,
    marginHorizontal: 15,
    marginBottom: 30,
    alignItems: "center",
  },
  reserveButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  noRoomsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
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

export default RoomsScreen;
