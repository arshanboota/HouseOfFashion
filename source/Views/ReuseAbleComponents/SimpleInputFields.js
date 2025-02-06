import React, { Component } from 'react'
import { TextInput } from 'react-native'
import { connect } from 'react-redux'
import { container, headings } from '../../utils/Styles'
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'
import Helper from '../../utils/Helper';

const helper = new Helper()

class SimpleInputFields extends Component {

    render() {
        let { theme, language, languageReducer, themeReducer } = this.props
        return (
            <TextInput
                style={{
                    height: "8%",
                    width: "78%",
                    alignSelf: 'center',
                    color: theme.loginScreen_primary_textColor,
                    backgroundColor: theme.loginScreen_TextInputColor,
                    borderRadius: 20,
                    fontSize: 18,
                    top: "7%",
                    marginTop: "5%"
                }}
                onChangeText={() => this.props.onChangeText() }
                value={this.props.value}
                paddingLeft='7%'
                placeholder= {this.props.palceholder}
                secureTextEntry={this.props.secureTextEntry}
                placeholderTextColor={theme.loginScreen_primary_light_textColor}
                keyboardType={this.props.keyboardType}
            />
        )
    }
}


export default connect(ReducersProps, ReducersActions)(SimpleInputFields)