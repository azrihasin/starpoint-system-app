import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default EventDetailsPage = ({ route, navigation }) => {
    const { eventId } = route.params;

    console.log(eventId);
    const [isLoading, setIsLoading] = useState(true);
    const [event, setEvent] = useState(null);

    useEffect(async () => {
        console.log(eventId);
        const db = getFirestore();
        const ref = doc(db, "events", eventId);
        const result = await getDoc(ref);
        setEvent(result.data());
        setIsLoading(false);
    }, []);

    if (isLoading) return <View><Text>Loading...</Text></View>;

    return <View>
        <Text>event.title</Text>
    </View>;
};