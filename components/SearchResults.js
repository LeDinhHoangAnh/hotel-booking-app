import { StyleSheet, Text, View, FlatList, Pressable, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const SearchResults = ({ data, input, setInput }) => {
    const navigation = useNavigation();
    return (
        <View style={{padding:10}}>
       <FlatList data={data} renderItem={({item}) => {
           if(item.city.toLowerCase().includes(input.toLowerCase())){
               if(input === ""){
                   return null;
               }
               return (
                   <Pressable onPress={() => {
                       setInput(item.city);
                       navigation.navigate("Home",{
                           input:item.city,
                           cityId:item.uid
                       })

                   }} style={{flexDirection:"row",alignItems:"center",marginVertical:10}}>
                       <View>
                           <Image style={{width:70,height:70}} source={{uri:item.cityImage}}/>
                       </View>
                       <View style={{marginLeft:10}}>
                           <Text style={{fontSize:15,fontWeight:"500"}}>{item.city}</Text>
                           <Text style={{marginVertical:4}}>{item.cityId}</Text>
                           {/* <Text style={{color:"gray",fontSize:15}}>{item.city.hotels.length} Properties</Text> */}
                       </View>
                   </Pressable>
               )
           }
       }}/>
    </View>
    );
};

export default SearchResults;

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    image: {
        width: 70,
        height: 70,
    },
    textContainer: {
        marginLeft: 10,
    },
    placeText: {
        fontSize: 15,
        fontWeight: "500",
    },
    descriptionText: {
        marginVertical: 4,
    },
    propertiesText: {
        color: "gray",
        fontSize: 15,
    },
});
