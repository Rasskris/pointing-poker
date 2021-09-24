import React, { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { Timer } from './Timer';

//https://stackoverflow.com/questions/40885923/countdown-timer-in-react

const START_COUNTDOWN_SECONDS = 59;
const DEFAULT_START_MINUTES = 0;
const DEFAULT_START_SECONDS = 0;

interface TimerContainerProps {
  initialMinute: number;
  initialSeconds: number;
  timerStarted: boolean;
  areSettingsEdited: boolean;
  onChangeTimer?: (time: { minutes: number; seconds: number }) => void;
}

const TimerContainer = (props: TimerContainerProps) => {
  const { initialMinute, initialSeconds, timerStarted, areSettingsEdited, onChangeTimer } = props;
  const [minutes, setMinutes] = useState<number>(DEFAULT_START_MINUTES);
  const [seconds, setSeconds] = useState<number>(DEFAULT_START_SECONDS);

  useEffect(() => {
    setMinutes(initialMinute);
    setSeconds(initialSeconds);
  }, [initialMinute, initialSeconds]);

  const handleChangeMinutes = (event: ChangeEvent<HTMLInputElement>) => {
    //TODO: add validation
    const { value } = event.target;
    setMinutes(+value);
    if (onChangeTimer) onChangeTimer({ minutes: +value, seconds });
  };

  const handleChangeSeconds = (event: ChangeEvent<HTMLInputElement>) => {
    //TODO: add validation
    const { value } = event.target;
    setSeconds(+value);
    if (onChangeTimer) onChangeTimer({ minutes, seconds: +value });
  };

  useEffect(() => {
    if (!timerStarted || areSettingsEdited) return;
    let timerInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timerInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(START_COUNTDOWN_SECONDS);
        }
      }
    }, 1000);
    return () => {
      clearInterval(timerInterval);
    };
  });

  return (
    <Timer
      minutes={minutes}
      seconds={seconds}
      areSettingsEdited={areSettingsEdited}
      onChangeMinutes={handleChangeMinutes}
      onChangeSeconds={handleChangeSeconds}
    />
  );
};

TimerContainer.defaultProps = {
  initialMinute: DEFAULT_START_MINUTES,
  initialSeconds: DEFAULT_START_SECONDS,
  timerStarted: false,
  areSettingsEdited: false,
};

export { TimerContainer };
