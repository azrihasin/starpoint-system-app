import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, increment } from "firebase/firestore";

export default class User {
    static role = "student";
    static id;
    static starPoints = 0;

    static fetchDetails = async () => {
        const db = getFirestore();
        const user = await getDoc(doc(db, "users", getAuth().currentUser.uid));
        User.id = getAuth().currentUser.uid
        User.role = user.data().role;
        User.starPoints = user.data().starPoints;
    };

    static addStarPoints = async (points) => {
        const db = getFirestore();
        const userRef = doc(db, "users", getAuth().currentUser.uid);
        await updateDoc(userRef, {
            starPoints: increment(points)
        });
        User.starPoints += points;
    };
}