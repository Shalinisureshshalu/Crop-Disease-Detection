import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../firebase-config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Authentication functions
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Database functions
export const addDiseasePrediction = async (predictionData) => {
  try {
    const docRef = await addDoc(collection(db, 'predictions'), {
      ...predictionData,
      timestamp: new Date(),
      userId: auth.currentUser?.uid
    });
    return docRef;
  } catch (error) {
    console.error('Error adding prediction: ', error);
    throw error;
  }
};

export const getUserPredictions = async (userId) => {
  try {
    const q = query(
      collection(db, 'predictions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting predictions: ', error);
    throw error;
  }
};

export const getAllDiseases = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'diseases'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting diseases: ', error);
    throw error;
  }
};

// Storage functions
export const uploadImage = async (file, userId) => {
  try {
    const storageRef = ref(storage, `crop-images/${userId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image: ', error);
    throw error;
  }
};

export default app;
