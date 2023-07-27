import React from 'react'
import './Die.css'

export default function Die(props) {

  const bgStyle = {
    backgroundColor: props.isHeld === true ? "#59E391" : "white"
  }

  return (
    <>
      <div className='die--box'>
        <div 
          onClick={() => props.handleClick(props.id)} 
          className='die--value'
          style={bgStyle}>
            <img src={`/images/${props.value}.png`} />
          </div>
      </div>
    </>
  )
}



