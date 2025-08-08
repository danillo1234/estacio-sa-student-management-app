
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InterfaceUser } from "./interfaces/interface-user";
import { InterfaceStudent } from "./interfaces/interface-student";
import { asyncStorageKeyNames } from './constants/constant-async-storage-key-names';
import { stylesApp } from "./styles/style-app";
import { Loading } from "./components/component-loading";


const App = () => {
    // Estados principais
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<string>("");
    const [students, setStudents] = useState<InterfaceStudent[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados da tela de autenticação
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estados do formulário de aluno
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState<InterfaceStudent | null>(null);
    const [studentName, setStudentName] = useState("");
    const [studentAge, setStudentAge] = useState("");
    const [studentCourse, setStudentCourse] = useState("");

    // Estados dos modais
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<InterfaceStudent | null>(null);

    // Inicialização do app
    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            const loggedIn = await AsyncStorage.getItem(asyncStorageKeyNames.IS_LOGGED_IN_KEY);
            const user = await AsyncStorage.getItem(asyncStorageKeyNames.CURRENT_USER_KEY);

            if (loggedIn === "true" && user) {
                setIsLoggedIn(true);
                setCurrentUser(user);
                await loadStudents(user);
            }
        } catch (error) {
            console.error("Erro ao inicializar app:", error);
        } finally {
            setLoading(false);
        }
    };

    // Funções de autenticação
    const handleAuth = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Erro", "Por favor, preencha todos os campos");
            return;
        }

        if (isLoginMode) {
            await handleLogin();
        } else {
            await handleRegister();
        }
    };

    const handleLogin = async () => {
        try {
            const usersData = await AsyncStorage.getItem(asyncStorageKeyNames.USERS_KEY);
            const users: InterfaceUser[] = usersData ? JSON.parse(usersData) : [];

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                await AsyncStorage.setItem(asyncStorageKeyNames.IS_LOGGED_IN_KEY, "true");
                await AsyncStorage.setItem(asyncStorageKeyNames.CURRENT_USER_KEY, email);
                setCurrentUser(email);
                setIsLoggedIn(true);
                await loadStudents(email);
                clearAuthForm();
                Alert.alert("Sucesso", "Login realizado com sucesso!");
            } else {
                Alert.alert("Erro", "Email ou senha incorretos");
            }
        } catch (error) {
            Alert.alert("Erro", "Erro ao fazer login");
        }
    };

    const handleRegister = async () => {
        try {
            const usersData = await AsyncStorage.getItem(asyncStorageKeyNames.USERS_KEY);
            const users: InterfaceUser[] = usersData ? JSON.parse(usersData) : [];

            const existingUser = users.find(u => u.email === email);

            if (existingUser) {
                Alert.alert("Erro", "Este email já está cadastrado");
                return;
            }

            const newUser: InterfaceUser = { email, password };
            users.push(newUser);

            await AsyncStorage.setItem(asyncStorageKeyNames.USERS_KEY, JSON.stringify(users));
            Alert.alert("Sucesso", "Usuário cadastrado com sucesso! Faça login para continuar.");
            setIsLoginMode(true);
            clearAuthForm();
        } catch (error) {
            Alert.alert("Erro", "Erro ao cadastrar usuário");
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem(asyncStorageKeyNames.IS_LOGGED_IN_KEY);
            await AsyncStorage.removeItem(asyncStorageKeyNames.CURRENT_USER_KEY);
            setIsLoggedIn(false);
            setCurrentUser("");
            setStudents([]);
            clearAuthForm();
            Alert.alert("Sucesso", "Logout realizado com sucesso!");
        } catch (error) {
            Alert.alert("Erro", "Erro ao fazer logout");
        }
    };

    // Funções de gerenciamento de alunos
    const loadStudents = async (userEmail: string) => {
        try {
            const studentsData = await AsyncStorage.getItem(asyncStorageKeyNames.STUDENTS_KEY);
            const allStudents: InterfaceStudent[] = studentsData ? JSON.parse(studentsData) : [];
            const userStudents = allStudents.filter(student => student.userEmail === userEmail);
            setStudents(userStudents);
        } catch (error) {
            console.error("Erro ao carregar alunos:", error);
        }
    };

    const saveStudent = async () => {
        if (!studentName.trim()) {
            Alert.alert("Erro", "O campo 'Nome do aluno' é obrigatório!");
            return;
        }

        if (!studentAge.trim()) {
            Alert.alert("Erro", "O campo 'Idade' deve ser numérico e é obrigatório!");
            return;
        }

        if (!studentCourse.trim()) {
            Alert.alert("Erro", "O campo 'Curso' é obrigatório!");
            return;
        }

        try {
            const studentsData = await AsyncStorage.getItem(asyncStorageKeyNames.STUDENTS_KEY);
            let allStudents: InterfaceStudent[] = studentsData ? JSON.parse(studentsData) : [];

            if (editingStudent) {
                // Editando aluno existente
                allStudents = allStudents.map(student =>
                    student.id === editingStudent.id
                        ? { ...student, name: studentName, age: studentAge, grade: studentCourse }
                        : student
                );
                Alert.alert("Sucesso", "Aluno atualizado com sucesso!");
            } else {
                // Adicionando novo aluno
                const newStudent: InterfaceStudent = {
                    id: Date.now().toString(),
                    name: studentName,
                    age: studentAge,
                    grade: studentCourse,
                    userEmail: currentUser,
                };
                allStudents.push(newStudent);
                Alert.alert("Sucesso", "Aluno adicionado com sucesso!");
            }

            await AsyncStorage.setItem(asyncStorageKeyNames.STUDENTS_KEY, JSON.stringify(allStudents));
            await loadStudents(currentUser);
            closeStudentForm();
        } catch (error) {
            Alert.alert("Erro", "Erro ao salvar aluno");
        }
    };

    const confirmDeleteStudent = (student: InterfaceStudent) => {
        setStudentToDelete(student);
        setShowDeleteModal(true);
    };

    const deleteStudent = async () => {
        if (!studentToDelete) return;

        try {
            const studentsData = await AsyncStorage.getItem(asyncStorageKeyNames.STUDENTS_KEY);
            let allStudents: InterfaceStudent[] = studentsData ? JSON.parse(studentsData) : [];

            allStudents = allStudents.filter(student => student.id !== studentToDelete.id);

            await AsyncStorage.setItem(asyncStorageKeyNames.STUDENTS_KEY, JSON.stringify(allStudents));
            await loadStudents(currentUser);
            setShowDeleteModal(false);
            setStudentToDelete(null);
            Alert.alert("Sucesso", "Aluno excluído com sucesso!");
        } catch (error) {
            Alert.alert("Erro", "Erro ao excluir aluno");
        }
    };

    const editStudent = (student: InterfaceStudent) => {
        setEditingStudent(student);
        setStudentName(student.name);
        setStudentAge(student.age);
        setStudentCourse(student.grade);
        setShowStudentForm(true);
    };

    // Funções auxiliares
    const clearAuthForm = () => {
        setEmail("");
        setPassword("");
    };

    const closeStudentForm = () => {
        setShowStudentForm(false);
        setEditingStudent(null);
        setStudentName("");
        setStudentAge("");
        setStudentCourse("");
    };

    // Renderização de componentes
    const renderAuthScreen = () => (
        <KeyboardAvoidingView
            style={stylesApp.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={stylesApp.authContainer}>
                <Text style={stylesApp.title}>
                    {isLoginMode ? "Login" : "Cadastro"}
                </Text>

                <TextInput
                    style={stylesApp.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={stylesApp.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={stylesApp.button} onPress={handleAuth}>
                    <Text style={stylesApp.buttonText}>
                        {isLoginMode ? "Entrar" : "Cadastrar"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={stylesApp.switchButton}
                    onPress={() => setIsLoginMode(!isLoginMode)}
                >
                    <Text style={stylesApp.switchButtonText}>
                        {isLoginMode
                            ? "Não tem conta? Cadastre-se"
                            : "Já tem conta? Faça login"
                        }
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );

    const renderStudentItem = ({ item }: { item: InterfaceStudent }) => (
        <View style={stylesApp.studentItem}>
            <View style={stylesApp.studentInfo}>
                <Text style={stylesApp.studentName}>{item.name}</Text>
                <Text style={stylesApp.studentDetails}>Idade: {item.age} anos</Text>
                <Text style={stylesApp.studentDetails}>Série: {item.grade}</Text>
            </View>
            <View style={stylesApp.studentActions}>
                <TouchableOpacity
                    style={[stylesApp.actionButton, stylesApp.editButton]}
                    onPress={() => editStudent(item)}
                >
                    <Text style={stylesApp.actionButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[stylesApp.actionButton, stylesApp.deleteButton]}
                    onPress={() => confirmDeleteStudent(item)}
                >
                    <Text style={stylesApp.actionButtonText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderMainScreen = () => (
        <View style={stylesApp.container}>
            <View style={stylesApp.header}>
                <Text style={stylesApp.headerTitle}>Gerenciamento de Alunos</Text>
                <Text style={stylesApp.userEmail}>Usuário: {currentUser}</Text>
                <TouchableOpacity style={stylesApp.logoutButton} onPress={handleLogout}>
                    <Text style={stylesApp.logoutButtonText}>Sair</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={stylesApp.addButton}
                onPress={() => setShowStudentForm(true)}
            >
                <Text style={stylesApp.addButtonText}>+ Adicionar Aluno</Text>
            </TouchableOpacity>

            {students.length === 0 ? (
                <View style={stylesApp.emptyContainer}>
                    <Text style={stylesApp.emptyText}>Nenhum aluno cadastrado</Text>
                </View>
            ) : (
                <FlatList
                    data={students}
                    keyExtractor={(item) => item.id}
                    renderItem={renderStudentItem}
                    style={stylesApp.studentsList}
                />
            )}
        </View>
    );

    const renderStudentForm = () => (
        <Modal visible={showStudentForm} animationType="slide" transparent>
            <View style={stylesApp.modalOverlay}>
                <View style={stylesApp.modalContainer}>
                    <ScrollView>
                        <Text style={stylesApp.modalTitle}>
                            {editingStudent ? "Editar Aluno" : "Adicionar Aluno"}
                        </Text>

                        <TextInput
                            style={stylesApp.input}
                            placeholder="Nome do aluno"
                            value={studentName}
                            onChangeText={setStudentName}
                        />

                        <TextInput
                            style={stylesApp.input}
                            placeholder="Idade"
                            value={studentAge}
                            onChangeText={setStudentAge}
                            keyboardType="numeric"
                        />

                        <TextInput
                            style={stylesApp.input}
                            placeholder="Curso"
                            value={studentCourse}
                            onChangeText={setStudentCourse}
                        />

                        <View style={stylesApp.modalButtons}>
                            <TouchableOpacity
                                style={[stylesApp.button, stylesApp.cancelButton]}
                                onPress={closeStudentForm}
                            >
                                <Text style={stylesApp.buttonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={stylesApp.button}
                                onPress={saveStudent}
                            >
                                <Text style={stylesApp.buttonText}>
                                    {editingStudent ? "Atualizar" : "Salvar"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    const renderDeleteModal = () => (
        <Modal visible={showDeleteModal} animationType="fade" transparent>
            <View style={stylesApp.modalOverlay}>
                <View style={stylesApp.deleteModalContainer}>
                    <Text style={stylesApp.deleteModalTitle}>Confirmar Exclusão</Text>
                    <Text style={stylesApp.deleteModalText}>
                        Tem certeza de que deseja excluir o aluno "{studentToDelete?.name}"?
                    </Text>

                    <View style={stylesApp.modalButtons}>
                        <TouchableOpacity
                            style={[stylesApp.button, stylesApp.cancelButton]}
                            onPress={() => setShowDeleteModal(false)}
                        >
                            <Text style={stylesApp.buttonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[stylesApp.button, stylesApp.deleteButton]}
                            onPress={deleteStudent}
                        >
                            <Text style={stylesApp.buttonText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    if (loading) {
        <Loading />
    }

    return (
        <>
            {isLoggedIn ? renderMainScreen() : renderAuthScreen()}
            {renderStudentForm()}
            {renderDeleteModal()}
        </>
    );
};

export default App;
