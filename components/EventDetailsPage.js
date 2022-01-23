import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, getDocs, query, where, addDoc, collection } from "firebase/firestore";
import QRCode from "react-native-qrcode-svg";
import User from "../User";
import UserComponent from "./UserComponent";

const Item = ({ label, children }) => {
    return <View style={styles.item} >
        <Text style={styles.itemLabel} >{label}</Text>
        <Text>{children}</Text>
    </View>
};

export default EventDetailsPage = ({ route, navigation }) => {
    const { eventId, showJoinButton } = route.params;

    const [isLoading, setIsLoading] = useState(true);
    const [event, setEvent] = useState(null);
    const [joined, setJoined] = useState(false);

    const join = async () => {
        const db = getFirestore();
        const docRef = await addDoc(collection(db, "history"), {
            eventId: eventId,
            eventTitle: event.title,
            starPoints: event.starPoints,
            userId: User.id,
            createdAt: Date.now()
        });
        setJoined(true);
    };

    useEffect(async () => {
        const db = getFirestore();
        const ref = doc(db, "events", eventId);
        const result = await getDoc(ref);
        
        if (result.exists) {
            setEvent(result.data());
            const historyRef = collection(db, "history");
            const q = query(historyRef, where("userId", "==", User.id), where("eventId", "==", eventId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setJoined(true);
            }
        }
        setIsLoading(false);
    }, []);

    if (isLoading) return <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }} >
        <Text>Loading...</Text>
    </View>;

    if (!event) {
        return <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}} >
            <Text style={{paddingBottom: 16, fontSize: 18}} >No event found</Text>
            <Button title="Go back" onPress={() => navigation.goBack()} />
        </View>
    }

    return <View style={styles.body} >
        <UserComponent uid={event.organizationId} />
        {User.role === "organization" && <View style={{ justifyContent: 'center', alignItems: "center" }} >
            <QRCode size={256} value={event.id} />
        </View>}
        <Item label="Title" >{event.title}</Item>
        <Item label="Description" >{event.description}</Item>
        <Item label="Star Points" >{event.starPoints.toString()}</Item>
        {(User.role === "student" && showJoinButton) && (joined ?
            <Text style={styles.item} >You joined this event already</Text>
            : <View style={{paddingHorizontal: 16}} ><Button title="Join" onPress={join} /></View>)}
    </View>;
};

const styles = StyleSheet.create({
    body: {
        marginTop: 16
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        paddingLeft: 16
    },
    item: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    itemLabel: {
        fontWeight: "700",
    },
    joinButton: {
        width: "100%",
        backgroundColor: 'blue',
        color: 'white'
    }
});