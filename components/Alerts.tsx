// Alerts.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface AlertProps {
	type: "success" | "error" | "warning" | "info";
	message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
	const getAlertStyle = () => {
		switch (type) {
			case "success":
				return styles.success;
			case "error":
				return styles.error;
			case "warning":
				return styles.warning;
			case "info":
				return styles.info;
			default:
				return styles.info;
		}
	};

	const getIconName = () => {
		switch (type) {
			case "success":
				return "check-circle";
			case "error":
				return "alert-circle";
			case "warning":
				return "alert";
			case "info":
				return "information";
			default:
				return "information";
		}
	};

	return (
		<View style={[styles.alert, getAlertStyle()]}>
			<MaterialCommunityIcons name={getIconName()} size={24} color="white" />
			<Text style={styles.message}>{message}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	alert: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	message: {
		marginLeft: 10,
		color: "white",
		fontSize: 16,
	},
	success: {
		backgroundColor: "#4CAF50",
	},
	error: {
		backgroundColor: "#F44336",
	},
	warning: {
		backgroundColor: "#FFEB3B",
	},
	info: {
		backgroundColor: "#2196F3",
	},
});

export default Alert;
