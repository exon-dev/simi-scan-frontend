import { useLocalSearchParams, useRouter } from "expo-router";
import supabase from "../../lib/supabase";
import {
	GestureHandlerRootView,
	TextInput,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useUserStore } from "../../store/users";
import { useAlertsStore } from "../../store/alerts";

import React, { useEffect, useState } from "react";

const Verification = () => {
	const router = useRouter();
	const { email } = useUserStore();
	const [code, setCode] = React.useState<string[]>(Array(6).fill("")); // Initialize code array with empty strings
	const inputs = React.useRef<TextInput[]>([]);
	const [timer, setTimer] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const { message, setMessage } = useAlertsStore();

	/**
	 * Handles the change event for the input fields.
	 *
	 * @param {string} text - The new text value.
	 * @param {number} index - The index of the input field.
	 */
	// Handle changes in the OTP input
	const handleChange = (text: string, index: number) => {
		if (text.length > 1) {
			text = text.slice(-1); // Keep only the last character
		}

		const newCode = [...code];
		newCode[index] = text;
		setCode(newCode);

		// Automatically move to the next input if not the last input
		if (text && index < inputs.current.length - 1) {
			inputs.current[index + 1]?.focus();
		}
	};
	/**
	 * Handles the Backspace key event for the verification code inputs.
	 * If the Backspace key is pressed and the current input is empty,
	 * it moves the focus to the previous input if available.
	 *
	 * @param e - The key event object.
	 * @param index - The index of the current input.
	 */
	// Handle backspace to move focus to the previous input
	const handleBackspace = (e: any, index: number) => {
		if (e.nativeEvent.key === "Backspace" && code[index] === " ") {
			// Move focus to previous input if available
			if (index > 0) {
				inputs.current[index - 1]?.focus();
			}
		}
	};

	/**
	 * Validates the OTP code entered by the user.
	 *
	 * @returns {Promise<void>} A promise that resolves when the OTP code is successfully verified.
	 * @throws {Error} If there is an error while verifying the OTP code.
	 */
	const validateCode = async () => {
		const inputOtp = code.join(""); // Combine the code array into a single string

		try {
			// Use Supabase's auth.verifyOtp method to verify the code
			const { error } = await supabase.auth.verifyOtp({
				email, // User's email
				token: inputOtp, // OTP code entered by the user
				type: "signup", // The type of verification (can be 'signup', 'recovery', etc.)
			});

			if (error) {
				Alert.alert("Error", error.message);
			} else {
				router.push("/(auth)/signin");
			}
		} catch (err) {
			Alert.alert("Error", "Failed to verify OTP. Please try again.");
			console.error("Failed to verify OTP:", err);
		}
	};

	// Effect to handle timer countdown
	useEffect(() => {
		if (timer > 0) {
			const intervalId = setInterval(() => {
				setTimer((prevTimer) => prevTimer - 1);
			}, 1000);
			return () => clearInterval(intervalId);
		} else {
			setCanResend(true); // Enable resend button when timer reaches zero
		}
	}, [timer]);

	/**
	 * Handles the resend code functionality.
	 *
	 * This function disables the resend button after clicking, resets the timer to 60 seconds,
	 * and sends a new code to the user's email using the signInWithOtp method from the supabase.auth object.
	 *
	 * @returns {Promise<void>} A promise that resolves when the code is successfully resent or rejects with an error.
	 */
	const handleResendCode = async () => {
		setCanResend(false); // Disable resend button after clicking
		setTimer(60); // Reset timer to 60 seconds

		try {
			const { error } = await supabase.auth.signInWithOtp({ email });
			if (error) {
				Alert.alert("Error", error.message);
			} else {
				Alert.alert("Success", "A new code has been sent to your email!");
			}
		} catch (err) {
			Alert.alert("Error", "Failed to resend OTP. Please try again.");
			console.error("Failed to resend OTP:", err);
		}
	};

	return (
		<GestureHandlerRootView>
			<SafeAreaView style={styles.container}>
				<Text style={styles.headerText}>Enter confirmation code </Text>
				<Text style={styles.headerDesc}>
					A 4-digit code was sent to {"\n"} {email}
				</Text>
				<View style={styles.formContainer}>
					{[0, 1, 2, 3, 4, 5].map((index) => (
						<TextInput
							key={index}
							style={styles.input}
							maxLength={1}
							value={code[index]}
							onChangeText={(text) => handleChange(text, index)}
							onKeyPress={(e) => handleBackspace(e, index)}
							ref={(ref) => {
								inputs.current[index] = ref as TextInput;
							}}
						/>
					))}
				</View>

				<Text style={styles.timerText}>
					{timer > 0 ? `Resend code in ${timer}s` : "You can resend the code now."}
				</Text>

				{/* Resend Code Button */}
				{canResend && (
					<TouchableOpacity onPress={handleResendCode}>
						<Text style={styles.resendCode}>Resend Code</Text>
					</TouchableOpacity>
				)}

				<TouchableOpacity
					style={styles.button}
					onPress={validateCode}>
					<Text style={styles.buttonText}>Continue</Text>
				</TouchableOpacity>
			</SafeAreaView>
		</GestureHandlerRootView>
	);
};

export default Verification;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-between",
		fontFamily: "Poppins",
		padding: 20,
	},

	formContainer: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
		marginTop: 20,
		gap: 10,
		flexDirection: "row",
	},

	headerText: {
		fontSize: 25,
		fontWeight: "bold",
		fontFamily: "Poppins",
		textAlign: "center",
		marginTop: 40,
	},
	headerDesc: {
		fontSize: 17,
		color: "#ccc",
		marginBottom: 20,
		alignSelf: "center",
		fontWeight: "bold",
	},

	input: {
		height: 45,
		width: 45,
		borderColor: "#ccc",
		borderWidth: 2,
		borderRadius: 10,
		paddingHorizontal: 10,
		marginBottom: 20,
		display: "flex",
		backgroundColor: "#f9f9f9",
		textAlign: "center",
		fontSize: 20,
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

	buttonText: {
		fontSize: 15,
		textAlign: "center",
		color: "white",
		fontWeight: "bold",
	},

	resendCode: {
		fontSize: 15,
		textAlign: "center",
		color: "blue",
		fontWeight: "bold",
	},
	timerText: {
		fontSize: 15,
		textAlign: "center",
		color: "grey",
		marginTop: 10,
	},
});
