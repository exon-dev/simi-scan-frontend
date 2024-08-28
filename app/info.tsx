import { SetStateAction, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
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
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					padding: 20,
				}}>
				<Text style={{ textAlign: "center", marginBottom: 10 }}>
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
			const { uri } = await cameraRef.takePictureAsync();
			onImageCaptured(uri);
		}
	};

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	return (
		<View style={{ flex: 1, justifyContent: "center" }}>
			<Camera
				style={{ flex: 1 }}
				type={facing}
				ref={(ref) => setCameraRef(ref)}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						padding: 16,
					}}>
					<TouchableOpacity
						style={{
							flex: 1,
							alignItems: "center",
							padding: 10,
							backgroundColor: "#ccc",
							borderRadius: 10,
						}}
						onPress={toggleCameraFacing}>
						<Text style={{ color: "white", fontSize: 18 }}>Flip Camera</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							flex: 1,
							alignItems: "center",
							padding: 10,
							backgroundColor: "#ccc",
							borderRadius: 10,
						}}
						onPress={captureImage}>
						<Text style={{ color: "white", fontSize: 18 }}>Capture</Text>
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
		<View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
			<View style={{ marginBottom: 10 }}>
				<Link href='/menu'>
					<MaterialIcons
						name='arrow-back-ios'
						size={30}
						color='black'
					/>
				</Link>
			</View>
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
				<View style={{ gap: 5 }}>
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
					{imageUri && (
						<Image
							source={{ uri: imageUri }}
							style={{ width: 96, height: 96, marginTop: 10, resizeMode: "cover" }}
						/>
					)}
				</View>

				{/* Reference/Scanned Signature Upload */}
				<View style={{ gap: 5 }}>
					<Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
						Scanned Signature
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
					{imageUri && (
						<Image
							source={{ uri: imageUri }}
							style={{ width: 96, height: 96, marginTop: 10, resizeMode: "cover" }}
						/>
					)}
				</View>

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
