import Firebase from '../../database/firebase'
import {
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  CLEAR_DATA
} from '../constants/index'

export function clearData(){
  return((dispatch)=>{
    dispatch({type: CLEAR_DATA})
  })

}
export function fetchUser() {
  return (dispatch) => {
    // console.log('UUID' + Firebase.auth().currentUser.uid)

    Firebase.firestore()
      .collection('users')
      .doc(Firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
        } else {
          console.log('does not exist')
        }
      })
  }
}

export function fetchUserPosts() {
  return (dispatch) => {
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
        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUsersData(following[i], true))
        }
      })
  }
}

export function fetchUsersData(uid, getPosts) {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid)
    if (!found) {
      Firebase.firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data()
            user.uid = snapshot.id

            dispatch({ type: USERS_DATA_STATE_CHANGE, user })
            dispatch(fetchUsersFollowingPosts(user.uid))
          }
        })
    }
  }
}

export function fetchUsersFollowingPosts(uid) {
  return (dispatch, getState) => {
    Firebase.firestore()
      .collection('posts')
      .where('uid', '==', uid)
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        const uid = snapshot.docs[0].ref.path.split('/')[1]

        const user  = getState().usersState?.users?.find(el => el.uid === uid);


        if (!user) {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data()
            const id = doc.id
            return { id, ...data, user }
          })
    
          dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })
        }

        

        
        // console.log(getState())
      })
  }
}
