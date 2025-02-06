import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_SESSION_DATA_KEY = "@Session:UserData"
const CART_DATA = "@Cart:cartItemData"
const USER_DATA = "@userData"
const IS_LOGIN_KEY = "@isLoginKey"





export default class PrefManager {
    saveCartData = async (cartData) => {
        try {
            await AsyncStorage.setItem(CART_DATA, JSON.stringify(cartData));
            console.log("==============saveCartData  DONE================")

        } catch (ex) {
            console.log("==============ERROR saveCartData================", ex.message)
        }
    }
    getSaveCartData = async (onLoaded) => {
        try {
            let data = await AsyncStorage.getItem(CART_DATA);
            let jData = data ? JSON.parse(data) : null
            onLoaded(jData)
            console.log("==============getSaveCartData  DONE================")

        } catch (ex) {
            console.log("==============ERROR getSaveCartData================", ex.message)
        }
    }
    saveUserData = async (userData, status) => {
        try {
            await AsyncStorage.setItem(USER_DATA, JSON.stringify(userData));
            await AsyncStorage.setItem(IS_LOGIN_KEY, status ? "true" : "false");
            console.log("==============saveUserData  DONE================", userData, "===>", status)
        } catch (ex) {
            console.log("==============ERROR saveCartData================", ex.message)
        }
    }
    getSaveUserData = async (onLoaded) => {
        try {
            let data = await AsyncStorage.getItem(USER_DATA);
            let jData = data ? JSON.parse(data) : null
            onLoaded(jData)
            console.log("==============getSaveCartData  DONE================")
        } catch (ex) {
            console.log("==============ERROR getSaveCartData================", ex.message)
        }
    }
    getUserLoginState = async (onLoaded) => {
        try {
            let data = await AsyncStorage.getItem(IS_LOGIN_KEY);
            console.log("==============getUserLoginState  DONE================",data)
            if (data == "true") { onLoaded(true) }
            else { onLoaded(false) }
            console.log("==============getUserLoginState  DONE================")
        } catch (ex) {
            console.log("==============ERROR getUserLoginState================", ex.message)
        }
    }
    deleteUsertData = async () => {
        try {
            await AsyncStorage.multiRemove([USER_DATA, CART_DATA, IS_LOGIN_KEY])
            console.log("==============RESOLVE deleteUsertData================",)
        }
        catch (ex) {
            console.log("==============ERROR deleteUsertData================", ex.message)
        }
    }
    deleteCartData = async () => {
        try {
            await AsyncStorage.multiRemove([CART_DATA])
            console.log("==============RESOLVE deleteUsertData================",)
        }
        catch (ex) {
            console.log("==============ERROR deleteUsertData================", ex.message)
        }
    }



}



// const saveCartData = async (cartData) => {
//     try {
//         await AsyncStorage.setItem(CART_DATA, JSON.stringify(cartData));
//         console.log("==============saveCartData  DONE================")

//     } catch (ex) {
//         console.log("==============ERROR saveCartData================", ex.message)
//     }
// }


// const getSaveCartData = async (onLoaded) => {
//     try {
//         let data = await AsyncStorage.getItem(CART_DATA);
//         let jData = data ? JSON.parse(data) : null
//         onLoaded(jData)
//         console.log("==============getSaveCartData  DONE================")

//     } catch (ex) {
//         console.log("==============ERROR getSaveCartData================", ex.message)
//     }

// }






// const createUserSession = async (sessionData, isLogin, onAdded) => {
//     await AsyncStorage.setItem(USER_SESSION_DATA_KEY, JSON.stringify(sessionData));
//     await AsyncStorage.setItem(IS_LOGIN_KEY, isLogin ? "true" : "false");
//     onAdded()
// }

// const getUserSessionData = async (onLoaded) => {
//     let data = await AsyncStorage.getItem(USER_SESSION_DATA_KEY);
//     let jData = data ? JSON.parse(data) : null
//     onLoaded(jData)
// }

// const updateSessionToken = async (token) => {
//     let data = await AsyncStorage.getItem(USER_SESSION_DATA_KEY);
//     if (data) {
//         let jData = JSON.parse(data)
//         jData.sessionToken = token
//         await AsyncStorage.setItem(USER_SESSION_DATA_KEY, JSON.stringify(jData));
//     }
// }

// const destroySession = async (onCompleted) => {
//     await AsyncStorage.multiRemove([USER_SESSION_DATA_KEY, IS_LOGIN_KEY])
//     onCompleted()
// }

// const updateLoginStatus = async (isLogin, onUpdated) => {
//     await AsyncStorage.setItem(IS_LOGIN_KEY, isLogin ? "true" : "false");
//     onUpdated()
// }

// const isUserLoggedIn = async (onResult) => {
//     try {
//         const val = await AsyncStorage.getItem(IS_LOGIN_KEY);
//         onResult(val && val == "true")
//     } catch (ex) {
//         onResult(false)
//         console.warn(ex.message)
//     }
// }

// export {
//     createUserSession, getUserSessionData, updateSessionToken, destroySession,
//     updateLoginStatus, isUserLoggedIn, saveCartData , getSaveCartData
// }