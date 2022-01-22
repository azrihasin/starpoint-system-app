import Firebase from '../../database/firebase'
import {
  //   CLEAR_DATA,
  //   USERS_DATA_STATE_CHANGE,
  //   USERS_LIKES_STATE_CHANGE,
  //   USERS_POSTS_STATE_CHANGE,
  //   USER_CHATS_STATE_CHANGE,
  //   USER_FOLLOWING_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
} from '../constants/index'

export function fetchUser() {
  return (dispatch) => {
    // console.log('UUID' + Firebase.auth().currentUser.uid)

    Firebase.firestore()
      .collection('users')
      .doc(Firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          // console.log(snapshot)
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
        } else {
          console.log('does not exist')
        }
      })
  }
}

export function fetchUserPosts() {
  return (dispatch) => {
    // Firebase.firestore()
    //   .collection('posts')
    //   .doc(Firebase.auth().currentUser.uid)
    //   .collection("userPosts")
    //   .orderBy("creation","asc")
    //   .get()
    //   .then((snapshot) => {
    //     let posts = snapshot.docs.map(doc => {
    //       const data = doc.data();
    //       const id = doc.id;
    //       return{id, ...data}
    //     })
    //     // console.log(posts)
    //     dispatch({ type: USER_POSTS_STATE_CHANGE, posts })
    //   })

    Firebase.firestore()
      .collection('posts')
      .where('uid', '==', `${Firebase.auth().currentUser.uid}`)
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data()
          const id = doc.id
          return { id, ...data }
        })
        // console.log(posts)
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts })
      })
  }
}

export function fetchUserFollowing() {
  return (dispatch) => {
    Firebase.firestore()
      .collection('following')
      .doc(Firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id
          return id
        })
        // console.log(posts)
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following })
      })
  }
}
