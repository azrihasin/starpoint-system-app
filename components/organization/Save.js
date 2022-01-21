import { NavigationContainer } from '@react-navigation/native';
import React,{useState} from 'react'
import { StyleSheet, TextInput, View, Image, Button } from 'react-native'
import Firebase from '../../database/firebase';
require("firebase/firestore")
import { serverTimestamp } from "firebase/firestore";
// require("firebase/firebase-storage")

export default function Save(props) {
    const [caption, setCaption] = useState("")

    const imagePath = `post/${Firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;

    const uploadImage = async() =>{
        const uri =  props.route.params.image;
        const response = await fetch(uri);
        const blob = await response.blob();

        const task = Firebase.storage().ref().child(imagePath).put(blob);
    
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = snapshot => {
            task.snapshot.ref.getDownloadURL().then((snapshot)=>{
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted)
    }

    const savePostData = (downloadURL) => {
        // Firebase.firestore()
        // .collection('posts')
        // .doc(Firebase.auth().currentUser.uid)
        // .collection("userPosts")
        // .add({
        //     downloadURL,
        //     caption,
        //     creation: serverTimestamp()
        // }).then((function(){
        //     props.navigation.popToTop()
        // }))

        Firebase.firestore()
        .collection('feed')
        .add({
            downloadURL,
            caption,
            creation: serverTimestamp(),
            uid:Firebase.auth().currentUser.uid 
        }).then((function(){
            props.navigation.popToTop()
        }))
    }

    return (
        <View style={{flex:1}}>
            <Image source={{uri: props.route.params.image}}/>
            <TextInput 
            placeholder="Write a Caption . . ."
            onChangeText={(caption)=>setCaption(caption)}
            />
            <Button title="Save" onPress={()=> uploadImage()}/>
        </View>
    )
}
