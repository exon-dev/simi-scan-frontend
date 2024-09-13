import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
	TextInput,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CheckBox } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import supabase from "../../lib/supabase";
import { Alert } from "react-native";
import { useUserStore } from "../../store/users";
import { router } from "expo-router";

const Signup = () => {
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

	async function signUpWithEmail() {
		if (!validatePassword(password)) {
			Alert.alert(
				"Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
			);
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Passwords do not match!");
			return;
		}

		if (!isChecked) {
			Alert.alert("You must agree to the terms and conditions.");
			return;
		}

		setLoading(true);

		const { data, error } = await supabase.auth.signUp({ email, password });

		if (error) {
			Alert.alert(error.message);
		} else {
			const { error } = await supabase.from("users").insert({
				name,
				email,
			});
			Alert.alert("Please check your inbox for email verification!");

			if (error) {
				Alert.alert(error.message);
				return;
			}
			router.push("/(auth)/verification");
		}

		setLoading(false);
	}

	const validatePassword = (password: string): boolean => {
		const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
		return passwordRegex.test(password);
	};

	const alreadyHaveAccount = () => {
		//@ts-ignore

		router.push("/(auth)/signin");
	};

	const passwordVisiblity = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<View style={styles.formContainer}>
					<Text style={styles.headerText}>Sign up</Text>
					<Text style={styles.desc}>Create an Account to get started</Text>
					<Text style={styles.title}>Name</Text>
					<TextInput
						style={styles.input}
						placeholder='Name'
						value={name}
						onChangeText={setName}
						autoCapitalize='none'
					/>
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
					<View style={styles.passwordContainer}>
						<TextInput
							style={styles.passwordInput}
							placeholder='Password'
							value={password}
							onChangeText={setPassword}
							secureTextEntry={!isPasswordVisible}
						/>
						<TouchableOpacity
							onPress={passwordVisiblity}
							style={styles.iconContainer}>
							<MaterialCommunityIcons
								name={isPasswordVisible ? "eye-off" : "eye"}
								size={24}
								position='absolute'
								right={15}
								color='#007AFF'
							/>
						</TouchableOpacity>
					</View>
					<Text style={styles.title}>Confirm Password</Text>
					<View style={styles.passwordContainer}>
						<TextInput
							style={styles.passwordInput}
							placeholder='Confirm Password'
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry={!isPasswordVisible}
						/>
						<TouchableOpacity
							onPress={passwordVisiblity}
							style={styles.iconContainer}>
							<MaterialCommunityIcons
								name={isPasswordVisible ? "eye-off" : "eye"}
								size={24}
								position='absolute'
								right={15}
								color='#007AFF'
							/>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						style={styles.button}
						onPress={signUpWithEmail}>
						<Text style={styles.buttonText}>Sign Up</Text>
					</TouchableOpacity>
					<Text
						style={styles.toLogin}
						onPress={alreadyHaveAccount}>
						Already have an account? <Text style={styles.toLoginLink}>Login</Text>
					</Text>

					<View style={styles.checkboxContainer}>
						<CheckBox
							// title="I agree to the Terms and Conditions"
							checked={isChecked}
							onPress={() => setIsChecked(!isChecked)}
							containerStyle={styles.checkbox}
						/>
						<Text style={styles.checkboxText}>
							I've read and agree to the{" "}
							<Text style={styles.terms}>Terms and {"\n"} Conditions</Text> and{" "}
							<Text style={styles.terms}>Privacy Policy</Text>
						</Text>
					</View>
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
		marginVertical: 15,
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
		marginVertical: 15,
	},

	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	icon: {
		padding: 10,
	},

	checkboxContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		marginTop: 25,
	},
	checkbox: {
		borderWidth: 0,
	},

	checkboxText: {
		fontSize: 15,
	},
	terms: {
		color: "#007AFF",
		fontWeight: "bold",
	},
});
