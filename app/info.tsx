import { SetStateAction, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	Alert,
	Button,
	Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType, useCameraPermissions } from "expo-camera";
import { Link, useRouter } from "expo-router";

import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import LoadingDots from "@/components/extras/loading";
import React from "react";

interface CaptureSignatureProps {
	onImageCaptured: (uri: string) => void;
}

function CaptureSignature({ onImageCaptured }: CaptureSignatureProps) {
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();
	const [cameraRef, setCameraRef] = useState<typeof Camera | null>(null);

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View style={styles.cameraContainer}>
				<Text style={styles.message}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title="Grant Permission" />
			</View>
		);
	}

	const captureImage = async () => {
		if (cameraRef) {
			const { uri } = await cameraRef.takePictureAsync();
			onImageCaptured(uri); // Pass the captured image URI to the parent
		}
	};

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	return (
		<View style={styles.cameraContainer}>
			<Camera
				style={styles.camera}
				type={facing}
				ref={(ref) => setCameraRef(ref)}
			>
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
						<Text style={styles.text}>Flip Camera</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={captureImage}>
						<Text style={styles.text}>Capture</Text>
					</TouchableOpacity>
				</View>
			</Camera>
		</View>
	);
}

function InputComponent() {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<View>
			<TextInput
				style={[styles.inputBox, isFocused && styles.inputBoxFocused]}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				placeholder="Type here..."
			/>
		</View>
	);
}

export default function InfoScreen() {
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isCapturing, setIsCapturing] = useState(false); // Track whether to show the camera
	const router = useRouter();

	const handleSaving = () => {
		setIsSaving(true);

		// After 3 seconds, navigate to "/analyze"
		setTimeout(() => {
			setIsSaving(false);
			router.push("/analyze"); // Use `router.push` for navigation
		}, 3000);
	};

	const handleImageCaptured = (uri: string) => {
		setImageUri(uri);
		setIsCapturing(false); // Hide the camera after capturing
	};

	const handleUploadImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImageUri(result.uri); // Set the image URI
		}
	};
	return (
		<View style={styles.container}>
			<View style={styles.backButtonContainer}>
				<Link href="/menu">
					<MaterialIcons name="arrow-back-ios" size={30} color="black" />
				</Link>
			</View>
			<Text style={styles.title}>Signature Information</Text>
			<Text style={styles.desc}>
				Provide basic information about the signature
			</Text>

			{/* Form */}
			<View style={styles.form}>
				<View style={styles.distinct}>
					<Text style={styles.inputTitle}>Title</Text>
					<InputComponent />
				</View>
				<View style={styles.distinct}>
					<Text style={styles.inputTitle}>Author</Text>
					<InputComponent />
				</View>

				{/* Original Signature upload =================================== */}
				<View style={styles.distinct}>
					<Text style={styles.inputTitle}>Original Signature</Text>
					{isCapturing ? (
						<CaptureSignature onImageCaptured={handleImageCaptured} />
					) : (
						<View style={styles.buttonContainer}>
							<TouchableOpacity
								style={styles.button}
								onPress={() => setIsCapturing(true)}
							>
								<SimpleLineIcons name="camera" size={20} color="#9E9E9E" />
								<Text style={styles.buttonText}>Take a photo</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={handleUploadImage}
							>
								<FontAwesome5 name="file-image" size={20} color="#9E9E9E" />
								<Text style={styles.buttonText}>Upload Signature</Text>
							</TouchableOpacity>
						</View>
					)}
					{imageUri && (
						<Image source={{ uri: imageUri }} style={styles.imagePreview} />
					)}
				</View>
				{/* End of original signature */}

				{/* Reference/Scanned Signature Upload ======================== */}
				<View style={styles.distinct}>
					<Text style={styles.inputTitle}>Scanned Signature</Text>
					{isCapturing ? (
						<CaptureSignature onImageCaptured={handleImageCaptured} />
					) : (
						<View style={styles.buttonContainer}>
							<TouchableOpacity
								style={styles.button}
								onPress={() => setIsCapturing(true)}
							>
								<SimpleLineIcons name="camera" size={20} color="#9E9E9E" />
								<Text style={styles.buttonText}>Take a photo</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={handleUploadImage}
							>
								<FontAwesome5 name="file-image" size={20} color="#9E9E9E" />
								<Text style={styles.buttonText}>Upload Signature</Text>
							</TouchableOpacity>
						</View>
					)}
					{imageUri && (
						<Image source={{ uri: imageUri }} style={styles.imagePreview} />
					)}
				</View>
				{/* End of scanned signature upload ================== */}
				<TouchableOpacity
					style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
					onPress={handleSaving}
					disabled={isSaving}
				>
					<Text style={styles.saveButtonText}>
						{isSaving ? "Saving" : "Save & Proceed"}
					</Text>
					{isSaving && <LoadingDots />}
				</TouchableOpacity>
			</View>
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
		paddingVertical: 30,
		paddingHorizontal: 20,
	},
	backButtonContainer: {
		marginVertical: 5,
	},
	title: {
		fontSize: 20,
		fontFamily: "PoppinsLarge",
		paddingTop: 15,
		paddingBottom: 5,
	},
	desc: {
		fontSize: 15,
		fontFamily: "PoppinsMedium",
		color: "#71727A",
		marginBottom: 20,
	},
	form: {
		flex: 1,
		flexDirection: "column",
		gap: 30,
		width: "100%",
		marginVertical: 10,
	},
	distinct: {
		flexDirection: "column",
		gap: 6,
	},
	inputTitle: {
		fontFamily: "PoppinsLarge",
		color: "#2F3036",
		fontSize: 15,
	},
	inputBox: {
		borderWidth: 1,
		borderColor: "#C5C6CC",
		borderRadius: 10,
		paddingHorizontal: 10,
		paddingVertical: 15,
		width: "100%",
	},
	inputBoxFocused: {
		borderColor: "#006FFD",
		borderWidth: 2,
	},
	cameraContainer: {
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
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 10,
	},
	button: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 15,
		backgroundColor: "#E7E7E7",
		borderColor: "#B9B9B9",
		borderWidth: 1,
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	text: {
		color: "white",
		fontSize: 16,
	},
	buttonText: {
		color: "#9E9E9E",
		fontSize: 15,
		fontFamily: "Poppins",
	},
	imagePreview: {
		width: 100,
		height: 100,
		marginTop: 20,
		resizeMode: "cover",
	},
	saveButton: {
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
		marginTop: 20,
	},
	saveButtonDisabled: {
		backgroundColor: "#59A1FC",
	},
	saveButtonText: {
		color: "white",
		textAlign: "center",
		fontSize: 16,
	},
});
