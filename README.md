# react-native-countdown-timer

[![npm version](https://badge.fury.io/js/react-native-countdown-timer.svg)](https://www.npmjs.com/package/react-native-countdown-timer)
[![npm](https://img.shields.io/npm/dm/react-native-countdown-timer.svg)]()

<i>react-native-countdown-timer</i> is a small library built with TypeScript that provides a custom countdown timer
component created using a custom hook. All you have to do is pass a timestamp(as total number of seconds) to it and it will calculate the total number of days, hours, minutes and seconds automatically.

It also supports a callback function which you can utilize to let the user know when the timer is over. You can also give an option to the user to reset the timer using this function <i>refTimer.current.resetTimer()</i>.

# Contents

- [The package](#react-native-countdown-timer)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Pull Requests](#pull)
<!-- - [Examples](#examples) -->

# Installation

from npm

```bash
npm install react-native-countdown-timer
```

from yarn

```bash
yarn add react-native-countdown-timer
```

Note: Linking and Pod install not needed.

# Usage

```javascript
/**
 * CountdownTimerApp Functional Component
 */

import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CountDownTimer from 'react-native-countdown-timer';

function CountdownTimerApp() {
  // Timer References
  const refTimer = useRef();

  // For keeping track of the timer
  const [timerEnd, setTimerEnd] = useState(false);

  const timerOnProgressFunc = (remainingTimeInSecs) => {
    console.log('On Progress tracker :', remainingTimeInSecs);
  };

  const timerCallbackFunc = (timerFlag) => {
    // Setting timer flag to false once complete
    setTimerEnd(timerFlag);
    console.warn('Alert the user when timer runs out...');
  };

  return (
    <View style={styles.container}>
      <View style={{ display: timerEnd ? 'none' : 'flex' }}>
        <CountDownTimer
          ref={refTimer}
          timestamp={120}
          format="DHMS"
          showDoubleZero
          timerOnProgress={timerOnProgressFunc}
          timerCallback={timerCallbackFunc}
          containerStyle={styles.timerContainerStyle}
          textStyle={styles.timerTextStyle}
        />
      </View>
      <TouchableOpacity
        style={[
          {
            display: timerEnd ? 'flex' : 'none',
          },
          styles.touchableOpacityStyle,
        ]}
        onPress={() => {
          setTimerEnd(false);
          refTimer.current.resetTimer();
        }}
      >
        <Text style={styles.touchableOpacityTextStyle}>Resend</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainerStyle: {
    height: 56,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: '#2196f3',
  },
  timerTextStyle: {
    fontSize: 25,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  touchableOpacityStyle: {
    height: 56,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: '#512da8',
  },
  touchableOpacityTextStyle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CountdownTimerApp;
```

<!-- # Updates 🚀 -->

### Props

| Name            | Type                                             | Default                                                         | Description                                                                                                                                                                                        |
| --------------- | ------------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| timestamp       | `number`                                         | required                                                        | Total number of seconds to be passed to the timer component. Example:- passing {60} seconds will give timestamp of 01:00 minutes to the timer                                                      |
| format          | `DHMS` \| `DHM` \| `DH` \| `HMS` \| `HM` \| `MS` | `Default`                                                       | Specify the format in you want to see your timer otherwise it will show in Default format                                                                                                          |
| showDoubleZero  | `boolean`                                        | Default is `false`                                              | If `showDoubleZero` is `true`, ensures that the first level of time units (days, hours, or minutes). displays as '00' when their value is less than 10. This prop does not affect seconds display. |
| timerCallback   | `function`                                       | `void`                                                          | Callback when the timer countdown ends. This is a function where you can alert the user that the timer has ended.                                                                                  |
| timerOnProgress | `function`                                       | `void`                                                          | Callback for the timer countdown progress. You can keep track of the progress of the timer countdown by remaining seconds.                                                                         |
| containerStyle  | `style`                                          | { backgroundColor: 'rgba(0, 0, 0, .2)' }                        | Style of Timer Component Container dots                                                                                                                                                            |
| textStyle       | `style`                                          | { fontSize: 15, fontWeight: '600', color: 'rgba(0, 0, 0, .2)' } | Style of Timer Component Text dots                                                                                                                                                                 |

# License

MIT

# Pull

Pull requests are welcome! Please make the PR to `dev` branch though and not `master`. Thanks.
