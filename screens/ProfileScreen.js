import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth,db } from '../firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const ProfileScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState('');
  const [userProfile, setUserProfile] = useState({userId: '',firstName: '', lastName: '', email: '', phone: ''})
  const navigation = useNavigation();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUserEmail(user.email);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile({"userId": userDoc.id,"firstName":data.firstName, "lastName":data.lastName, "email": data.email, "phone":data.phone})
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

  
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => {
        Alert.alert('Error', error.message, [{ text: 'OK' }]);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.profileText}>First Name: {userProfile.firstName}</Text>
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.profileText}>Last Name: {userProfile.lastName}</Text>
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.profileText}>Phone number: {userProfile.phone}</Text>
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.profileText}>Email: {userProfile.email}</Text>
      </View>
      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    marginBottom: 30,
  },
  profileText: {
    fontSize: 18,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#003580',
    padding: 15,
    borderRadius: 7,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
