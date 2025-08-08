
import { StyleSheet } from "react-native";


export const stylesApp = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 18,
        color: "#666",
    },
    authContainer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 30,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 40,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        paddingHorizontal: 10,
    },
    switchButton: {
        alignItems: "center",
        marginTop: 10,
    },
    switchButtonText: {
        color: "#007AFF",
        fontSize: 16,
    },
    header: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingTop: 100,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
        textAlign: "center"
    },
    userEmail: {
        fontSize: 14,
        color: "#666",
        marginTop: 10,
        textAlign: "right"
    },
    logoutButton: {
        alignSelf: "flex-end",
        backgroundColor: "#FF3B30",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 40,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    addButton: {
        backgroundColor: "#34C759",
        marginHorizontal: 20,
        marginVertical: 15,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    studentsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    studentItem: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    studentDetails: {
        fontSize: 14,
        color: "#666",
        marginBottom: 2,
    },
    studentActions: {
        flexDirection: "row",
        gap: 10,
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
    },
    editButton: {
        backgroundColor: "#007AFF",
    },
    deleteButton: {
        backgroundColor: "#FF3B30",
    },
    actionButtonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 10,
        padding: 20,
        maxHeight: "80%",
        width: "90%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: "#8E8E93",
        flex: 1,
    },
    deleteModalContainer: {
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 10,
        padding: 20,
        width: "80%",
    },
    deleteModalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
        color: "#333",
    },
    deleteModalText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "#666",
    },
});
