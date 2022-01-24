import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ScrollView,
} from 'react-native'
import { useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  limit,
  getDoc,
  doc,
  orderBy,
} from 'firebase/firestore'
import Firebase from '../database/firebase'
import UserComponent from './UserComponent'
import { Avatar, Card } from 'react-native-elements'

export default function Feed({ navigation }) {
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  const Item = (item) => {
    if (item.item.downloadURL) {
      return (
        <Card
          containerStyle={{
            borderRadius: 15,
            elevation: 0,
            backgroundColor: 'white',
            borderColor: 'white',
          }}
        >
          <View style={styles.eventImage}>
            <UserComponent uid={item.item.uid} />
            <Text style={styles.itemTitle}>{item.item.title}</Text>
            <Text style={styles.itemDescription}>{item.item.content}</Text>
            <View style={styles.eventContent}>
              <Text>{item.content}</Text>
            </View>
            <Image
              style={styles.image}
              source={{ uri: item.item.downloadURL }}
            />
          </View>
        </Card>
      )
    }
    return (
      <Card
        containerStyle={{
          borderRadius: 15,
          elevation: 0,
          backgroundColor: 'white',
          borderColor: 'white',
        }}
      >
        <Pressable
          style={styles.item}
          onPress={() =>
            navigation.navigate('EventDetails', { eventId: item.item.id })
          }
        >
          <UserComponent uid={item.item.organizationId} />
          <Text style={styles.itemTitle}>{item.item.title}</Text>
          <Text style={styles.itemDescription}>{item.item.description}</Text>
        </Pressable>
      </Card>
    )
  }

  async function fetchFeed() {
    const db = getFirestore()
    const postsSnapshot = await getDocs(
      query(collection(db, 'posts'), orderBy('creation', 'desc'), limit(15)),
    )
    const eventsSnapshot = await getDocs(query(collection(db, 'events')))
    setPosts([
      ...postsSnapshot.docs.map((e) => ({ id: e.id, ...e.data() })),
      ...eventsSnapshot.docs.map((e) => ({ id: e.id, ...e.data() })),
    ])
    setIsLoading(false)
  }

  useEffect(async () => {
    navigation.addListener('focus', async () => {
      fetchFeed();
    });
    fetchFeed();
  }, [])

  if (isLoading)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </View>
    )

  return (
    <View style={styles.body}>
      <View style={styles.appBar}>
        <Text style={styles.title}>Feed</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={Item}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginTop: 36,
    marginBottom: 20,
  },
  appBar: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c4c4c4',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingTop: 4,
    marginBottom: 10,
  },
  itemDescription: {
    paddingHorizontal: 12,
  },

  //FOR EACH POST CARD

  eventTitle: {
    margin: 14,
  },

  eventContent: {
    margin: 10,
  },

  eventImage: {
    flex: 1 / 3,
  },

  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    borderRadius: 15,
  },

  postHeader: {
    flexDirection: 'row',
  },
})
