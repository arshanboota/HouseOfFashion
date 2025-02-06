const ReducersProps = (state) => {
    return {
        language: state.languageReducer.language,
        theme: state.themeReducer.theme,
        notificationsCount: state.notificationsReducer.count
    }
}

export default ReducersProps