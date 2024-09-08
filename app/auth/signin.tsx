import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
	TextInput,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import supabase from "../../lib/supabase";
import { useUserStore } from "../../store/users";
import useAlert from "../../components/Alerts";

const Signin = () => {
	const router = useRouter();
	const [alert, setAlert] = useState<{
		type: "success" | "error" | "warning" | "info";
		message: string;
	} | null>(null);

	const {
		name,
		email,
		password,
		confirmPassword,
		isPasswordVisible,
		loading,
		isChecked,
		setName,
		setEmail,
		setPassword,
		setConfirmPassword,
		setIsPasswordVisible,
		setLoading,
		setIsChecked,
	} = useUserStore();

	async function signInWithEmail() {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) {
			setLoading(false);
			setAlert({ type: "error", message: error.message });
			console.log(error.message);
		} else {
			// showAlert("Login successful", "success");

			setAlert({ type: "success", message: "Login successful" });
			router.push("/info");
		}
	}

	const passwordVisiblity = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};

	const toRegister = () => {
		router.push("/auth/signup");
	};

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<View style={styles.headerImg}>
					<Image
						style={styles.cellPhone2}
						source={require("../../assets/images/extras/cellphone2.png")}
						contentFit="contain"
					/>
					<Image
						style={styles.shape}
						source={require("../../assets/images/extras/Shapes.png")}
						contentFit="contain"
					/>
				</View>

				<View style={styles.formContainer}>
					<Text style={styles.headerText}>Welcome!</Text>
					<TextInput
						style={styles.input}
						placeholder="Email"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
					<View style={styles.passwordContainer}>
						<TextInput
							style={styles.passwordInput}
							placeholder="Password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry={!isPasswordVisible}
						/>
						<TouchableOpacity
							onPress={passwordVisiblity}
							style={styles.iconContainer}
						>
							<MaterialCommunityIcons
								name={isPasswordVisible ? "eye-off" : "eye"}
								size={24}
								color="#007AFF"
								style={styles.icon}
							/>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.button} onPress={signInWithEmail}>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>
					<Text style={styles.toRegister} onPress={toRegister}>
						Don't have an account?{" "}
						<Text style={styles.toRegisterLink}>Register</Text>
					</Text>
				</View>
			</SafeAreaView>
		</GestureHandlerRootView>
	);
};

export default Signin;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-between",
		fontFamily: "Poppins",
	},

	headerImg: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
		resizeMode: "cover",
	},

	cellPhone2: {
		width: "100%",
		height: 250,
		position: "absolute",
		top: 10,
		left: -35,
		zIndex: 1,
	},

	shape: {
		width: "100%",
		height: 450,
		position: "absolute",
		top: -50,
		right: -30,
	},

	buttonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 20,
	},

	blank: {
		height: 200,
	},

	formContainer: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
		marginTop: 290,
	},

	headerText: {
		fontSize: 30,
		fontWeight: "bold",
		fontFamily: "Poppins",
	},

	input: {
		height: 50,
		borderColor: "#ccc",
		borderWidth: 2,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 20,
		display: "flex",
		backgroundColor: "#f9f9f9",
	},

	passwordContainer: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
	},

	passwordInput: {
		flex: 1,
		height: 50,
		width: "100%",
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		position: "relative",
		marginVertical: 15,
	},

	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	icon: {
		padding: 10,
		position: "absolute",
		right: 10,
	},

	button: {
		height: 60,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#007AFF",
		borderRadius: 15,
		marginVertical: 15,
	},

	toRegister: {
		fontSize: 15,
		textAlign: "center",
	},

	toRegisterLink: {
		textAlign: "center",
		color: "blue",
		fontSize: 15,
		fontWeight: "bold",
	},
});
