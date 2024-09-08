import { SetStateAction, useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	Button,
	Image,
	StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import LoadingDots from "@/components/extras/loading";
import React from "react";

// CaptureSignature Component
interface CaptureSignatureProps {
	onImageCaptured: (uri: string) => void;
}

function CaptureSignature({ onImageCaptured }: CaptureSignatureProps) {
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();

	if (!permission) {
		return <View />;
	}

	console.log(permission.granted);

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					We need your permission to show the camera
				</Text>
				<Button
					onPress={requestPermission}
					title='Grant Permission'
				/>
			</View>
		);
	}

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	return (
		<View style={styles.container}>
			<CameraView
				style={styles.camera}
				facing={facing}>
				<View style={styles.buttonContainer}>
					<Button
						title='Flip Camera'
						onPress={toggleCameraFacing}
					/>
				</View>
			</CameraView>
		</View>
	);
}

// InputComponent for Title and Author
function InputComponent() {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<View>
			<TextInput
				style={{
					borderWidth: isFocused ? 2 : 1,
					borderColor: isFocused ? "#1E90FF" : "#ccc",
					borderRadius: 10,
					padding: 10,
					width: "100%",
				}}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				placeholder='Type here...'
			/>
		</View>
	);
}

// Main InfoScreen Component
export default function InfoScreen() {
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isCapturing, setIsCapturing] = useState(false);
	const router = useRouter();

	const handleSaving = () => {
		setIsSaving(true);
		setTimeout(() => {
			setIsSaving(false);
			router.push("/analyze");
		}, 3000);
	};

	const handleImageCaptured = (uri: string) => {
		setImageUri(uri);
		setIsCapturing(false);
	};

	const handleUploadImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImageUri(result.assets[0].uri);
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: "white", padding: 24 }}>
			{/* Back Button */}
			<View style={{ marginBottom: 10, marginTop: 30 }}>
				<TouchableOpacity
					onPress={() => {
						router.push("/menu");
					}}>
					<MaterialIcons
						name='arrow-back-ios'
						size={30}
						color='black'
					/>
				</TouchableOpacity>
			</View>
			{/* Screen Title */}
			<Text
				style={{
					fontSize: 24,
					fontWeight: "600",
					paddingTop: 10,
					paddingBottom: 5,
				}}>
				Signature Information
			</Text>
			<Text style={{ fontSize: 18, color: "#6e6e6e", marginBottom: 20 }}>
				Provide basic information about the signature
			</Text>

			{/* Form */}
			<View style={{ flex: 1, marginTop: 10, gap: 20 }}>
				<View style={{ gap: 5 }}>
					<Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
						Title
					</Text>
					<InputComponent />
				</View>
				<View style={{ gap: 5 }}>
					<Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
						Author
					</Text>
					<InputComponent />
				</View>

				{/* Original Signature upload */}
				<View style={{ gap: 10 }}>
					<Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
						Original Signature
					</Text>
					{isCapturing ? (
						<CaptureSignature onImageCaptured={handleImageCaptured} />
					) : (
						<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
							<TouchableOpacity
								style={{
									flex: 1,
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "#ccc",
									borderRadius: 10,
									padding: 10,
								}}
								onPress={() => setIsCapturing(true)}>
								<SimpleLineIcons
									name='camera'
									size={20}
									color='#9E9E9E'
								/>
								<Text style={{ color: "#666", marginLeft: 5 }}>Take a photo</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									flex: 1,
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "#ccc",
									borderRadius: 10,
									padding: 10,
								}}
								onPress={handleUploadImage}>
								<FontAwesome5
									name='file-image'
									size={20}
									color='#9E9E9E'
								/>
								<Text style={{ color: "#666", marginLeft: 5 }}>Upload Signature</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>

				{/* Save/Analyze Button */}
				<TouchableOpacity
					style={{
						width: "100%",
						backgroundColor: "#0A74DA",
						padding: 15,
						borderRadius: 10,
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "row",
						gap: 10,
						marginTop: 20,
					}}
					disabled={isSaving}
					onPress={handleSaving}>
					{isSaving ? (
						<LoadingDots />
					) : (
						<Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>
							Analyze Signature
						</Text>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		margin: 64,
	},
});
