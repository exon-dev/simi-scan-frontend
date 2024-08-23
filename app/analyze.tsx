import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import LoadingDots from "@/components/extras/loading";

export default function AnalyzeScreen() {
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const handlePress = () => {
		setIsAnalyzing(true);
	};

	return (
		<View style={styles.container}>
			<View style={styles.backButtonContainer}>
				<Link href='/info'>
					<MaterialIcons
						name='arrow-back-ios'
						size={30}
						color='black'
					/>
				</Link>
			</View>
			<Text style={styles.title}>President Signature</Text>
			<View style={styles.imagesContainer}>
				<Image
					source={{ uri: "https://via.placeholder.com/150" }}
					style={styles.image}
				/>
				<Image
					source={{ uri: "https://via.placeholder.com/150" }}
					style={styles.image}
				/>
			</View>
			<TouchableOpacity
				style={[styles.button, isAnalyzing && styles.buttonDisabled]}
				onPress={handlePress}
				disabled={isAnalyzing}>
				<Text style={styles.buttonText}>
					{isAnalyzing ? "Analyzing" : "Analyze"}
				</Text>
				{isAnalyzing && <LoadingDots />}
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#FFF",
		flex: 1,
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		paddingVertical: 40,
		paddingHorizontal: 30,
	},
	backButtonContainer: {
		marginVertical: 10,
	},
	title: {
		fontSize: 25,
		fontFamily: "PoppinsLarge",
		paddingVertical: 20,
	},
	imagesContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
		gap: 15,
	},
	image: {
		width: 170,
		height: 170,
		borderRadius: 10,
		borderWidth: 4,
		borderColor: "#CACACA",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	button: {
		backgroundColor: "#006FFD",
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 20,
		width: "100%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	buttonDisabled: {
		backgroundColor: "#59A1FC",
	},
	buttonText: {
		color: "white",
		textAlign: "center",
		fontSize: 16,
	},
});
