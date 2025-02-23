import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Asset } from "expo-asset";
import { Alert, Platform } from "react-native";
import { Podcast } from "@/data/dummy";

export const useDownload = () => {
  const downloadPodcast = async (podcast: Podcast) => {
    if (!podcast) return;

    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Cannot save the file without permission.");
        return;
      }

      let uri = podcast.audio;

      // Handle local files
      if (typeof uri !== "string") {
        const asset = Asset.fromModule(uri);
        await asset.downloadAsync();
        uri = asset.localUri;
      }

      if (!uri) {
        Alert.alert("Error", "No audio source found.");
        return;
      }

      const fileName = `${podcast.title}.mp3`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Check if the URI is remote or local
      if (uri.startsWith("http")) {
        await FileSystem.downloadAsync(uri, fileUri);
      } else if (uri.startsWith("file://")) {
        await FileSystem.copyAsync({ from: uri, to: fileUri });
      } else {
        Alert.alert("Unsupported URI", "The audio source is invalid.");
        return;
      }

      // Save to Media Library
      const asset = await MediaLibrary.createAssetAsync(fileUri);

      if (Platform.OS === "android") {
        // Use Downloads folder on Android
        const album = await MediaLibrary.getAlbumAsync("Download");
        if (album == null) {
          await MediaLibrary.createAlbumAsync("Download", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      } else {
        // iOS: Simply create asset
        await MediaLibrary.createAlbumAsync("Downloads", asset, false);
      }

      Alert.alert("Success", "Podcast downloaded to your phone!");
    } catch (error:any) {
      console.error("Download failed:", error);
      Alert.alert("Download Failed", error.message || "Something went wrong.");
    }
  };

  return { downloadPodcast };
};
