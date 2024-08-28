import React from "react";
import { useRouter } from "expo-router";
import {
	TextInput,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Signup = () => {
	const router = useRouter();

	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

	const handleRegister = () => {
		router.push("/signin");
	};

	const alreadyHaveAccount = () => {
		router.push("/signin");
	};

	const togglePasswordVisibility = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<View style={styles.formContainer}>
					<Text style={styles.headerText}>Sign up!</Text>
					<Text style={styles.desc}>Create an Account to get started</Text>
					<Text style={styles.title}>Name</Text>
					<TextInput
						style={styles.input}
						placeholder="Name"
						value={email}
						onChangeText={setName}
						autoCapitalize="none"
					/>
					<Text style={styles.title}>Email Address</Text>
					<TextInput
						style={styles.input}
						placeholder="Email"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
					<Text style={styles.title}>Password</Text>
					<View style={styles.passwordContainer}>
						<TextInput
							style={styles.passwordInput}
							placeholder="Password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry={!isPasswordVisible}
						/>
						<TouchableOpacity
							onPress={togglePasswordVisibility}
							style={styles.iconContainer}
						>
							<MaterialCommunityIcons
								name={isPasswordVisible ? "eye-off" : "eye"}
								size={24}
								position="absolute"
								right={15}
								color="#007AFF"
							/>
						</TouchableOpacity>
					</View>
					<Text style={styles.title}>Confirm Password</Text>
					<View style={styles.passwordContainer}>
						<TextInput
							style={styles.passwordInput}
							placeholder="Confirm Password"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry={!isPasswordVisible}
						/>
						<TouchableOpacity
							onPress={togglePasswordVisibility}
							style={styles.iconContainer}
						>
							<MaterialCommunityIcons
								name={isPasswordVisible ? "eye-off" : "eye"}
								size={24}
								position="absolute"
								right={15}
								color="#007AFF"
							/>
						</TouchableOpacity>
					</View>

					<TouchableOpacity style={styles.button} onPress={handleRegister}>
						<Text style={styles.buttonText}>Sign Up</Text>
					</TouchableOpacity>
					<Text style={styles.toLogin} onPress={alreadyHaveAccount}>
						Already have an account?{" "}
						<Text style={styles.toLoginLink}>Login</Text>
					</Text>
				</View>
			</SafeAreaView>
		</GestureHandlerRootView>
	);
};

export default Signup;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-between",
		fontFamily: "Poppins",
	},

	desc: {
		fontSize: 15,
		marginBottom: 20,
	},

	title: {
		fontSize: 15,
		fontWeight: "bold",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 20,
	},

	formContainer: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
	},

	headerText: {
		fontSize: 30,
		fontWeight: "bold",
		fontFamily: "Poppins",
	},

	input: {
		height: 50,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 20,
		display: "flex",
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

	toLogin: {
		fontSize: 15,
		textAlign: "center",
	},

	toLoginLink: {
		textAlign: "center",
		color: "blue",
		fontSize: 15,
		fontWeight: "bold",
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
	},

	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	icon: {
		padding: 10,
	},
});
