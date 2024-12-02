import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, Pressable, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const navigation = useNavigation();

  const register = () => {
    if (email === "" || password === "" || phone === "" || firstName === "" || lastName === "") {
      Alert.alert("Invalid Details", "Please enter all the credentials", [{ text: "OK" }]);
      return;
    }

    if (phone.length !== 10) {
      Alert.alert("Invalid Phone Number", "Phone number must be 10 digits long", [{ text: "OK" }]);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        const uid = user.uid;

        setDoc(doc(db, "users", uid), {
          firstName: firstName,
          lastName: lastName,
          email: user.email,
          phone: phone,
        }).then(() => {
          Alert.alert("Registration Successful", "Your account has been created successfully", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]);
        });
      })
      .catch((error) => {
        handleAuthError(error.code);
      });
  };

  const handleAuthError = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        Alert.alert("Registration Error", "The email address is already in use by another account.", [{ text: "OK" }]);
        break;
      case 'auth/invalid-email':
        Alert.alert("Registration Error", "The email address is not valid.", [{ text: "OK" }]);
        break;
      case 'auth/operation-not-allowed':
        Alert.alert("Registration Error", "Email/password accounts are not enabled.", [{ text: "OK" }]);
        break;
      case 'auth/weak-password':
        Alert.alert("Registration Error", "The password is too weak.", [{ text: "OK" }]);
        break;
      case 'auth/missing-email':
        Alert.alert("Registration Error", "The email field is missing.", [{ text: "OK" }]);
        break;
      default:
        Alert.alert("Registration Error", "An unknown error occurred. Please try again.", [{ text: "OK" }]);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Sign Up</Text>
          <Text style={styles.headerSubtitle}>Sign Up to Your Account</Text>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <AntDesign name="user" size={24} color="black" style={styles.icon} />
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              style={styles.textInput}
              placeholder="Enter your first name"
              placeholderTextColor="gray"
            />
          </View>
          <View style={styles.inputContainer}>
            <AntDesign name="user" size={24} color="black" style={styles.icon} />
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              style={styles.textInput}
              placeholder="Enter your last name"
              placeholderTextColor="gray"
            />
          </View>
          <View style={styles.inputContainer}>
            <Feather name="phone" size={24} color="black" style={{ marginRight: 15, margin: 10 }} />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.textInput}
              placeholder="Enter your phone number"
              placeholderTextColor="gray"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={30} color="black" style={styles.icon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor="gray"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={30} color="black" style={styles.icon} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
              style={styles.textInput}
              placeholder="Enter your password"
              placeholderTextColor="gray"
            />
            <Pressable onPress={() => setHidePassword(!hidePassword)}>
              <AntDesign name={hidePassword ? "eyeo" : "eye"} size={24} color="black" />
            </Pressable>
          </View>
        </View>

        <Pressable onPress={register} style={styles.buttonLogin}>
          <Text style={styles.buttonLoginText}>Register</Text>
        </Pressable>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.signupText}>Sign in</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
  },
  innerContainer: {
    width: "100%",
    alignItems: "center",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  headerTitle: {
    color: "#003580",
    fontSize: 17,
    fontWeight: "700",
  },
  headerSubtitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "500",
  },
  inputWrapper: {
    marginTop: 50,
    width: "100%",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
  },
  icon: {
    marginRight: 15,
    margin: 7,
  },
  buttonLogin: {
    width: 300,
    backgroundColor: "#003580",
    padding: 15,
    borderRadius: 7,
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLoginText: {
    textAlign: "center",
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    color: "gray",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  footerText: {
    color: "gray",
  },
  signupText: {
    color: "black",
    fontSize: 17,
    marginLeft: 5,
  },
});
