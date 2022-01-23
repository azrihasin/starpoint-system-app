import { getFirestore, getDoc, doc } from 'firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';

export default function UserComponent({ uid }) {
    const [name, setName] = useState("User");

    useEffect(async () => {
        const db = getFirestore();
        const result = await getDoc(doc(db, "users", uid));
        setName(result.data().name);
    }, []);

    return <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4
    }} >
        <MaterialCommunityIcons
            name="account-circle"
            color="gray"
            size={40}
        />
        <Text style={{ paddingLeft: 6 }} >{name}</Text>
    </View>;
}