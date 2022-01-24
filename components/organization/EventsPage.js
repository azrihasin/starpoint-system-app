import { View, FlatList, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import QRCode from "react-native-qrcode-svg";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default EventsPage = ({ navigation }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const Item = (item) => {
        return <Pressable
            onPress={() => navigation.navigate("EventDetails", { eventId: item.item.id })}
            style={styles.item}
        >
            <QRCode size={48} value={item.item.id} />
            <Text style={styles.itemTitle} >{item.item.title}</Text>
        </Pressable>
    };

    async function fetchEvents(){
        const db = getFirestore();
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("organizationId", "==", getAuth().currentUser.uid));
        const querySnapshot = await getDocs(q);
        setEvents(querySnapshot.docs.map((e) => ({ id: e.id, ...e.data() })));
        setIsLoading(false);
        console.log(events);
    }

    useEffect(async () => {
        navigation.addListener('focus', ()=>{
            fetchEvents();
        });
    }, []);

    if (isLoading) return <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }} ><Text>Loading...</Text></View>;

    return <View style={styles.body} >
        <View style={styles.appBar} >
            <Text style={styles.title} >Events</Text>
            <Pressable onPress={() => navigation.navigate("CreateEvent")} style={styles.iconButton} >
                <MaterialCommunityIcons
                    name="plus"
                    size={36}
                    color="white"
                />
            </Pressable>
        </View>
        <FlatList
            data={events}
            renderItem={Item}
            keyExtractor={item => item.id}
        />
    </View>;
};

const styles = StyleSheet.create({
    body: {
        marginTop: 36
    },
    appBar: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 16
    },
    iconButton: {
        marginRight:20,
        marginTop:18,
        height:45,
        width:45,
        backgroundColor: 'black',
        borderRadius: 6,
        padding: 4
    },
    title: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    item: {
        marginHorizontal: 16,
        flexDirection: 'row',
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 0.5,
    },
    itemTitle: {
        color: 'black',
        fontSize: 18,
        fontWeight: "600",
        paddingLeft: 12
    }
});