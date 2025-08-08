
import { stylesApp } from "../styles/style-app";
import { View, Text } from "react-native";


export function Loading() {
    return (
        <View style={[stylesApp.container, stylesApp.loadingContainer]}>
            <Text style={stylesApp.loadingText}>Carregando...</Text>
        </View>
    );
};