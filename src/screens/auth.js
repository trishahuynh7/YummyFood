import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification,
  signInWithEmailAndPassword, signOut, } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const registerUser = async (email, password, additionalData = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);

    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      ...additionalData,
      createdAt: new Date(),
    });

    // Sign out the user until they verify their email
    await signOut(auth);

    return { 
        success: true, 
        message: 'Verification email sent. Please verify your email before logging in.' };
  } catch (error) {
    throw error;
  }
};

// Hnadling login user authentication
export const loginUser = async (email, password) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } 
    catch (error) {  
        // If user does not exist in db  
        if (error.code === 'auth/user-not-found') {
            throw new Error('No user found with this email. Please sign in to create an account.');
        } 
        // Wrong user password in db
        else if (error.code === 'auth/wrong-password') {
            throw new Error('Incorrect password.');
        } 
        // Error occured in login. User didn't fill out login form.
        else {
            throw new Error('An error occurred during login.');
        }
    }
};