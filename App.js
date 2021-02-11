/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { CvImage, CvInvoke, ColorConv, Core } from 'react-native-opencv3';

const App = () => {
  return (
    <>
      <CvInvoke func='bitwise_not' params={{ "p1": "dstMat", "p2": "dstMat" }}>
        <CvInvoke func='rotate' params={{ "p1": "dstMat", "p2": "dstMat", "p3": Core.ROTATE_90_COUNTERCLOCKWISE }}>
          <CvInvoke func='cvtColor' params={{ "p1": "srcMat", "p2": "dstMat", "p3": ColorConv.COLOR_BGR2GRAY }}>
            <CvImage
              style={{ width: 200, height: 200 }}
              source={require(`${originalImagePath}`)}
            />
          </CvInvoke>
        </CvInvoke>
      </CvInvoke>
    </>
  );
};


export default App;
