
import { initializeApp } from "firebase/app";
import {v4 as uuid} from 'uuid';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged 
 
} from 'firebase/auth';
import { getDatabase, ref, set, get , remove } from "firebase/database";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

export function login() {
  return signInWithPopup(auth, provider).catch(console.error);
}

export function logout() {
  signOut(auth);
}

export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    // 1. 로그인 한경우
    const updateUser = user ? await adminUser(user) : null;
    callback(updateUser);
  });
}

async function adminUser(user) {
  // 2. 사용자가 관리자 권한이 있는지 확인
  // 3. {...user , isAdmin: true/false }
  return get(ref(database, 'admins'))//
  .then((snapshot) => {
    if (snapshot.exists()) {
      const admins = snapshot.val();
      const isAdmin = admins.includes(user.uid);
      return {...user, isAdmin};
    }
    return user;
  });
}

export async function addNewProduct(product, image) {
  const id = uuid();
  return set(ref(database, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image,
    options: product.options.split(','),
  });
}

export async function getProducts() {
  return get(ref(database, 'products')).then(snapshot => {
    if(snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  });
}

export async function getCart(userId) { // 특정한 사용자의 쇼핑 카트 읽어오기 
  return get(ref(database, `carts/${userId}`))
  .then(snapshot => {
    const items = snapshot.val() || {};
    return Object.values(items);
  })
}

export async function addOrUpdateToCart(userId, product) { // 상품추가 , 업데이트
  return set(ref(database, `carts/${userId}/${product.id}`), product);
}

export async function removeFromCart(userId, productId) { // 상품 삭제
  return remove(ref(database, `carts/${userId}/${productId}`))
}