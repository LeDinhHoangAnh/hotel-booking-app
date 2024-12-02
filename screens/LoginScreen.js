import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, TextInput, Pressable, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Ionicons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState("");

  const login = () => {
    if (email === "" || password === "") {
      Alert.alert("Invalid Details", "Please enter all the credentials", [{ text: "OK" }]);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserId(user.uid);
        setErrorMessage(''); // Clear any previous error messages
      })
      .catch((error) => {
        handleFirebaseError(error);
      });
  };

  const handleFirebaseError = (error) => {
    let message = "An error occurred. Please try again.";
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Invalid email format.';
        break;
      case 'auth/user-disabled':
        message = 'This user has been disabled.';
        break;
      case 'auth/user-not-found':
        message = 'No user found with this email.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password.';
        break;
    }
    setErrorMessage(message);
    Alert.alert("Login Error", message, [{ text: "OK" }]);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        navigation.replace("Main", {
          uid: userId
        });
      }
    });

    return unsubscribe;
  }, [navigation, userId]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Sign In</Text>
          <Text style={styles.headerSubtitle}>Sign In to Your Account</Text>
        </View>

        <View style={styles.inputWrapper}>
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

        <Pressable onPress={login} style={styles.buttonLogin}>
          <Text style={styles.buttonLoginText}>Login</Text>
        </Pressable>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={styles.signupText}>Sign up</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
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
