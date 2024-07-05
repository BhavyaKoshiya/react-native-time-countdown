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
  timestamp?: number;
  delay?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  timerOnProgress?: (timeStamp: number) => void;
  timerCallback?: (isComplete: boolean) => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  format?: 'DHMS' | 'HMS' | 'MS' | 'HM' | 'DHM' | 'DH';
  showDoubleZero?: boolean;
}

export interface CountDownTimerHandle {
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
          displayTime = `${Days}:${hr}:${min}:${sec}`;
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
