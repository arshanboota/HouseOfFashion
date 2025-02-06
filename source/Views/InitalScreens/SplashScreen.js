import React, { Component } from 'react'
import { Text, View, StatusBar, Image } from 'react-native'
import { connect } from 'react-redux'
import { headings } from '../../../source/utils/Styles'
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'
import Helper from '../../utils/Helper';
import { CommonActions } from '@react-navigation/native';
import PrefManager from '../../data/local/PrefManager'

const prefManager = new PrefManager()
const helper = new Helper()
const MAIN_BG_IMG = "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"

class SplashScreen extends Component {

    resetStackAndMove(screenName) {
        return (this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: screenName },
                ],
            })
        )
        )
    }

    componentDidMount() {
        // Set Timer For Splash Screen
        // prefManager.deleteUsertData()
        setTimeout(() => { this.resetStackAndMove("HomeScreen") }, 4000)
    }




    render() {
        let { theme, language, } = this.props
        return (
            // __________________Parent View
            <View style={{
                flex: 1,
                backgroundColor: theme.splashScreen_primary_backgroundColor,
                justifyContent: 'center',
            }}>

                <StatusBar backgroundColor={"transparent"} translucent />

                {/* Background Image */}
                <Image style={{
                    width: "100%",
                    height: "100%",
                    position: 'absolute',

                    opacity: 0.8,
                }} source={{ uri: MAIN_BG_IMG }} />

                {/* Blur Circle */}
                <View style={{
                    height: "50%",
                }}>

                    {/* Circle Image */}
                    <Image style={{
                        width: 340,
                        height: 340,
                        opacity: 0.7,
                        borderRadius: 200,
                        marginLeft: "40%",
                    }} source={require("../../assets/Images/splashImg.jpg")} />

                    {/* Text Image */}
                    <Image style={{
                        width: "50%",
                        height: "50%",
                        marginLeft: "47%",
                        marginTop: "15%",
                        position: 'absolute',
                        tintColor: theme.splashScreen_tintColor,
                    }} source={require("../../assets/Images/SplashText.png")} />

                    {/* Circle footer text */}
                    <Text style={{
                        ...headings.h4,
                        color: theme.splashScreen_primary_light_textColor,
                        position: 'absolute',
                        marginTop: "70%",
                        marginRight: "4%",
                        alignSelf: 'flex-end',
                        fontSize: 13,
                    }}>{language.keep_eyes_on_your_new_arrivals} </Text>

                </View>


            </View>
        )
    }
}
export default connect(ReducersProps, ReducersActions)(SplashScreen)