// src/components/StatusScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from "../firebase";
import { collection, onSnapshot } from 'firebase/firestore';

const SaveScreen = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const statusCollection = collection(db, 'status');

    const unsubscribe = onSnapshot(statusCollection, snapshot => {
      const statusList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStatuses(statusList);
      setLoading(false);
    }, error => {
      console.error("Error fetching statuses: ", error);
      setLoading(false);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'waiting';
      case 1:
        return 'accept';
      case 2:
        return 'reject';
      default:
        return 'unknown';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 0:
        return styles.waiting;
      case 1:
        return styles.accept;
      case 2:
        return styles.reject;
      default:
        return styles.default;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {statuses.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <Text style={styles.text}>{item.name}</Text>
          <Text style={[styles.status, getStatusStyle(item.status)]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 18,
    flex: 1,
  },
  status: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  waiting: {
    backgroundColor: 'yellow',
    color: 'black',
  },
  accept: {
    backgroundColor: 'green',
    color: 'white',
  },
  reject: {
    backgroundColor: 'red',
    color: 'white',
  },
  default: {
    backgroundColor: 'gray',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SaveScreen;
