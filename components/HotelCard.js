import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HotelCard = ({ hotel, rooms, children, adults, selectedDates, city, userId, partnerId }) => {
  const { width, height } = Dimensions.get('window');
  const navigation = useNavigation();

  const countNights = (startDateStr, endDateStr) => {
    const startDate = new Date(startDateStr.replace(/\//g, '-'));
    const endDate = new Date(endDateStr.replace(/\//g, '-'));
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format');
    }
    const differenceMs = endDate - startDate;
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
    return differenceDays;
  };

  const startDateStr = selectedDates.startDate;
  const endDateStr = selectedDates.endDate;
  const nights = countNights(startDateStr, endDateStr);

  return (
    <View>
      <Pressable
        onPress={() =>
          navigation.navigate('Info', {
            userId: userId,
            name: hotel.name,
            address: hotel.address,
            rating: hotel.rating,
            averagePrice: hotel.average,
            photos: hotel.images,
            availableRooms: hotel.rooms,
            payment: hotel.payment,
            adults: adults,
            children: children,
            nights: nights,
            rooms: rooms,
            city: city,
            selectedDates: selectedDates,
          })
        }
        style={{ margin: 15, flexDirection: 'row', backgroundColor: 'white' }}
      >
        <View>
          <Image
            style={{ height: height / 4, width: width - 280 }}
            source={{ uri: hotel.images.length > 0 ? hotel.images[0] : ''}}
          />
        </View>

        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ width: 400, color:'black'}}>{hotel.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 }}>
            <MaterialIcons name="stars" size={24} color="green" />
            <Text>{hotel.rating}</Text>
          </View>

          <Text style={{ width: 210, marginTop: 6, color: 'gray', fontWeight: 'bold' }}>
            {hotel.address.length > 50 ? hotel.address.substr(0, 50) : hotel.address}
          </Text>

          <Text style={{ marginTop: 4, fontSize: 15, fontWeight: '500' }}>
            Price for {nights} Night and {adults} adults
          </Text>
          <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: 'black', fontSize: 18 }}>{hotel.average * nights}$</Text>
            <Text style={{ fontSize: 15 }}>Payment:{hotel.payment}</Text>
          </View>

          <View style={{ marginTop: 6 }}>
            {/* <Text style={{ fontSize: 16, color: 'gray' }}>{hotel.rooms.length} rooms available</Text> */}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default HotelCard;

const styles = StyleSheet.create({});
