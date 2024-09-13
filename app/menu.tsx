import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	ScrollView,
	FlatList,
	TouchableWithoutFeedback,
	Image,
	Alert,
	TouchableOpacity,
	Button,
} from "react-native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import supabase from "@/lib/supabase";
import { useSessionStore } from "@/store/session";
import { useSignatureStore } from "@/store/signatures";
import { SignatureInfoProps } from "@/types/global";

const convertBase64ToImageSource = (base64String: string) => {
	return `data:image/png;base64,${base64String}`;
};

const Item = ({
	signature_id,
	title,
	author,
	original_signature_url,
	scanned_signature_url,
	created_at,
}: SignatureInfoProps) => {
	const imageSource = convertBase64ToImageSource(original_signature_url);

	return (
		<View className='flex mt-4'>
			<View className='flex-row justify-between items-center px-4 border-b border-zinc-300 pb-2'>
				<View className='flex-row gap-3'>
					<Image
						source={{ uri: imageSource }}
						style={{ width: 80, height: 50 }}
					/>
					<View className='flex-col items-start'>
						<Text className='text-md font-bold'>{title}</Text>
						<Text className='text-sm'>{author}</Text>
						<Text className='text-[10px]'>
							{new Date(created_at).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "2-digit",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
					</View>
				</View>
				<TouchableWithoutFeedback
					onPress={() => {
						router.push(`/analyze/${signature_id}`);
					}}>
					<Text
						style={{
							borderRadius: 100,
						}}
						className='bg-prim text-sm px-2 py-1 font-semibold text-white'>
						Open
					</Text>
				</TouchableWithoutFeedback>
			</View>
		</View>
	);
};

const MenuView = () => {
	//@ts-ignore
	const { signatures, setSignatures } = useSignatureStore();
	//@ts-ignore
	const { session, setSession } = useSessionStore();

	const handleLogout = async () => {
		try {
			Alert.alert(
				"Confirmation",
				"Are you sure you want to log out?",
				[
					{
						text: "Cancel",
						onPress: () => {
							return;
						},
						style: "cancel",
					},
					{
						text: "Logout",
						onPress: async () => {
							try {
								const { error } = await supabase.auth.signOut();

								if (error) {
									Alert.alert("Error logging out. Please try again in a moment.");
									return;
								}
								setSignatures([]);
								setSession({});
							} catch (err) {
								console.error(err);
							}
							router.push("/(auth)/signin");
						},
					},
				],
				{ cancelable: false }
			);
		} catch (err) {
			console.log(err);
		}
	};

	const navigateToInfo = () => {
		router.push("/info");
	};

	const getSignatures = async () => {
		const { data, error } = await supabase
			.from("signature_infos")
			.select("*")
			.eq("user_id", session.id);

		if (error) {
			console.error(error);
		}
		setSignatures(data || []);
	};

	useEffect(() => {
		if (!session.access_token) {
			router.push("/(auth)/signin");
		}
		
		getSignatures();
	}, []);

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<View className='flex-row justify-between items-center px-4 py-5'>
				<View className='flex-row items-center'>
					<View className='bg-blue-500 p-3 rounded-xl'>
						<AntDesign
							name='user'
							size={35}
							color='white'
						/>
					</View>
					<View className='ml-3'>
						<Text className='text-2xl font-semibold font-PoppinsMedium'>
							{session?.name}
						</Text>
						<Text className='text-gray-500 font-PoppinsLight text-sm'>Scanner</Text>
					</View>
				</View>
				<TouchableWithoutFeedback onPress={handleLogout}>
					<AntDesign
						name='logout'
						size={24}
						color='black'
					/>
				</TouchableWithoutFeedback>
			</View>
			<View className='px-4'>
				<Image
					source={require("../assets/images/card.png")}
					className='w-full h-56 object-cover rounded-md'
				/>
			</View>
			<View className='flex-row justify-between items-center px-4'>
				<Text className='font-PoppinsLarge font-extrabold text-xl'>
					Scanned Signatures
				</Text>
				<MaterialIcons
					name='arrow-drop-down'
					size={30}
					color='black'
				/>
			</View>

			{/* Map the scanned signatures using flatlist*/}
			<FlatList
				className='mt-4'
				data={signatures}
				renderItem={({ item }) => (
					<Item
						signature_id={item.signature_id}
						title={item.title}
						author={item.author}
						original_signature_url={item.original_signature_url}
						scanned_signature_url={item.scanned_signature_url}
						created_at={item.created_at}
					/>
				)}
				keyExtractor={(item) => item.signature_id.toString()}
			/>
			<View className='absolute bottom-0 w-full bg-prim rounded-t-2xl p-4 flex-row justify-center items-center'>
				<TouchableOpacity
					onPress={navigateToInfo}
					className='bg-blue-500 p-4 rounded-full flex-row items-center'>
					<FontAwesome5
						name='wpforms'
						size={24}
						color='white'
					/>
					<Text className='ml-3 text-white font-bold'>New Signature</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default MenuView;
