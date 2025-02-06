import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

class PreloadWebview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading: true,
        };
    }

    handleNavigationStateChange = (navState) => {
        const { onNavigationStateChangeExternal } = this.props;
        if (onNavigationStateChangeExternal) {
            onNavigationStateChangeExternal(navState);
        }
    };

    handleMessage = (event) => {
        const { data } = event.nativeEvent;
        // Check if the message sent from WebView indicates the need to trigger insertItemsController
        if (data == 'performInsertItemsController') {
            this.props.insertItemsController(); // Call insertItemsController function from props
        }
    };

    render() {
        const { uri, onWebViewRef, injectedJavaScript, onLoadEnd, shouldRender } = this.props;

        // Conditionally render based on shouldRender prop
        if (!shouldRender) {
            return null;
        }

        return (
            <View style={styles.container}>
                <WebView
                    userAgent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"
                    // source={{ uri }}
                    ref={(ref) => { 
                        this.webviewRef = ref; // Assign webviewRef
                        onWebViewRef(ref); // Pass the reference to the parent component
                    }}
                    //   injectedJavaScript={injectedJavaScript}
                    onLoadEnd={onLoadEnd}
                    onNavigationStateChange={this.handleNavigationStateChange}
                    startInLoadingState={true}
                    onMessage={this.handleMessage}
                    // renderLoading={() => (
                    //     <ActivityIndicator
                    //         color="#0000ff"
                    //         size="large"
                    //         style={styles.flexContainer}
                    //     />
                    // )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flexContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default PreloadWebview;