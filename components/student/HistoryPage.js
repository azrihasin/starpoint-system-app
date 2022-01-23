import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import User from "../../User";

export default HistoryPage = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);

    const [events, setEvents] = useState(null);

    const Item = (item) => {
        const date = new Date(item.item.createdAt);
        return <Pressable
            onPress={() => navigation.navigate("EventDetails", { eventId: item.item.eventId })}
            style={styles.item}
        >
            <Text style={{ fontSize: 18, fontWeight: "600" }} >{item.item.eventTitle}</Text>
            <Text>Earned {item.item.starPoints} star points</Text>
            <Text>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</Text>
        </Pressable>
    };

    useEffect(async () => {
        const db = getFirestore();
        const historyRef = collection(db, "history");
        const q = query(historyRef, where("userId", "==", User.id));
        const querySnapshot = await getDocs(q);
        setEvents(querySnapshot.docs.map((e) => ({ id: e.id, ...e.data() })));
        setIsLoading(false);
    }, []);

    if (isLoading) return <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }} ><Text>Loading...</Text></View>;

    return <View style={styles.body} >
        <Text style={styles.title} >History</Text>
        {events.length > 0 ? <FlatList
            data={events}
            renderItem={Item}
            keyExtractor={item => item.id}
        /> : <View style={{ height: 500, alignItems: "center", justifyContent: 'center' }} >
            <Text>No history found</Text>
        </View>}
    </View>;
};

const styles = StyleSheet.create({
    body: {
        marginTop: 36
    },
    title: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 20,
        paddingHorizontal: 16
    },
    item: {
        marginHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
    },
});