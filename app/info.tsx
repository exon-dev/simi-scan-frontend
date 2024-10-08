import { SetStateAction, useState, useEffect, useRef, Dispatch } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	Button,
	Image,
	StyleSheet,
	Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraView, CameraType, FlashMode, CameraMode } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import LoadingDots from "@/components/extras/loading";
import React from "react";
import supabase from "@/lib/supabase";
import { useSessionStore } from "@/store/session";

// CaptureSignature Component
interface CaptureSignatureProps {
	onImageCaptured: (uri: string) => void;
}

function CaptureSignature({ onImageCaptured }: CaptureSignatureProps) {
	const cameraRef = useRef<CameraView>(null);
	const [cameraMode, setCameraMode] = useState<CameraMode>("picture");
	const [cameraFlash, setCameraFlash] = useState<FlashMode>("off");
	const [cameraFacing, setCameraFacing] = useState<CameraType>("back");
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [picture, setPicture] = useState<string | null>(null);

	const handleTakePicture = async () => {
		if (cameraMode === "picture") {
			const response = await cameraRef.current?.takePictureAsync({});
			if (response?.uri) {
				setPicture(response.uri);
				onImageCaptured(response.uri);
			}
		} else if (cameraMode === "video") {
			if (isRecording) {
				cameraRef.current?.stopRecording();
				setIsRecording(false);
			} else {
				setIsRecording(true);
				const response = await cameraRef.current?.recordAsync();
				if (response?.uri) {
					// handle video URL if needed
				}
			}
		}
	};

	const toggleCameraFacing = () => {
		setCameraFacing((current) => (current === "back" ? "front" : "back"));
	};

	return (
		<View style={styles.cameraContainer}>
			<CameraView
				ref={cameraRef}
				style={[styles.camera]}
				facing={cameraFacing}
				mode={cameraMode}
				flash={cameraFlash}>
				<View style={styles.buttonContainer}>
					<Button
						title={cameraMode === "picture" ? "Take Picture" : "Record Video"}
						onPress={handleTakePicture}
					/>
				</View>
			</CameraView>
		</View>
	);
}

interface InputProps {
	stateInput: Dispatch<SetStateAction<string>>;
}

function InputComponent({ stateInput }: InputProps) {
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
				onChangeText={stateInput}
			/>
		</View>
	);
}

// Main InfoScreen Component
export default function InfoScreen() {
	//@ts-ignore
	const { session } = useSessionStore();
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [firstImageUri, setFirstImageUri] = useState<string | null>(null);
	const [secondImageUri, setSecondImageUri] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isCapturing, setIsCapturing] = useState(false);
	const [isCapturingTwo, setIsCapturingTwo] = useState(false);
	const router = useRouter();

	const handleSaving = async () => {
		if (!title || !author || !firstImageUri || !secondImageUri) {
			Alert.alert("Please provide all data needed");
			return;
		}

		setIsSaving(true);
		try {
			const firstImageBase64 = await FileSystem.readAsStringAsync(firstImageUri, {
				encoding: FileSystem.EncodingType.Base64,
			});

			const secondImageBase64 = await FileSystem.readAsStringAsync(
				secondImageUri,
				{
					encoding: FileSystem.EncodingType.Base64,
				}
			);

			const { data, error } = await supabase
				.from("signature_infos")
				.insert({
					user_id: session.id,
					title: title,
					author: author,
					original_signature_url: firstImageBase64,
					scanned_signature_url: secondImageBase64,
				})
				.select("signature_id");

			if (error) {
				Alert.alert(
					"Error saving signature information to database. Please try again."
				);
				return;
			}

			Alert.alert("Signature information successfully saved!");

			setTimeout(() => {
				router.push(`/analyze/${data[0].signature_id}`);
			}, 1500);

			return;
		} catch (err) {
			console.error(err);
			Alert.alert("Error saving signature details. Pleas try again");
			return;
		}
	};

	const handleFirstImageCapture = (uri: string) => {
		setFirstImageUri(uri);
		setIsCapturing(false);
	};

	const handleSecondImageCapture = (uri: string) => {
		setSecondImageUri(uri);
		setIsCapturingTwo(false);
	};

	const handleUploadImage = async (pos: number) => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled)
			pos == 1
				? setFirstImageUri(result.assets[0].uri)
				: setSecondImageUri(result.assets[0].uri);
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
					<InputComponent stateInput={setTitle} />
				</View>
				<View style={{ gap: 5 }}>
					<Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
						Author
					</Text>
					<InputComponent stateInput={setAuthor} />
				</View>

				{/* Original Signature upload */}
				<View style={{ gap: 10 }}>
					<Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
						Original Signature
					</Text>
					{firstImageUri ? (
						<Image
							src={firstImageUri}
							resizeMode='contain'
							style={{
								width: "100%",
								height: 100,
							}}
						/>
					) : (
						<View className='h-24'></View>
					)}
					{isCapturing ? (
						<CaptureSignature onImageCaptured={handleFirstImageCapture} />
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
								onPress={() => handleUploadImage(1)}>
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

				{/* Scanned signature */}
				<View style={{ gap: 10 }}>
					<Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
						Scanned Signature Copy
					</Text>
					{secondImageUri ? (
						<Image
							src={secondImageUri}
							resizeMode='contain'
							style={{
								width: "100%",
								height: 100,
							}}
						/>
					) : (
						<View className='h-24'></View>
					)}
					{isCapturingTwo ? (
						<CaptureSignature onImageCaptured={handleSecondImageCapture} />
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
								onPress={() => setIsCapturingTwo(true)}>
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
								onPress={() => handleUploadImage(2)}>
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
							Save Signature
						</Text>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	cameraContainer: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1,
		top: 40,
	},
	camera: {
		width: 300,
		height: 120,
	},
	buttonContainer: {
		position: "absolute",
		bottom: 20,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		color: "#FFF",
	},
});
