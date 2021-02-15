
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import SoundPlayer from 'react-native-sound-player'
import CountDown from 'react-native-countdown-component';



const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const landmarkSize = 2;

class CameraScreen extends React.Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    depth: 0,
    type: 'front',
    whiteBalance: 'auto',
    ratio: '16:9',
    recordOptions: {
      mute: false,
      maxDuration: 5,
      quality: RNCamera.Constants.VideoQuality['288p'],
    },
    isRecording: false,
    canDetectFaces: true,
    canDetectText: false,
    canDetectBarcode: false,
    faces: [],
    textBlocks: [],
    barcodes: [],
    checkKedipatMata:false,
    bukaMata: 'tidak',
    tutupMata: 'tidak',
    time:0
  };

  componentDidUpdate(){
    if (this.state.checkKedipatMata){
      const waktu = setInterval(() => {
        this.setState({checkKedipatMata: false})
        clearInterval(waktu)
      }, 3000);
    }
  }
  async kedipkanMata(){
    try {
      await SoundPlayer.playSoundFile('kedipkan_mata', 'mp3')
      await SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
       this.setState({time: 5})
      })
    } catch (e) {
        console.log(`cannot play the sound file`, e)
    }
  }

  mulai(){
    this.setState({bukaMata: 'tidak', tutupMata: 'tidak', checkKedipatMata: false})
    this.kedipkanMata()
  }

  takePicture = async function() {
    if (this.camera) {
      const options = {base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.warn('takePicture ', data);
    }
  };
  facesDetected = ({ faces }) => {
    if (this.state.checkKedipatMata){
      if (faces[0]){
        if (this.state.bukaMata === 'tidak' && this.state.tutupMata === 'tidak'){
          this.setState({bukaMata: 'Ya'})
          return
        }
        if (this.state.bukaMata === 'Ya' && faces[0].rightEyeOpenProbability.toFixed(0) == 0){
          this.setState({tutupMata: 'Ya', bukaMata: 'tidak'})
          return
        }
        if (this.state.tutupMata === 'Ya' && faces[0].rightEyeOpenProbability.toFixed(0) == 1){
          this.setState({checkKedipatMata: false, bukaMata: 'Ya'})
        }
      }
    }
  };

  renderCamera() {
    const { canDetectFaces, canDetectText, canDetectBarcode, time } = this.state;

    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
        trackingEnabled
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
        faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
        onFacesDetected={canDetectFaces ? this.facesDetected : null}
        onTextRecognized={canDetectText ? this.textRecognized : null}
        onGoogleVisionBarcodesDetected={canDetectBarcode ? this.barcodeRecognized : null}
      >
        <View
          style={{
            flex: 0.5,
          }}
        >
           {
             time ? <CountDown
             until={this.state.time}
             size={30}
             onFinish={() => {
               this.setState({time: 0, checkKedipatMata: true})
             }}
             digitStyle={{backgroundColor: '#FFF'}}
             digitTxtStyle={{color: '#1CC625'}}
             timeToShow={['S']}
             timeLabels={{s: ''}}
         /> : null
           }
         
        </View>
        <View
          style={{
            flex: 0.1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            position: 'absolute',
            bottom: 10,
            paddingHorizontal: 10
          }}
        >
          {
            !this.state.checkKedipatMata ? <TouchableOpacity
            style={[styles.flipButton, styles.picButton, {}]}
            onPress={this.mulai.bind(this)}
          >
            <Text style={styles.flipText}> Mulai </Text>
          </TouchableOpacity> : null
          }
        </View>
      </RNCamera>
    );
  }
  render() {
    console.log(this.state.checkKedipatMata, 'ini kedip mata')
    if (this.state.tutupMata === 'Ya'  && this.state.bukaMata === 'Ya'){
      alert('Mata Sudah Berkedip')
      this.takePicture()
    }
    return <View style={styles.container}>{this.renderCamera()}</View>;
  }
}
export default CameraScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  flipButton: {
    flex: 1,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  zoomText: {
    position: 'absolute',
    bottom: 70,
    zIndex: 2,
    left: 2,
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  textBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});
