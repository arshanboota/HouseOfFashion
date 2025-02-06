import ReducersConstants from "./ReducersConstants"

const ReducersActions = (dispatch) => {
    return {
        themeReducer: (theme) => dispatch({ type: ReducersConstants.ACTIVE_THEME, theme: theme }),
        languageReducer: (language) => dispatch({ type: ReducersConstants.ACTIVE_LANGUAGE, language: language }),
        updateNotificationsCounter: (count) => dispatch({ type: ReducersConstants.UPDATE_NOTIFICATIONS_COUNTER, count: count }),
        resetNotificationsCounter: () => dispatch({ type: ReducersConstants.RESET_NOTIFICATIONS_COUNTER }),
    }
    // return {
    //     updateCartCounter: (counts) => dispatch({ type: ReducersConstants.UPDATE_CART_COUNTER, counter: counts }),
    //     resetCartCounter: () => dispatch({ type: ReducersConstants.RESET_CART_COUNTER }),
    // }
}

export default ReducersActions