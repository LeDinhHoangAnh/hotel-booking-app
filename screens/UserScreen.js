import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { collection, getDocs, query, where, getDoc, doc} from "firebase/firestore";
import { db,auth } from "../firebase";

const UserScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [roomId, setRoomId] = useState();
  const [userEmail, setUserEmail] = useState('');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState('');
  const [userProfile, setUserProfile] = useState({userId: '',firstName: '', lastName: '', email: '', phone: ''})

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "User Details",
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
    const fetchSelectedRoom = async () => {
      try {
        const roomsQuery = query(
          collection(db, 'rooms'),
          where('name', '==', route.params.rooms)
        );
        const roomsSnapshot = await getDocs(roomsQuery);

        if (!roomsSnapshot.empty) {
          const doc = roomsSnapshot.docs[0]; // Access the first document in the snapshot
          setRoomId(doc.id); // Set the document ID to state
        } else {
          console.log('No matching rooms found.');
        }
      } catch (error) {
        console.error('Error fetching selected room:', error);
      }
    };

    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUserEmail(user.email);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile({"userId": userDoc.id,"firstName":data.firstName, "lastName":data.lastName, "email": data.email, "phone":data.phone})
            setFirstName(userProfile.firstName);
            setLastName(userProfile.lastName);
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


    fetchSelectedRoom();
    fetchUserData();
  }, [route.params.rooms]);


  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const finalStep = () => {
    if ( !phoneNo) {
      Alert.alert(
        "Invalid Details",
        "Please enter all the fields",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
      return;
    }

    navigation.navigate("Confirmation", {
      userId: route.params.userId,
      partnerId: route.params.partnerId,
      hotelId: route.params.hotelId,
      roomId: roomId,
      rooms: route.params.rooms,
      oldPrice: route.params.oldPrice,
      newPrice: route.params.newPrice,
      name: route.params.name,
      address: route.params.address,
      children: route.params.children,
      adults: route.params.adults,
      rating: route.params.rating,
      startDate: route.params.startDate,
      nights: route.params.nights,
      // firstName: firstName,
      // lastName: lastName,
      endDate: route.params.endDate,
    });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text>First Name</Text>
          <TextInput
            value={userProfile.firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text>Last Name</Text>
          <TextInput
            value={userProfile.lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text>Email</Text>
          <TextInput
            value={userProfile.email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text>Phone no</Text>
          <TextInput
              value={phoneNo}
              onChangeText={setPhoneNo}
              style={styles.input}
              placeholderTextColor="gray"
              keyboardType="phone-pad"
              maxLength={10}
            />
        </View>
      </View>

      <Pressable style={styles.summaryContainer}>
        <View>
          <View style={styles.priceContainer}>
            <Text style={styles.oldPrice}>
              {route.params.oldPrice * route.params.nights}$
            </Text>
            <Text style={styles.newPrice}>
              {route.params.newPrice * route.params.nights}$
            </Text>
          </View>
          <Text>
            You Saved {route.params.oldPrice * route.params.nights - route.params.newPrice * route.params.nights}$
          </Text>
        </View>
        <Pressable onPress={finalStep} style={styles.finalStepButton}>
          <Text style={styles.finalStepText}>Final Step</Text>
        </Pressable>
      </Pressable>
    </>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: "column",
    marginBottom: 10,
  },
  input: {
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  summaryContainer: {
    backgroundColor: "white",
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    padding: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  oldPrice: {
    color: "red",
    fontSize: 20,
    textDecorationLine: "line-through",
  },
  newPrice: {
    fontSize: 20,
  },
  finalStepButton: {
    backgroundColor: "#007FFF",
    padding: 10,
    borderRadius: 5,
  },
  finalStepText: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
  },
});
