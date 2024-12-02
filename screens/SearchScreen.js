import { StyleSheet, Text, View, SafeAreaView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import SearchResults from "../components/SearchResults";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const SearchScreen = () => {
  const [input, setInput] = useState("");
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const colRef = collection(db, "destinations1");
      const docsSnap = await getDocs(colRef);
      const places = [];
      docsSnap.forEach((doc) => {
        places.push(doc.data());
      });
      setPlaces(places);
    };

    fetchPlaces();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.searchContainer}>
        <TextInput
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="Enter Your Destination"
        />
        <Feather name="search" size={22} color="black" />
      </View>
      <SearchResults data={places} input={input} setInput={setInput} />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
    margin: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#FFC72C",
    borderWidth: 4,
    borderRadius: 10,
  },
});
