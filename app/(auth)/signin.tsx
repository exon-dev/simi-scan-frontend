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
import { useSessionStore } from "@/store/session";

const Signin = () => {
	const router = useRouter();
	const [alert, setAlert] = useState<{
		type: "success" | "error" | "warning" | "info";
		message: string;
	} | null>(null);

	//@ts-ignore
	const { session, setSession } = useSessionStore();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleLogin() {
		setLoading(true);

		if (!email || !password) {
			Alert.alert("Please input all fields!");
			return;
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) {
			setLoading(false);
			setAlert({ type: "error", message: error.message });
			Alert.alert("Error", error.message);
			console.log(error.message);
		} else {
			// showAlert("Login successful", "success");
			const { data: user } = await supabase
				.from("users")
				.select("name")
				.eq("email", data.user.email);

			setSession({
				id: data.user.id,
				//@ts-ignore
				name: user![0].name,
				email: data.user.email,
				role: data.user.role,
				access_token: data.session.access_token,
				expiration: data.session.expires_at,
			});

			if (Object.keys(session) !== null) {
				router.push("/menu");
			}
			return;
			setAlert({ type: "success", message: "Login successful" });
		}
	}

	const toRegister = () => {
		//@ts-ignore
		router.push("/(auth)/signup");
	};
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<View style={styles.headerImg}>
					<Image
						style={styles.cellPhone2}
						source={require("../../assets/images/extras/cellphone2.png")}
						contentFit='contain'
					/>
					<Image
						style={styles.shape}
						source={require("../../assets/images/extras/Shapes.png")}
						contentFit='contain'
					/>
				</View>

				<View style={styles.formContainer}>
					<Text style={styles.headerText}>Welcome!</Text>
					<Text style={styles.title}>Email Address</Text>
					<TextInput
						style={styles.input}
						placeholder='Email'
						value={email}
						onChangeText={setEmail}
						keyboardType='email-address'
						autoCapitalize='none'
					/>
					<Text style={styles.title}>Password</Text>

					<TextInput
						style={styles.input}
						placeholder='Password'
						value={password}
						onChangeText={setPassword}
						secureTextEntry
					/>
					<TouchableOpacity
						style={styles.button}
						onPress={handleLogin}>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>
					<Text
						style={styles.toRegister}
						onPress={toRegister}>
						Don't have an account? <Text style={styles.toRegisterLink}>Register</Text>
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

	title: {
		fontSize: 15,
		fontWeight: "bold",
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
		marginTop: 100,
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
