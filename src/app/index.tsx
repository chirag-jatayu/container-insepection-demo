import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  Image,
  Modal,
  Dimensions,
  StatusBar,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type Photo = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_TYPES = [
  "20 FT Standard",
  "40 FT Standard",
  "40 FT High Cube",
  "45 FT High Cube",
];
export default function ContainerInspectionScreen() {
  const [containerNumber, setContainerNumber] = useState("SEKU4060927");

  const [containerType, setContainerType] = useState("40 FT High Cube");

  const [photos, setPhotos] = useState<Photo[]>([]);

  // Photo currently being viewed
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showContainerTypes, setShowContainerTypes] = useState(false);
  // -----------------------------------------
  // CAMERA
  // -----------------------------------------

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Camera Permission",
        "Please allow camera permission to capture inspection photos.",
      );

      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const photo = result.assets[0];

    const newPhoto: Photo = {
      uri: photo.uri,
      fileName: photo.fileName,
      mimeType: photo.mimeType,
    };

    setPhotos((currentPhotos) => [...currentPhotos, newPhoto]);
  };

  // -----------------------------------------
  // GALLERY
  // -----------------------------------------

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const selectedPhotos: Photo[] = result.assets.map((asset) => ({
      uri: asset.uri,
      fileName: asset.fileName,
      mimeType: asset.mimeType,
    }));

    setPhotos((currentPhotos) => [...currentPhotos, ...selectedPhotos]);
  };

  // -----------------------------------------
  // REMOVE PHOTO
  // -----------------------------------------

  const removePhoto = (index: number) => {
    Alert.alert("Remove Photo", "Do you want to remove this photo?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setPhotos((currentPhotos) =>
            currentPhotos.filter((_, photoIndex) => photoIndex !== index),
          );
        },
      },
    ]);
  };

  // -----------------------------------------
  // VIEW PHOTO
  // -----------------------------------------

  const viewPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  // -----------------------------------------
  // CLOSE PHOTO VIEWER
  // -----------------------------------------

  const closePhotoViewer = () => {
    setSelectedPhoto(null);
  };

  // -----------------------------------------
  // ANALYZE
  // -----------------------------------------

  const analyzeContainer = () => {
    if (photos.length === 0) {
      Alert.alert(
        "Photos Required",
        "Please capture or select at least one photo.",
      );

      return;
    }

    Alert.alert(
      "Ready for Analysis",
      `Container ${containerNumber} is ready for AI inspection with ${photos.length} photo(s).`,
    );
  };

  // -----------------------------------------
  // BACK
  // -----------------------------------------

  const handleBack = () => {
    Alert.alert("Back", "Go back to previous screen");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <StatusBar translucent backgroundColor={"blue"} /> */}
      {/* ---------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------- */}

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.headerTitle}>Container Inspection</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------------------------- */}
        {/* CONTAINER NUMBER */}
        {/* ---------------------------------- */}

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Container Number</Text>

          <TextInput
            value={containerNumber}
            onChangeText={setContainerNumber}
            style={styles.input}
            placeholder="Enter container number"
            placeholderTextColor="#98A2B3"
            autoCapitalize="characters"
          />
        </View>

        {/* ---------------------------------- */}
        {/* CONTAINER TYPE */}
        {/* ---------------------------------- */}

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Container Type</Text>

          <Pressable
            style={styles.selectInput}
            onPress={() => setShowContainerTypes((prev) => !prev)}
          >
            <Text style={styles.selectText}>{containerType}</Text>

            <Ionicons
              name={showContainerTypes ? "chevron-up" : "chevron-down"}
              size={20}
              color="#667085"
            />
          </Pressable>

          {showContainerTypes && (
            <View style={styles.dropdown}>
              {CONTAINER_TYPES.map((type) => (
                <Pressable
                  key={type}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setContainerType(type);
                    setShowContainerTypes(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      containerType === type && styles.selectedDropdownText,
                    ]}
                  >
                    {type}
                  </Text>

                  {containerType === type && (
                    <Ionicons name="checkmark" size={20} color="#040474" />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* ---------------------------------- */}
        {/* INSPECTION PHOTOS */}
        {/* ---------------------------------- */}

        <View style={styles.photoHeader}>
          <Text style={styles.label}>Inspection Photos</Text>

          <Text style={styles.photoCount}>
            {photos.length} photo
            {photos.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* ---------------------------------- */}
        {/* CAMERA + GALLERY */}
        {/* ---------------------------------- */}

        <View style={styles.photoActions}>
          <PhotoAction
            icon="camera-outline"
            title="Camera"
            onPress={openCamera}
          />

          <PhotoAction
            icon="images-outline"
            title="Gallery"
            onPress={openGallery}
          />
        </View>

        {/* ---------------------------------- */}
        {/* SUBMITTED PHOTOS */}
        {/* ---------------------------------- */}

        {photos.length > 0 && (
          <View style={styles.submittedSection}>
            <View style={styles.submittedHeader}>
              <Text style={styles.submittedTitle}>Photos for Inspection</Text>

              <Text style={styles.submittedCount}>{photos.length}</Text>
            </View>

            <View style={styles.photoGrid}>
              {photos.map((photo, index) => (
                <View key={`${photo.uri}-${index}`} style={styles.photoCard}>
                  {/* IMAGE */}

                  <Image source={{ uri: photo.uri }} style={styles.thumbnail} />

                  {/* PHOTO NUMBER */}

                  <View style={styles.photoNumber}>
                    <Text style={styles.photoNumberText}>{index + 1}</Text>
                  </View>

                  {/* VIEW */}

                  <Pressable
                    style={styles.viewButton}
                    onPress={() => viewPhoto(photo)}
                  >
                    <Ionicons name="eye-outline" size={18} color="#FFFFFF" />
                  </Pressable>

                  {/* REMOVE */}

                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close" size={18} color="#FFFFFF" />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ---------------------------------- */}
        {/* EMPTY STATE */}
        {/* ---------------------------------- */}

        {photos.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="images-outline" size={32} color="#98A2B3" />
            </View>

            <Text style={styles.emptyTitle}>No photos added</Text>

            <Text style={styles.emptyDescription}>
              Capture photos using the camera or select existing photos from
              your gallery.
            </Text>
          </View>
        )}

        {/* ---------------------------------- */}
        {/* ANALYZE */}
        {/* ---------------------------------- */}

        <Pressable
          style={[
            styles.analyzeButton,

            photos.length === 0 && styles.analyzeButtonDisabled,
          ]}
          onPress={analyzeContainer}
        >
          <Ionicons name="scan-outline" size={20} color="#FFFFFF" />

          <Text style={styles.analyzeButtonText}>Analyze Container</Text>
        </Pressable>
      </ScrollView>

      {/* ---------------------------------- */}
      {/* FULL SCREEN PHOTO VIEWER */}
      {/* ---------------------------------- */}

      <Modal
        visible={selectedPhoto !== null}
        transparent
        animationType="fade"
        onRequestClose={closePhotoViewer}
      >
        <View style={styles.viewerContainer}>
          {/* CLOSE */}

          <Pressable style={styles.viewerClose} onPress={closePhotoViewer}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </Pressable>

          {/* IMAGE */}

          {selectedPhoto && (
            <Image
              source={{
                uri: selectedPhoto.uri,
              }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// -----------------------------------------
// PHOTO ACTION
// -----------------------------------------

type PhotoActionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
};

function PhotoAction({ icon, title, onPress }: PhotoActionProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.photoAction,

        pressed && {
          opacity: 0.7,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.photoIconContainer}>
        <Ionicons name={icon} size={28} color="#040474" />
      </View>

      <Text style={styles.photoActionText}>{title}</Text>
    </Pressable>
  );
}

// -----------------------------------------
// STYLES
// -----------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  // HEADER

  header: {
    height: 60,
    backgroundColor: "#040474",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  // CONTENT

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  // FIELDS

  fieldContainer: {
    marginBottom: 22,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 9,
  },

  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#101828",
  },

  selectInput: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectText: {
    fontSize: 15,
    color: "#101828",
  },

  // PHOTO HEADER

  photoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },

  photoCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#040474",
    marginBottom: 9,
  },

  // PHOTO ACTIONS

  photoActions: {
    flexDirection: "row",
    gap: 12,
  },

  photoAction: {
    flex: 1,
    height: 105,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",
  },

  photoIconContainer: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: "#EEF0FF",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 8,
  },

  photoActionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#344054",
  },

  // SUBMITTED PHOTOS

  submittedSection: {
    marginTop: 25,
  },

  submittedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  submittedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#344054",
  },

  submittedCount: {
    minWidth: 26,
    height: 26,

    borderRadius: 13,

    backgroundColor: "#EEF0FF",

    textAlign: "center",
    textAlignVertical: "center",

    fontSize: 12,
    fontWeight: "700",

    color: "#040474",
  },

  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  photoCard: {
    width: (SCREEN_WIDTH - 90) / 3,
    height: 120,

    borderRadius: 10,

    overflow: "hidden",

    backgroundColor: "#E4E7EC",

    position: "relative",
  },

  thumbnail: {
    width: "100%",
    height: "100%",
  },

  photoNumber: {
    position: "absolute",
    left: 7,
    top: 7,

    width: 24,
    height: 24,

    borderRadius: 12,

    backgroundColor: "rgba(0,0,0,0.6)",

    justifyContent: "center",
    alignItems: "center",
  },

  photoNumberText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  viewButton: {
    position: "absolute",
    bottom: 7,
    right: 7,

    width: 30,
    height: 30,

    borderRadius: 15,

    backgroundColor: "rgba(4,4,116,0.9)",

    justifyContent: "center",
    alignItems: "center",
  },

  removeButton: {
    position: "absolute",
    right: 7,
    top: 7,

    width: 24,
    height: 24,

    borderRadius: 12,

    backgroundColor: "rgba(217,45,32,0.9)",

    justifyContent: "center",
    alignItems: "center",
  },

  // EMPTY STATE

  emptyState: {
    marginTop: 25,

    padding: 25,

    backgroundColor: "#FFFFFF",

    borderRadius: 12,

    borderWidth: 1,
    borderColor: "#EAECF0",

    alignItems: "center",
  },

  emptyIcon: {
    width: 60,
    height: 60,

    borderRadius: 30,

    backgroundColor: "#F2F4F7",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#344054",
  },

  emptyDescription: {
    marginTop: 6,

    fontSize: 13,
    lineHeight: 19,

    color: "#667085",

    textAlign: "center",
  },

  // ANALYZE

  analyzeButton: {
    height: 54,

    marginTop: 25,

    backgroundColor: "#040474",

    borderRadius: 10,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 9,
  },

  analyzeButtonDisabled: {
    backgroundColor: "#98A2B3",
  },

  analyzeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // PHOTO VIEWER

  viewerContainer: {
    flex: 1,

    backgroundColor: "rgba(0,0,0,0.95)",

    justifyContent: "center",
    alignItems: "center",
  },

  viewerClose: {
    position: "absolute",

    top: 50,
    right: 20,

    zIndex: 10,

    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: "rgba(255,255,255,0.15)",

    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: SCREEN_WIDTH,
    height: "80%",
  },
  dropdown: {
    marginTop: 5,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D0D5DD",

    borderRadius: 10,

    overflow: "hidden",

    elevation: 3,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  dropdownOption: {
    minHeight: 50,

    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F7",
  },

  dropdownText: {
    fontSize: 15,
    color: "#344054",
  },

  selectedDropdownText: {
    color: "#040474",
    fontWeight: "600",
  },
});
