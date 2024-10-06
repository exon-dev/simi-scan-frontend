import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useLocalSearchParams } from "expo-router";
import LoadingDots from "@/components/extras/loading";
import { SafeAreaView } from "react-native-safe-area-context";
import supabase from "@/lib/supabase";
import { SignatureInfoProps } from "@/types/global";
import { useSessionStore } from "@/store/session";
import { Svg, Circle } from "react-native-svg";
import * as FileSystem from "expo-file-system";

const convertBase64ToImageSource = (base64String: string) => {
	return `data:image/png;base64,${base64String}`;
};

const DonutChart = ({ index }: { index: number }) => {
	const radius = 80;
	const strokeWidth = 15;
	const normalizedRadius = radius - strokeWidth / 2;
	const circumference = normalizedRadius * 2 * Math.PI;
	const strokeDashoffset = circumference - (index / 100) * circumference;

	const dynamicColor = (index: number): string => {
		if (index <= 45) return "red";
		if (index > 45 && index <= 65) return "orange";
		if (index > 45 && index <= 75) return "yellow";
		if (index > 75) return "green";
		return "gray";
	};

	const chartColor = dynamicColor(index);

	return (
		<View className='relative flex items-center justify-center w-[250px] h-[250px]'>
			<Svg
				height={radius * 2}
				width={radius * 2}>
				<Circle
					stroke='#000'
					fill='none'
					cx={radius}
					cy={radius}
					r={normalizedRadius}
					strokeWidth={strokeWidth}
				/>
				<Circle
					stroke={chartColor}
					fill='none'
					cx={radius}
					cy={radius}
					r={normalizedRadius}
					strokeWidth={strokeWidth}
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap='round'
				/>
			</Svg>
			<View className='absolute inset-0 flex items-center justify-center'>
				<Text className={`text-3xl font-bold text-${chartColor}-500`}>
					{index}%
				</Text>
				<Text className='font-semibold text-xs'>Similarity Index</Text>
			</View>
		</View>
	);
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
		handleDeleteSignature: () => {},
	});
	const [result, setResult] = useState({
		index: null,
		date: "",
	});

	const handlePress = async () => {
		setIsAnalyzing(true);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

		try {
			// change this url host sa inyo ipaddress, ayaw na ichange ang :5000/scan
			// make sure na ang ip address kay gikan sa Wireless LAN adapter Wi-Fi: ipv4 address
			// match this sa inyo server
			const url = `http://192.168.1.8:5000/scan`;

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify({
					original_signature: data.original_signature_url,
					scanned_signature: data.scanned_signature_url,
				}),
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				console.log(response);
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const result = await response.json();

			setResult({
				index: result.similarity_idx,
				date: result.date,
			});

			const { error } = await supabase.from("results").insert({
				similarity_index: result.similarity_idx,
				date_created: result.date,
				signature_id: id,
			});

			if (error) {
				console.error(error);
				return;
			}
		} catch (err) {
			//@ts-ignore
			Alert.alert("Network request failed:", err.message);
			//@ts-ignore
			console.error("Network request failed:", err.message);
			//@ts-ignore

			if (err.name === "AbortError") {
				console.error("Request timed out");
			} else {
				console.error("Fetch error:", err);
			}
		} finally {
			setIsAnalyzing(false);
		}
	};

	const labelIdentifier = (index: number): string => {
		if (index <= 45) return "Highly Likely Forged!";
		if (index > 45 && index <= 65) return "Likely Forged";
		if (index > 45 && index <= 70) return "Possibly Authentic";
		if (index > 70) return "Highly Authentic";
		return "Unknown Status";
	};

	const getResultIfExist = async () => {
		try {
			const { data, error } = await supabase
				.from("results")
				.select("*")
				.eq("signature_id", id);

			if (error) {
				Alert.alert("Error retrieving results");
				return;
			}

			if (data && data.length > 0) {
				setResult({
					index: data[0].similarity_index,
					date: data[0].date_created,
				});
			} else {
				console.log("No results found for the given signature_id");
			}
		} catch (err) {
			console.error(err);
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
					handleDeleteSignature: () => {},
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
		getResultIfExist();
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

			{result.index !== null && (
				<View className='w-full flex-1 items-center place-items-center'>
					<DonutChart index={result.index as unknown as number} />
					<View className='flex flex-row justify-center items-center'>
						<Text>Label: </Text>
						<Text className='text-lg font-bold'>
							{labelIdentifier(result.index as unknown as number)}
						</Text>
					</View>
					<Text
						style={{
							borderRadius: 10,
							shadowColor: "#000",
							shadowOffset: {
								width: 0,
								height: 2,
							},
							shadowOpacity: 0.25,
							shadowRadius: 3.84,
							elevation: 5,
							paddingHorizontal: 15,
							paddingVertical: 10,
							marginTop: 20,
							width: "100%",
							borderWidth: 1,
							borderColor: "gray",
							color: "black",
							textAlign: "center",
							fontWeight: "bold",
							fontSize: 16,
						}}>
						{(result.index as unknown as number) <= 45
							? "⚠️ Warning: The signature is highly likely to be forged. Please report this to the authorities."
							: (result.index as unknown as number) > 45 &&
								  (result.index as unknown as number) <= 65
								? "⚠️ Caution: The signature is likely to be forged. Further verification is recommended."
								: (result.index as unknown as number) > 65 &&
									  (result.index as unknown as number) <= 75
									? "⚠️ Notice: The signature is possibly authentic but requires further verification."
									: (result.index as unknown as number) > 75
										? "✅ Success: The signature is verified as original and authentic."
										: "Unknown Status"}
					</Text>
				</View>
			)}
		</SafeAreaView>
	);
};

export default RootLayout;
