// 'use strict';
// import React, { PureComponent } from 'react';
// import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { RNCamera } from 'react-native-camera';

// const PendingView = () => (
//   <View
//     style={{
//       flex: 1,
//       backgroundColor: 'lightgreen',
//       justifyContent: 'center',
//       alignItems: 'center',
//     }}
//   >
//     <Text>Waiting</Text>
//   </View>
// );

// class ExampleApp extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       type: RNCamera.Constants.Type.back,
//       flashMode: RNCamera.Constants.FlashMode.on
//     };
//   }


//   render() {
//     return (
//       <View style={styles.container}>
//         <RNCamera
//           style={styles.preview}
//           type={this.state.type}
//           flashMode={this.state.flashMode}
//           androidCameraPermissionOptions={{
//             title: 'Permission to use camera',
//             message: 'We need your permission to use your camera',
//             buttonPositive: 'Ok',
//             buttonNegative: 'Cancel',
//           }}
//           androidRecordAudioPermissionOptions={{
//             title: 'Permission to use audio recording',
//             message: 'We need your permission to use your audio',
//             buttonPositive: 'Ok',
//             buttonNegative: 'Cancel',
//           }}
//           faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
//           faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
//           onFacesDetected={() => {
//             console.log('halo')
//           }}
//         >
//           {({ camera, status, recordAudioPermissionStatus }) => {
//             if (status !== 'READY') return <PendingView />;
//             return (
//               <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
//                 <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
//                   <Text style={{ fontSize: 14 }}> SNAP </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => this.switchKamera()} style={styles.capture}>
//                   <Text style={{ fontSize: 14 }}> Tukar Kamera </Text>
//                 </TouchableOpacity>
//               </View>
//             );
//           }}
//         </RNCamera>
//       </View>
//     );
//   }

//   takePicture = async function(camera) {
//     console.log(this.state.type)
//     const options = { quality: 0.5, base64: true };
//     const data = await camera.takePictureAsync(options);
//     //  eslint-disable-next-line
//     console.log(data.uri);
//   };
//   switchKamera = () => {
//     this.setState({
//       type: this.state.type ?  RNCamera.Constants.Type.back :  RNCamera.Constants.Type.front,
//       flashMode: this.state.type ? RNCamera.Constants.FlashMode.off : RNCamera.Constants.FlashMode.on
//     })
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: 'black',
//   },
//   preview: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   capture: {
//     flex: 0,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     padding: 15,
//     paddingHorizontal: 20,
//     alignSelf: 'center',
//     margin: 20,
//   },
// });

// export default ExampleApp

import React, { PureComponent } from 'react'
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { TouchableOpacity, Alert, StyleSheet, Text, View } from 'react-native';


const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);
class Camera extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      takingPic: false,
      box: null,
      type: RNCamera.Constants.Type.back,
      flashMode: RNCamera.Constants.FlashMode.on
    };
  }
  takePicture = async () => {
    if (this.camera && !this.state.takingPic) {
      let options = {
        quality: 0.85,
        fixOrientation: true,
        forceUpOrientation: true,
      };
      this.setState({ takingPic: true });

      try {
        const data = await this.camera.takePictureAsync(options);
        this.setState({ takingPic: false }, () => {
          this.props.onPicture(data);
        });
      } catch (error) {
        this.setState({ takingPic: false });
        Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
      }
    }
  }
  onFaceDetected = ({ faces }) => {
    console.log(faces)
    if (faces[0]) {
      this.setState({
        box: {
          width: faces[0].bounds.size.width,
          height: faces[0].bounds.size.height,
          x: faces[0].bounds.origin.x,
          y: faces[0].bounds.origin.y,
          yawAngle: faces[0].yawAngle,
          rollAngle: faces[0].rollAngle,
        }
      })
    }
  }

  switchKamera = () => {
    this.setState({
      type: this.state.type ?  RNCamera.Constants.Type.back :  RNCamera.Constants.Type.front,
      flashMode: this.state.type ? RNCamera.Constants.FlashMode.off : RNCamera.Constants.FlashMode.on
    })
  }
  render() {
    return (
      <>
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        captureAudio={false}
        style={{ flex: 1 }}
        type={this.state.type}
        onFacesDetected={this.onFaceDetected}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        activeOpacity={0.5}
        style={styles.btnAlignment}
        onPress={this.takePicture}
        whiteBalance={RNCamera.Constants.WhiteBalance.shadow}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
        faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
        >

           {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                  <Text style={{ fontSize: 14 }}> SNAP </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.switchKamera()} style={styles.capture}>
                  <Text style={{ fontSize: 14 }}> Tukar Kamera </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>

        
      </>
    );
  }
  
}
const styles = StyleSheet.create({
  btnAlignment: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
    container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default Camera