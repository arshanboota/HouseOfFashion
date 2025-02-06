import axios from "axios"
import Urls from "./Urls"


export default class ApiHandler {
   

    registerUser(data, onSuccess, onFailure) {
        let body = "name=" + data.username + "&email=" + data.email +
            "&phone=" + data.mobileNo + "&password=" + data.password;
        this.sendSimplePostFormRequest(Urls.REGISTER_USER_URL, body, (resp) => {
            onSuccess(JSON.stringify(resp.data.user_id))
        }, (error) => { onFailure(error) })
    }
    loginUser(data, onSuccess, onFailure) {
        let body = "email=" + data.email + "&password=" + data.password;
        this.sendSimplePostFormRequest(Urls.LOGIN_USER_URL, body, (resp) => {
            onSuccess(resp)
        }, (error) => { onFailure(error) })
    }


    sendSimplePostFormRequest(url, _body, onResponse, onError) {
        console.log("=====================API CALLED========================")
        console.log("URL=====> ", url)
        console.log("BODY PART=====> ", _body)
        axios.post(url, _body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((resp) => {
            console.log("Response======>", JSON.stringify(resp.data))
            if (JSON.stringify(resp.data.status) == "true") {
                onResponse(resp)
            } else {
                onError(JSON.stringify(resp.data.message))
            }
        }).catch((ex) => {
            console.log("Error=======>", ex)
            if (ex == 'Error: Network Error') {
                onError("Network Request Failed")
            }
            else {
                onError(ex.message)
            }
        })
    }


  
}

