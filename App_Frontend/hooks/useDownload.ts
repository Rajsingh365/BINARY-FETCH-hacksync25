import { useState } from "react";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert, Platform } from "react-native";
import { Podcast } from "@/context/GlobalProvider";

export const useDownload = () => {
  const [downloading, setDownloading] = useState(false);

  const downloadPodcast = async (podcast: Podcast) => {
    if (!podcast) return;

    try {
      setDownloading(true);

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Cannot save the file without permission.");
        return;
      }

      let uri = podcast.audioUrl;

      const fileName = `${podcast.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.mp3`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      // Handle download
      if (uri.startsWith("http")) {
        const downloadResumable = FileSystem.createDownloadResumable(uri, fileUri);
        const downloadResult = await downloadResumable.downloadAsync();
      
        if (!downloadResult || !downloadResult.uri) {
          Alert.alert("Error", "Failed to download the file.");
          return;
        }
      
        const downloadedUri = downloadResult.uri;
      } else if (uri.startsWith("file://")) {
        await FileSystem.copyAsync({ from: uri, to: fileUri });
      } else {
        Alert.alert("Unsupported URI", "The audio source is invalid.");
        return;
      }

      // Verify file
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        Alert.alert("Error", "Downloaded file not found.");
        return;
      }

      // Save to Media Library
      const asset = await MediaLibrary.createAssetAsync(fileUri);

      if (Platform.OS === "android") {
        const album = await MediaLibrary.getAlbumAsync("Download");
        if (!album) {
          await MediaLibrary.createAlbumAsync("Download", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      } else {
        await MediaLibrary.createAlbumAsync("Downloads", asset, false);
      }

      Alert.alert("Success", "Podcast downloaded to your phone!");
    } catch (error: any) {
      console.error("Download failed:", error);
      Alert.alert("Download Failed", error.message || "Something went wrong.");
    } finally {
      setDownloading(false);
    }
  };

  return { downloadPodcast, downloading };
};
