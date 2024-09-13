import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useLocalSearchParams } from "expo-router";
import LoadingDots from "@/components/extras/loading";
import { SafeAreaView } from "react-native-safe-area-context";
import supabase from "@/lib/supabase";
import { SignatureInfoProps } from "@/types/global";
import { useSessionStore } from "@/store/session";

const convertBase64ToImageSource = (base64String: string) => {
	return `data:image/png;base64,${base64String}`;
};

const RootLayout = () => {
	const { id } = useLocalSearchParams();
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	//@ts-ignore
	const { session } = useSessionStore();
	const [data, setData] = useState<SignatureInfoProps>({
		signature_id: 0,
		title: "",
		author: "",
		created_at: "",
		original_signature_url: "",
		scanned_signature_url: "",
	});
	const [result, setResult] = useState({
		index: null,
		threshold: null,
		date: ""
	})

	const handlePress = async () => {
		setIsAnalyzing(true);

		try {
			const response = await fetch(`http://192.168.1.7:5000/scan`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify({
					original_signature: data.original_signature_url,
					scanned_signature: data.scanned_signature_url,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const result = await response.json();
			
			setResult({
				index: result.similarity_idx,
				threshold: result.threshold_val,
				date: result.date
			})

		} catch (err) {
			//@ts-ignore
			console.error("Network request failed:", err.message);
			//@ts-ignore

			if (err.response) {
				//@ts-ignore
				console.error("Error Response:", err.response);
			}
			//@ts-ignore
			if (err.stack) {
				//@ts-ignore
				console.error("Error Stack:", err.stack);
			}
		} finally {
			setIsAnalyzing(false);
		}
	};

	const getSignature = async () => {
		console.log(id);
		try {
			const { data, error } = await supabase
				.from("signature_infos")
				.select("*")
				.eq("signature_id", id);

			if (error) {
				Alert.alert("Error retrieving data");
				return;
			}

			if (data && data.length > 0) {
				const signatureData = data[0];
				setData({
					signature_id: signatureData.signature_id,
					title: signatureData.title || "",
					author: signatureData.author || "",
					original_signature_url: signatureData.original_signature_url || "",
					scanned_signature_url: signatureData.scanned_signature_url || "",
					created_at: signatureData.created_at || "",
				});
			} else {
				Alert.alert("No signature found");
			}
		} catch (err) {
			Alert.alert("Error retrieving data");
			return;
		}
	};

	useEffect(() => {
		getSignature();
	}, []);

	return (
		<SafeAreaView className='bg-white flex-1 flex-col justify-start items-start py-10 px-8'>
			<View className='my-2'>
				<Link href='/menu'>
					<MaterialIcons
						name='arrow-back-ios'
						size={30}
						color='black'
					/>
				</Link>
			</View>
			<Text className='text-3xl font-bold font-poppins-semibold pt-5'>
				{data?.title}
			</Text>
			<Text className='text-lg font-PoppinsMedium font-regular'>
				Author: {data?.author}
			</Text>
			<View className='flex-row justify-between mb-5 gap-4 mt-2'>
				<Image
					source={{ uri: convertBase64ToImageSource(data.original_signature_url) }}
					style={{ width: 160, height: 100 }}
				/>
				<Image
					source={{ uri: convertBase64ToImageSource(data.scanned_signature_url) }}
					style={{ width: 160, height: 100 }}
				/>
			</View>
			<TouchableOpacity
				className={`bg-blue-600 rounded-lg py-2 px-5 w-full flex-row justify-center items-center gap-2 shadow-md ${
					isAnalyzing ? "bg-blue-400" : ""
				}`}
				onPress={handlePress}
				disabled={isAnalyzing}>
				<Text className='text-white text-lg text-center'>
					{isAnalyzing ? "Analyzing" : "Analyze"}
				</Text>
				{isAnalyzing && <LoadingDots />}
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default RootLayout;
