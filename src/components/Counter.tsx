import {useReducer} from 'react';
import {Button} from './ui/button';

type State = {
  count: number;
};

type Action = {
  type: 'increment' | 'decrement';
  payload?: number;
};

const initialState: State = {count: 0};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return {count: state.count + (action.payload ?? 1)};
    case 'decrement':
      return {count: state.count - (action.payload ?? 1)};
    default:
      throw new Error();
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      Count: {state.count}
      <Button onClick={() => dispatch({type: 'increment'})}>+</Button>
      <Button onClick={() => dispatch({type: 'decrement'})}>-</Button>
    </>
  );
};

export default Counter;
