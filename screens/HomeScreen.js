import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Alert
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { Feather } from "@expo/vector-icons";
import DatePicker from "react-native-date-ranges";
import Modal, { BottomModal } from "react-native-modals";
import { ModalFooter } from "react-native-modals";
import { ModalButton } from "react-native-modals";
import { ModalTitle } from "react-native-modals";
import { SlideAnimation } from "react-native-modals";
import { ModalContent } from "react-native-modals";
import { auth, db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const today = new Date();
  const navigation = useNavigation();
  const [selectedDates, setSelectedDates] = useState();
  const route = useRoute();
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState({ userId: '', firstName: '', lastName: '', email: '', phone: '' });
  const [userData, setUserData] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "IStay",
      headerTitleStyle: styles.headerTitleStyle,
      headerStyle: styles.headerStyle,
      headerRight: () => (
        <Ionicons
          name="notifications-outline"
          size={24}
          color="white"
          style={styles.headerRightIcon}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile({"userId": userDoc.id,"firstName":data.firstName, "lastName":data.lastName, "email": data.email, "phone":data.phone});
            setUserData(data);
          } else {
            console.log('No such document!');
          }
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const customButton = (onConfirm) => {
    return (
      <Button
        onPress={onConfirm}
        style={styles.customButton}
        primary
        title="Submit"
      />
    );
  };

  const searchPlaces = (city) => {
    if (!route.params?.input || !selectedDates || !city) {
      Alert.alert(
        "Invalid Details",
        "Please enter all the details",
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK" }
        ],
        { cancelable: false }
      );
      return;
    }

    if (route.params && selectedDates) {
      navigation.navigate("Hotels", {
        userId: userProfile.userId,
        rooms,
        adults,
        children,
        selectedDates,
        city
      });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header />

        <ScrollView>
          <View style={styles.searchContainer}>
            {/* Destination */}
            <Pressable
              onPress={() => navigation.navigate("Search")}
              style={styles.searchInput}
            >
              <Feather name="search" size={24} color="black" />
              <TextInput
                placeholderTextColor="black"
                placeholder={
                  route?.params?.input || "Enter Your Destination"
                }
                style={styles.textInput}
              />
            </Pressable>

            {/* Selected Dates */}
            <Pressable style={styles.datePickerInput}>
              <Feather name="calendar" size={24} color="black" />
              <DatePicker
                style={styles.datePicker}
                customStyles={styles.datePickerCustomStyles}
                selectedBgColor="#0047AB"
                customButton={customButton}
                onConfirm={(startDate, endDate) =>
                  setSelectedDates(startDate, endDate)
                }
                allowFontScaling={false}
                placeholder={"Select Your Dates"}
                mode={"range"}
              />
            </Pressable>

            {/* Rooms and Guests */}
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}
              style={styles.roomsInput}
            >
              <Ionicons name="person-outline" size={24} color="black" />
              <TextInput
                placeholderTextColor="black"
                placeholder={` ${rooms} room • ${adults} adults `}
                style={styles.textInput}
              />
            </Pressable>

            {/* Search Button */}
            <Pressable
              onPress={() => searchPlaces(route?.params?.input)}
              style={styles.searchButton}
            >
              <Text style={styles.searchButtonText}>
                Search
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <BottomModal
        swipeThreshold={200}
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        footer={
          <ModalFooter>
            <ModalButton
              text="Apply"
              style={styles.modalButton}
              onPress={() => setModalVisible(!modalVisible)}
            />
          </ModalFooter>
        }
        modalTitle={<ModalTitle title="Select rooms and guests" />}
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
          <View style={styles.modalRow}>
            <Text style={styles.modalText}>Rooms</Text>
            <Pressable style={styles.modalCounter}>
              <Pressable
                onPress={() => setRooms(Math.max(1, rooms - 1))}
                style={styles.modalCounterButton}
              >
                <Text style={styles.modalCounterButtonText}>-</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.modalCounterText}>{rooms}</Text>
              </Pressable>
              <Pressable
                onPress={() => setRooms((c) => c + 1)}
                style={styles.modalCounterButton}
              >
                <Text style={styles.modalCounterButtonText}>+</Text>
              </Pressable>
            </Pressable>
          </View>

          <View style={styles.modalRow}>
            <Text style={styles.modalText}>Adults</Text>
            <Pressable style={styles.modalCounter}>
              <Pressable
                onPress={() => setAdults(Math.max(1, adults - 1))}
                style={styles.modalCounterButton}
              >
                <Text style={styles.modalCounterButtonText}>-</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.modalCounterText}>{adults}</Text>
              </Pressable>
              <Pressable
                onPress={() => setAdults((c) => c + 1)}
                style={styles.modalCounterButton}
              >
                <Text style={styles.modalCounterButtonText}>+</Text>
              </Pressable>
            </Pressable>
          </View>

          <View style={styles.modalRow}>
            {/* <Text style={styles.modalText}>Children</Text>
            <Pressable style={styles.modalCounter}>
              <Pressable
                onPress={() => setChildren(Math.max(0, children - 1))}
                style={styles.modalCounterButton}
              >
                <Text style={styles.modalCounterButtonText}>-</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.modalCounterText}>{children}</Text>
              </Pressable>
              <Pressable
                onPress={() => setChildren((c) => c + 1)}
                style={styles.modalCounterButton}
              >
                <Text style={styles.modalCounterButtonText}>+</Text>
              </Pressable>
            </Pressable> */}
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  headerRightIcon: {
    marginRight: 12,
  },
  customButton: {
    container: { width: "80%", marginHorizontal: "3%" },
    text: { fontSize: 20 },
  },
  searchContainer: {
    margin: 20,
    borderColor: "#FFC72C",
    borderWidth: 3,
    borderRadius: 6,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    borderColor: "#FFC72C",
    borderWidth: 2,
    paddingVertical: 15,
  },
  datePickerInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    borderColor: "#FFC72C",
    borderWidth: 2,
    paddingVertical: 15,
  },
  datePicker: {
    width: 350,
    height: 30,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "transparent",
  },
  datePickerCustomStyles: {
    placeholderText: {
      fontSize: 15,
      flexDirection: "row",
      alignItems: "center",
      marginRight: "auto",
    },
    headerStyle: {
      backgroundColor: "#003580",
    },
    contentText: {
      fontSize: 15,
      flexDirection: "row",
      alignItems: "center",
      marginRight: "auto",
    },
  },
  roomsInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    borderColor: "#FFC72C",
    borderWidth: 2,
    paddingVertical: 15,
  },
  textInput: {
    flex: 1,
  },
  searchButton: {
    paddingHorizontal: 10,
    borderColor: "#FFC72C",
    borderWidth: 2,
    paddingVertical: 15,
    backgroundColor: "#2a52be",
  },
  searchButtonText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
    color: "white",
  },
  modalButton: {
    marginBottom: 20,
    color: "white",
    backgroundColor: "#003580",
  },
  modalContent: {
    width: "100%",
    height: 310,
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalCounter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalCounterButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderColor: "#BEBEBE",
    backgroundColor: "#E0E0E0",
  },
  modalCounterButtonText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    paddingHorizontal: 6,
  },
  modalCounterText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
    paddingHorizontal: 6,
  },
});

export default HomeScreen;
