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
			<View className='flex-1 justify-center items-center p-5'>
				<Text className='text-center mb-2'>
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
			const { uri } = await cameraRef.getCameraPermissionsAsync();

			requestPermission(uri);
		}
	};

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	return (
		<View className='flex-1 justify-center'>
			<Camera
				style={{ flex: 1 }}
				type={facing}
				ref={(ref) => setCameraRef(ref)}>
				<View className='flex-row justify-between gap-2 p-4'>
					<TouchableOpacity
						className='flex-1 flex-row justify-center items-center bg-gray-200 border border-gray-400 rounded-lg py-2 px-4'
						onPress={toggleCameraFacing}>
						<Text className='text-white text-lg'>Flip Camera</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className='flex-1 flex-row justify-center items-center bg-gray-200 border border-gray-400 rounded-lg py-2 px-4'
						onPress={captureImage}>
						<Text className='text-white text-lg'>Capture</Text>
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
				className={`border rounded-lg px-3 py-4 w-full ${
					isFocused ? "border-blue-600 border-2" : "border-gray-300"
				}`}
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
		<View className='bg-white flex-1 p-8'>
			<View className='mb-2'>
				<Link href='/menu'>
					<MaterialIcons
						name='arrow-back-ios'
						size={30}
						color='black'
					/>
				</Link>
			</View>
			<Text className='text-2xl font-semibold pt-4 pb-2'>
				Signature Information
			</Text>
			<Text className='text-lg text-gray-500 mb-5'>
				Provide basic information about the signature
			</Text>

			{/* Form */}
			<View className='flex-1 space-y-8 mt-2'>
				<View className='space-y-1'>
					<Text className='text-lg font-semibold text-gray-800'>Title</Text>
					<InputComponent />
				</View>
				<View className='space-y-1'>
					<Text className='text-lg font-semibold text-gray-800'>Author</Text>
					<InputComponent />
				</View>

				{/* Original Signature upload =================================== */}
				<View className='space-y-1'>
					<Text className='text-lg font-semibold text-gray-800'>
						Original Signature
					</Text>
					{isCapturing ? (
						<CaptureSignature onImageCaptured={handleImageCaptured} />
					) : (
						<View className='flex-row justify-between gap-2'>
							<TouchableOpacity
								className='flex-1 flex-row justify-center items-center bg-gray-200 border border-gray-400 rounded-lg py-2 px-4'
								onPress={() => setIsCapturing(true)}>
								<SimpleLineIcons
									name='camera'
									size={20}
									color='#9E9E9E'
								/>
								<Text className='text-gray-600 ml-2'>Take a photo</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className='flex-1 flex-row justify-center items-center bg-gray-200 border border-gray-400 rounded-lg py-2 px-4'
								onPress={handleUploadImage}>
								<FontAwesome5
									name='file-image'
									size={20}
									color='#9E9E9E'
								/>
								<Text className='text-gray-600 ml-2'>Upload Signature</Text>
							</TouchableOpacity>
						</View>
					)}
					{imageUri && (
						<Image
							source={{ uri: imageUri }}
							className='w-24 h-24 mt-5 object-cover'
						/>
					)}
				</View>
				{/* End of original signature */}

				{/* Reference/Scanned Signature Upload ======================== */}
				<View className='space-y-1'>
					<Text className='text-lg font-semibold text-gray-800'>
						Scanned Signature
					</Text>
					{isCapturing ? (
						<CaptureSignature onImageCaptured={handleImageCaptured} />
					) : (
						<View className='flex-row justify-between gap-2'>
							<TouchableOpacity
								className='flex-1 flex-row justify-center items-center bg-gray-200 border border-gray-400 rounded-lg py-2 px-4'
								onPress={() => setIsCapturing(true)}>
								<SimpleLineIcons
									name='camera'
									size={20}
									color='#9E9E9E'
								/>
								<Text className='text-gray-600 ml-2'>Take a photo</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className='flex-1 flex-row justify-center items-center bg-gray-200 border border-gray-400 rounded-lg py-2 px-4'
								onPress={handleUploadImage}>
								<FontAwesome5
									name='file-image'
									size={20}
									color='#9E9E9E'
								/>
								<Text className='text-gray-600 ml-2'>Upload Signature</Text>
							</TouchableOpacity>
						</View>
					)}
					{imageUri && (
						<Image
							source={{ uri: imageUri }}
							className='w-24 h-24 mt-5 object-cover'
						/>
					)}
				</View>
				{/* End of scanned signature upload ================== */}
				<TouchableOpacity
					className={`w-full flex-row justify-center items-center gap-2 pt-2 pb-4 px-5 rounded-lg ${
						isSaving ? "bg-blue-400" : "bg-blue-600"
					} shadow-lg mt-5`}
					onPress={handleSaving}
					disabled={isSaving}>
					<Text className='text-white text-lg'>
						{isSaving ? "Saving" : "Save & Proceed"}
					</Text>
					{isSaving && <LoadingDots />}
				</TouchableOpacity>
			</View>
		</View>
	);
}
