import React, { Component } from 'react'
import { Text, View, StatusBar, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { container, headings } from '../../utils/Styles'
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'
import Helper from '../../utils/Helper';

const helper = new Helper()

class SimpleStyleButton extends Component {

    render() {
        let { theme, language, languageReducer, themeReducer } = this.props
        return (
            <TouchableOpacity style={{
                backgroundColor: this.props.bodyBackground ,
                width: this.props.width,
                height: this.props.height,
                marginTop: this.props.marginTop,
                borderRadius: 17,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
            }}
                activeOpacity={0.7}
                onPress={() => this.props.onAction()}
            >
                <Text style={{
                    ...headings.h3,
                    fontSize: 20,
                    color: this.props.textColor
                }}> {this.props.title} </Text>
            </TouchableOpacity>
        )
    }
}


export default connect(ReducersProps, ReducersActions)(SimpleStyleButton)