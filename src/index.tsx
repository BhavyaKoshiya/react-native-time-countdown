/**
 * CountDownTimer Component
 */

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';

interface CountDownTimerProps {
  /**
   * Total number of seconds to be passed to the timer component.
   * Example:- passing {60} seconds will give timestamp of 01:00 minutes to the timer
   */
  timestamp?: number;
  /**
   * Delay of timer in ms. Default is 1000ms (1 second)
   */
  delay?: number;
  /**
   * Callback for the timer countdown progress.
   * You can keep track of the progress of the timer countdown by remaining seconds.
   */
  timerOnProgress?: (timeStamp: number) => void;
  /**
   * Callback when the timer countdown ends.
   * This is a function where you can alert the user that the timer has ended.
   */
  timerCallback?: (isComplete: boolean) => void;
  /**
   * Style of Timer Component Container.
   */
  containerStyle?: ViewStyle;
  /**
   * Style of Component Timer Text.
   */
  textStyle?: TextStyle;
  /**
   * Specify the format in you want to see your timer otherwise it will show in Default format.
   * DHMS | DHM | DH | HMS | HM | MS
   */
  format?: 'DHMS' | 'HMS' | 'MS' | 'HM' | 'DHM' | 'DH';
  /**
   * Default is false.
   * If showDoubleZero is true, ensures that the first level of time units (days, hours, or minutes).
   * Displays as '00' when their value is less than 10. This prop does not affect seconds display.
   */
  showDoubleZero?: boolean;
}

export interface CountDownTimerHandle {
  /**
   * This Function resets timer to start from default value again.
   */
  resetTimer: () => void;
}

const CountDownTimer = forwardRef<CountDownTimerHandle, CountDownTimerProps>(
  (props, ref) => {
    const [timeStamp, setTimeStamp] = useState<number>(props.timestamp ?? 0);
    const delay = props.delay ?? 1000;

    const [sendOnce, setSendOnce] = useState<boolean>(true);
    const TimePlaceholder = props.format
      ? ['DHMS'].includes(props.format)
        ? '00:00:00:00'
        : ['DHM', 'HMS'].includes(props.format)
          ? '00:00:00'
          : ['MS', 'HM', 'DH'].includes(props.format)
            ? '00:00'
            : '00:00:00'
      : '00:00:00';
    const [finalDisplayTime, setFinalDisplayTime] =
      useState<string>(TimePlaceholder);

    useInterval(() => {
      if (timeStamp > 0) {
        setTimeStamp(timeStamp - 1);
        if (props.timerOnProgress) {
          props.timerOnProgress(timeStamp - 1);
        }
      } else if (sendOnce) {
        if (props.timerCallback) {
          props.timerCallback(true);
        } else {
          console.log(
            'Pass a callback function that will trigger once timer runs out....'
          );
        }
        setSendOnce(false);
      }

      let delta = timeStamp;

      const Days = Math.floor(delta / 86400);
      delta %= 86400;

      const Hours = Math.floor(delta / 3600);
      delta %= 3600;

      const Minutes = Math.floor(delta / 60);
      const Seconds = delta % 60;

      const totalHours = Days * 24 + Hours;
      const totalMinutes = totalHours * 60 + Minutes;

      const hr = Hours < 10 ? `0${Hours}` : Hours;
      const min = Minutes < 10 ? `0${Minutes}` : Minutes;
      const sec = Seconds < 10 ? `0${Seconds}` : Seconds;

      let displayTime = '';
      if (props.format) {
        if (props.format === 'DHMS') {
          displayTime = `${props.showDoubleZero && Days === 0 ? '00' : Days}:${hr}:${min}:${sec}`;
        } else if (props.format === 'HMS') {
          displayTime = `${
            props.showDoubleZero && totalHours === 0 ? '00' : totalHours
          }:${min}:${sec}`;
        } else if (props.format === 'MS') {
          displayTime = `${totalMinutes}:${sec}`;
        } else if (props.format === 'HM') {
          displayTime = `${
            props.showDoubleZero && totalHours === 0 ? '00' : totalHours
          }:${min}`;
        } else if (props.format === 'DHM') {
          displayTime = `${Days}:${hr}:${min}`;
        } else if (props.format === 'DH') {
          displayTime = `${Days}:${hr}`;
        }
      } else {
        if (Days !== 0) {
          displayTime = `${Days}:${hr}:${min}:${sec}`;
        } else if (Hours !== 0) {
          displayTime = `${hr}:${min}:${sec}`;
        } else if (Minutes !== 0) {
          displayTime = `${min}:${sec}`;
        } else if (Seconds !== 0) {
          displayTime = `${min}:${sec}`;
        }
      }

      setFinalDisplayTime(displayTime);
    }, delay);

    useImperativeHandle(ref, () => ({
      resetTimer: () => {
        setTimeStamp(props.timestamp ?? 0);
        setSendOnce(true);
      },
    }));

    return (
      <View style={props.containerStyle}>
        <Text style={props.textStyle}>{finalDisplayTime}</Text>
      </View>
    );
  }
);

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default CountDownTimer;
