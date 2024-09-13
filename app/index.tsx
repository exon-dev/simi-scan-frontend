import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

const LandingPage = () => {
	const router = useRouter();

	const handlePress = () => {
		router.push("./(auth)/signin");
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.imgContainer}>
				<Image
					style={styles.cellPhone}
					contentFit='contain'
					source={require("../assets/images/extras/cellphone.png")}
				/>
				<Image
					style={styles.eye}
					contentFit='contain'
					source={require("../assets/images/extras/eye.png")}
				/>
				<Image
					style={styles.lock}
					contentFit='contain'
					source={require("../assets/images/extras/lock.png")}
				/>
			</View>

			<View style={styles.headerContainer}>
				<Text style={styles.headerText}>
					Simi<Text style={styles.spanText}>Scan</Text> {"\n"}
					<Text style={styles.spanText2}>Authenticate with Confidence:</Text>{" "}
					AI-Powered Signature Matching
				</Text>

				<TouchableOpacity
					style={styles.button}
					onPress={handlePress}>
					<Text style={styles.buttonText}>Get Started</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default LandingPage;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		position: "relative",
	},

	imgContainer: {
		flex: 1,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},

	cellPhone: {
		width: "100%",
		height: undefined,
		aspectRatio: 1,
		position: "absolute",
		left: -15,
		top: "10%",
	},

	eye: {
		height: 180,
		width: 180,
		position: "absolute",
		right: 0,
		top: 20,
	},

	lock: {
		height: 230,
		width: 230,
		position: "absolute",
		bottom: -120,
		right: -50,
		zIndex: 1,
	},

	headerContainer: {
		flex: 1,
		width: "100%",
		paddingHorizontal: 23,
		justifyContent: "flex-end",
		paddingBottom: 30,
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
		color: "white",
		fontWeight: "bold",
		fontSize: 20,
	},

	headerText: {
		fontSize: 40,
		fontWeight: "900",
		lineHeight: 38,
	},

	spanText: {
		color: "#007AFF",
	},

	spanText2: {
		fontSize: 30,
		fontWeight: "normal",
	},
});
