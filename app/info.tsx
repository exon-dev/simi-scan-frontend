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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType, useCameraPermissions } from "expo-camera";
import { Link } from "expo-router";

function CaptureSignature() {
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();
	const [cameraRef, setCameraRef] = useState(null);

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View style={styles.cameraContainer}>
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

	const captureImage = async () => {
		if (cameraRef) {
			// const { uri } = await cameraRef.takePictureAsync();
			// onImageCaptured(uri);
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
				ref={(ref: SetStateAction<null>) => setCameraRef(ref)}>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={toggleCameraFacing}>
						<Text style={styles.text}>Flip Camera</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.button}
						onPress={captureImage}>
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
				placeholder='Type here...'
			/>
		</View>
	);
}

export default function InfoScreen() {
	const [imageUri, setImageUri] = useState<string | null>(null);

	const handleImageCaptured = (uri: string) => {
		setImageUri(uri);
	};

	const handleUploadImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			// setImageUri(result);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.backButtonContainer}>
				<Link href='/menu'>
					<MaterialIcons
						name='arrow-back-ios'
						size={30}
						color='black'
					/>
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
				<View style={styles.distinct}>
					<Text style={styles.inputTitle}>Original Signature</Text>
					{/* <CaptureSignature onImageCaptured={handleImageCaptured} /> */}

					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={styles.button}
							onPress={handleUploadImage}>
							<Text style={styles.buttonText}>Upload Image</Text>
						</TouchableOpacity>
					</View>
					{imageUri && (
						<Image
							source={{ uri: imageUri }}
							style={styles.imagePreview}
						/>
					)}
				</View>
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
		margin: 20,
	},
	button: {
		backgroundColor: "#006FFD",
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	text: {
		color: "white",
		fontSize: 16,
	},
	buttonText: {
		color: "#FFF",
		fontSize: 16,
	},
	imagePreview: {
		width: 100,
		height: 100,
		marginTop: 20,
		resizeMode: "cover",
	},
});
