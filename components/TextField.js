import { TextInput, StyleSheet, View, Text } from "react-native";

export default TextField = ({ label, placeholder, onChange, defaultValue, errorText }) => {
    return <View style={styles.container} >
        <Text style={styles.label} >{label}</Text>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            onChangeText={newText => onChange(newText)}
            defaultValue={defaultValue}
        />
        {errorText != null ? <Text style={styles.errorText} >*{errorText}</Text> : <View></View>}
    </View>;
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginVertical: 8,
    },
    label: {
        marginBottom: 4
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 16
    },
    errorText: {
        color: 'red'
    }
});