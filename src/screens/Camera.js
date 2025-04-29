import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null); // Store the captured photo's URI

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // Function to toggle the camera between front and back
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Function to capture a photo
  const takePicture = async () => {
    try {
      const photo = await CameraView.takePictureAsync();
      setPhotoUri(photo.uri); // Save the photo URI
      saveToCameraRoll(photo.uri);
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  // Function to save the photo to the camera roll
  const saveToCameraRoll = async (uri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri); // Create a media asset
      await MediaLibrary.createAlbumAsync('My Photos', asset, false); // Save to album
      Alert.alert("Success", "Photo saved to camera roll!");
    } catch (error) {
      Alert.alert("Error", "Failed to save photo to camera roll");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {photoUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.text}>Preview:</Text>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-between',
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});
