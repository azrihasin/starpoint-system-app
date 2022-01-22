import { View, FlatList, Text } from "react-native";
import { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import QRCode from "react-native-qrcode-svg";

export default EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const Item = (item) => {
        return <View>
            <QRCode value={item.item.id} />
            <Text style={{color: 'black'}} >{item.item.title}</Text>
        </View>
    };

    useEffect(async () => {
        const db = getFirestore();
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("organizationId", "==", getAuth().currentUser.uid));
        const querySnapshot = await getDocs(q);
        setEvents(querySnapshot.docs.map((e) => ({ id: e.id, ...e.data() })));
        setIsLoading(false);
        console.log(events);
    }, []);

    if (isLoading) return <View style={{ flex: 1 }} ><Text>Loading...</Text></View>

    return <View style={{height: 200}} >
        <FlatList
            data={events}
            renderItem={Item}
            keyExtractor={item => item.id}
        />
    </View>;
};