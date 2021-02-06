import React, {createContext, useReducer} from 'react';

const initialState = {
  boxes: [
    { name: 'Box1', position: { x: -2, y: 0, z: 0 }, scale: { x: 1.0, y: .5, z: 2.0 } },
    { name: 'Box2', position: { x:  2, y: 0, z: 0 }, scale: { x:  .5, y: .5, z:  .5 } }
  ],
};
const store = createContext(initialState);
const { Provider } = store;

const SceneProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    let newState = {}
    switch(action.type) {
      case 'UPDATE_BOX':
        newState = { ...state }
        newState.boxes[action.payload.index][action.payload.property][action.payload.dimension] = action.payload.value;
        return newState;
      case 'ADD_BOX':
        newState = { ...state, boxes: [ ...state.boxes, action.payload ]}
        return newState;
      default:
        throw new Error();
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, SceneProvider }

// const SceneContext = React.createContext()
// 
// class SceneProvider extends Component {
//   state = 
// 
//   updateBox = (i, box) => {
//     this.setState((prevState) => {
//       console.dir(box)
//       console.dir(prevState)
// 
//       prevState.boxes[i] = box;
// 
// 
//       return {
//         ...prevState
//       }
//     })
//   }
// 
//   render() {
//     const { children } = this.props
//     const { boxes } = this.state
//     const { updateBox } = this
// 
//     return (
//       <SceneContext.Provider
//         value={{
//           boxes,
//           updateBox,
//         }}
//       >
//         {children}
//       </SceneContext.Provider>
//     )
//   }
// }
// 
// 
// 
// export default SceneContext
// 
// export { SceneProvider }