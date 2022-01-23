import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native'
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, limit, getDoc, doc, orderBy } from "firebase/firestore";
import Firebase from '../../database/firebase';
import UserComponent from '../UserComponent';

export default function Feed({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const Item = (item) => {
    if (item.item.downloadURL) {
      return <View style={styles.item} >
        <UserComponent uid={item.item.uid} />
        <Image
          style={{ height: 300 }}
          source={{ uri: item.item.downloadURL }}
        />
        <Text style={styles.itemTitle} >{item.item.title}</Text>
        <Text style={styles.itemDescription} >{item.item.content}</Text>
      </View>;
    }
    return <Pressable style={styles.item} onPress={() => navigation.navigate("EventDetails", { eventId: item.item.id })} >
      <UserComponent uid={item.item.organizationId} />
      <Text style={styles.itemTitle}>{item.item.title}</Text>
      <Text style={styles.itemDescription}>{item.item.description}</Text>
    </Pressable>
  };

  useEffect(async () => {
    const db = getFirestore();
    const postsSnapshot = await getDocs(query(collection(db, "posts"), orderBy('creation'), limit(5)));
    const eventsSnapshot = await getDocs(query(collection(db, "events")));
    setPosts([
      ...postsSnapshot.docs.map((e) => ({ id: e.id, ...e.data() })),
      ...eventsSnapshot.docs.map((e) => ({ id: e.id, ...e.data() }))
    ]);
    setIsLoading(false);
  }, []);

  if (isLoading) return <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }} ><Text>Loading...</Text></View>;

  return <View style={styles.body} >
    <View style={styles.appBar} >
      <Text style={styles.title} >Feed</Text>
    </View>
    <FlatList
      data={posts}
      renderItem={Item}
      keyExtractor={item => item.id}
    />
  </View>;
}

const styles = StyleSheet.create({
  body: {
    marginTop: 36
  },
  appBar: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#c4c4c4"
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingTop: 4
  },
  itemDescription: {
    paddingHorizontal: 12,
  },
});