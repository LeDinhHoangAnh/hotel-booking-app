import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { BottomModal } from "react-native-modals";
import { ModalFooter } from "react-native-modals";
import { SlideAnimation } from "react-native-modals";
import { ModalTitle } from "react-native-modals";
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from "@expo/vector-icons";
import { ModalContent } from "react-native-modals";
import { collection, getDocs, query, where, doc, collectionGroup } from "firebase/firestore";
import { db } from "../firebase";
import HotelCard from "../components/HotelCard";

const HotelsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [hotelCount, setHotelCount] = useState(0);
  const [hotelId, setHotelId] = useState(null);
  const [partnerId, setPartnerId] = useState(null);

  const filters = [
    { id: "0", filter: "cost:Low to High" },
    { id: "1", filter: "cost:High to Low" },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Popular Places",
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
    const fetchHotels = async () => {
      setLoading(true);

      const q = query(collection(db, "destinations1"), where("city", "==", route.params.city));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];
      const hotelsCollection = query(
        collection(db, 'hotels'),
        where('id_city', '==', doc.id),
        where('status', '==' ,1)
      );
      const hotelsSnapshot = await getDocs(hotelsCollection);

      if (hotelsSnapshot.empty) {
        console.error("No matching city found.");
        setLoading(false);
        return;
      }

      const hotelData = [];
      const hotelIds = [];
      const partnerIds = [];
      hotelsSnapshot.forEach((hotelDoc) => {
        const data = hotelDoc.data();
        hotelData.push(hotelDoc.data());
        hotelIds.push(hotelDoc.id);
        partnerIds.push(data.uid);
      });

      setHotels(hotelData);
      setSortedData(hotelData);
      setHotelCount(hotelData.length);
      setHotelId(hotelIds); 
      setPartnerId(partnerIds);
      setLoading(false);
    };

    fetchHotels();
  }, [route.params.city]);

  const compare = (a, b) => (a.average > b.average ? -1 : a.average < b.average? 1 : 0);
  const comparison = (a, b) => (a.average< b.average ? -1 : a.average > b.average? 1 : 0);

  const applyFilter = (filter) => {
    setModalVisible(false);
    const sorted = [...hotels];
    if (filter === "cost:High to Low") {
      sorted.sort(compare);
    } else if (filter === "cost:Low to High") {
      sorted.sort(comparison);
    }
    setSortedData(sorted);
  };

  return (
    <View>
      <Pressable style={styles.sortFilterContainer}>
        <Pressable onPress={() => setModalVisible(!modalVisible)} style={styles.sortButton}>
          <Octicons name="arrow-switch" size={22} color="gray" />
          <Text style={styles.buttonText}>Sort</Text>
        </Pressable>

        <Pressable style={styles.filterButton}>
          <Ionicons name="filter" size={22} color="gray" />
          <Text style={styles.buttonText}>Filter</Text>
        </Pressable>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color="#003580" style={styles.loadingIndicator} />
      ) : hotels.length === 0 ? (
        <Text>No hotels found for {route.params.city}</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {sortedData.map((hotel, index) => (
            <HotelCard
              key={index}
              partnerId = {route.params.partnerId}
              photos = {route.params.images}
              userId={route.params.userId}
              rooms={route.params.rooms}
              children={route.params.children}
              adults={route.params.adults}
              selectedDates={route.params.selectedDates}
              hotel={hotel}
              availableRooms={hotel.rooms}
              city={route.params.city}
              averagePrice={hotel.average}
            />
          ))}
        </ScrollView>
      )}

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        footer={
          <ModalFooter>
            <Pressable onPress={() => applyFilter(selectedFilter)} style={styles.applyButton}>
              <Text>Apply</Text>
            </Pressable>
          </ModalFooter>
        }
        modalTitle={<ModalTitle title="Sort and Filter" />}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={styles.modalContent}>
          <View style={styles.modalInnerContainer}>
            <View style={styles.sortSection}>
              <Text style={styles.sortText}>Sort </Text>
            </View>

            <View style={styles.filterSection}>
              {filters.map((item, index) => (
                <Pressable
                  onPress={() => setSelectedFilter(item.filter)}
                  style={styles.filterOption}
                  key={index}
                >
                  {selectedFilter === item.filter ? (
                    <FontAwesome name="circle" size={18} color="green" />
                  ) : (
                    <Entypo name="circle" size={18} color="black" />
                  )}
                  <Text style={styles.filterText}>{item.filter}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </View>
  );
};

export default HotelsScreen;

const styles = StyleSheet.create({
  sortFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    padding: 12,
    backgroundColor: "white",
  },
  sortButton: { flexDirection: "row", alignItems: "center" },
  filterButton: { flexDirection: "row", alignItems: "center" },
  buttonText: { fontSize: 15, fontWeight: "500", marginLeft: 8 },
  scrollView: { backgroundColor: "#F5F5F5" },
  applyButton: {
    paddingRight: 10,
    marginLeft: "auto",
    marginRight: "auto",
    marginVertical: 10,
    marginBottom: 30,
  },
  modalContent: { width: "100%", height: 280 },
  modalInnerContainer: { flexDirection: "row" },
  sortSection: {
    marginVertical: 10,
    flex: 2,
    height: 280,
    borderRightWidth: 1,
    borderColor: "#E0E0E0",
  },
  sortText: { textAlign: "center" },
  filterSection: { flex: 3, margin: 10 },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  filterText: { fontSize: 16, fontWeight: "500", marginLeft: 6 },
});
