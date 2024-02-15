import { memo, useEffect, useState } from "react"; //Callback
import clickSound from "./ClickSound.m4a";

function Calculator({ workouts, allowSound }) {
  const [number, setNumber] = useState(workouts.at(0).numExercises);
  const [sets, setSets] = useState(3);
  const [speed, setSpeed] = useState(90);
  const [durationBreak, setDurationBreak] = useState(5);

  const [duration, setDuration] = useState(0);

  //  const playSound = useCallback( //we came to the conclusion that we cannot use Callback because it will reset the duration state when we click on the top/right sound icon BECAUSE the allowSound state changes so THEN the function playSound is re created. As react sees a new function playSound and that is part of the dependencies array  the Effect will run with the current values of the those 4 pieces od state. So it will re calculate the duration based on that ignoring that we had manually changed the duration
  //    //whenever we click on the sound icon the allowSound function changes and then the playSound function is re created and when React sees a new function and since that function is in the dependency array of useEffect, than the function inside useEffect will run again
  //    function () {
  //      //we want the app to make a sound every time the duration updates
  //      if (!allowSound) return;
  //      const sound = new Audio(clickSound);
  //      sound.play();
  //    },
  //    [allowSound]
  //  );

  //we use useEffect to keep the duration in sync with all the other state variables
  useEffect(
    //use one Effect for each side effect that we want to have
    //we need to transform the duration into a state variable
    function () {
      setDuration((number * sets * speed) / 60 + (sets - 1) * durationBreak); //updating state based in another state update
      //playSound();
    },
    [number, sets, speed, durationBreak] //playsound
  );

  useEffect(
    //this effect will be responsible for playing the sound/keeping sound synchronized with the duration state
    function () {
      const playSound = function () {
        const sound = new Audio(clickSound);
        if (!allowSound) return;
        sound.play();
      };
      playSound();
    },
    [duration, allowSound]
  );

  //const duration = (number * sets * speed) / 60 + (sets - 1) * durationBreak;
  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;

  function handleInc() {
    setDuration((duration) => Math.floor(duration) + 1);
    //  playSound();
  }

  function handleDec() {
    setDuration((duration) => (duration > 1 ? Math.ceil(duration) - 1 : 0));
    //  playSound();
  }

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select value={number} onChange={(e) => setNumber(+e.target.value)}>
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) => setDurationBreak(e.target.value)}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={handleDec}>–</button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button onClick={handleInc}>+</button>
      </section>
    </>
  );
}

export default memo(Calculator);
