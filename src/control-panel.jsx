import React, { useRef, useState, useContext } from 'react';
import { store } from './scene-context';
import './control-panel.css';


const ScaleInput = (props) => {
    const {state, dispatch } = useContext(store);
	return (
      <React.Fragment>
		<label htmlFor="{props.box.name}">{props.dimension}: </label>
		<input 
			name={props.box.name + '-' + props.property + '-' + props.dimension} 
			id={props.box.name + '-' + props.property + '-' + props.dimension} 
			className="control-panel-input" 
			type="number" 
			step="0.1" 
			value={props.box[props.property][props.dimension]} 
			onChange={
				(e) => dispatch(
					{
						type: 'UPDATE_BOX', 
						payload: {
							index: props.index,
							property: props.property,
							dimension: props.dimension,
							value: parseFloat(e.target.value)
						}
					}
				)
			} 
		/>
      </React.Fragment>
		)
}

const ControlPanel = (props) => {
    const {state, dispatch } = useContext(store);


    const inputs = state.boxes.map((box, i) => 
		<div key={box.name}>
		  <h4>{box.name}</h4>
		  <div>
		  	<h5>Position</h5>
			  <ScaleInput box={box} property="position" dimension="x" index={i} />
			  <ScaleInput box={box} property="position" dimension="y" index={i} />
			  <ScaleInput box={box} property="position" dimension="z" index={i} />
		  </div>
		  <div>
		  	<h5>Scale</h5>
			  <ScaleInput box={box} property="scale" dimension="x" index={i} />
			  <ScaleInput box={box} property="scale" dimension="y" index={i} />
			  <ScaleInput box={box} property="scale" dimension="z" index={i} />
		  </div>
		</div>     
    )

    const addBox = () => {
    	dispatch({type: "ADD_BOX", payload: { name: 'New Box', position: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }})
    }

	return (
		<div>
			{inputs}
			<input type="button" onClick={() => addBox()} />
		</div>
	)
}

export default ControlPanel;