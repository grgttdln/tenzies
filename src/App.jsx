import React from 'react'
import Die from './Die'
import './App.css'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {

  const [arrNums, setArrNums] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [noRolls, setnoRolls] = React.useState(0)

  const [gameTime, setGameTime] = React.useState(0)
  const [m, setM] = React.useState(0)
  const [timeFormat, setTimeFormat] = React.useState("")


  const [userGame, setUserGame] = React.useState(JSON.parse(localStorage.getItem("userGame")) || {
    id: nanoid(),
    roll: 0,
    time: "00:00",
    m: 0,
    gameTime: 0
  })
  const [tempUserGame, setTempUserGame] = React.useState({
    id: nanoid(),
    roll: 0,
    time: "00:00",
    m: 0,
    gameTime: 0
  })

  React.useEffect(() => {
    localStorage.setItem("userGame", JSON.stringify(userGame))
    console.log(userGame, "react use eefect")
  }, [userGame])


  React.useEffect(() => {    
    setTempUserGame({
      id: nanoid(),
      roll: noRolls,
      time: timeFormat,
      m: m,
      gameTime: gameTime
    })

    console.log(tempUserGame)
    
    if(gameTime == 60) {
      setM(m + 1)
      setGameTime(0)
    }

    if(tenzies) {
      setTimeFormat(prev => prev)
      setGameTime(prev => prev)
      setM(prev => prev)

      if(userGame.roll === 0) {
        setUserGame(tempUserGame)
      } else {
        if(parseInt(userGame.m) >= parseInt(tempUserGame.m)) {
          if(parseInt(userGame.gameTime) >= parseInt(tempUserGame.gameTime) && parseInt(userGame.time) !== "00:00" && parseInt(userGame.roll) !== 0) {
            setUserGame(prev => {
              return ({
                ...prev, 
                roll: noRolls,
                time: timeFormat,
                m: m,
                gameTime: gameTime
              })
            })
          } 
      }}

    } else {
      setTimeFormat(`${m <= 9 ? "0" + m : m}:${gameTime <= 9 ? "0" + gameTime : gameTime}`)
    }

    while(noRolls !== 0 && tenzies === false) {
      const timer = setInterval(() => setGameTime(gameTime + 1), 1000);
      return () => clearInterval(timer)      
    }
  }, [gameTime, noRolls])


  React.useEffect(() => {
    const allVal = arrNums.every(die => die.value === arrNums[0].value)
    const allHeld = arrNums.every(die => die.isHeld)
    if(allHeld && allVal) {
      setTenzies(true)
    } else {
      setTenzies(false)
    }

  }, [arrNums])

  function allNewDice() {
    const allNewDiceArr = []
    for(let i = 0; i < 10; i++){
      allNewDiceArr.push({
        value: Math.floor((Math.random() * 6) + 1),
        isHeld: false,
        id: nanoid()
      })
    }
    return allNewDiceArr
  }

  function rollDie() {
    if(tenzies) {
      setTenzies(false)
      setArrNums(allNewDice)
      setnoRolls(0)
      
      setGameTime(0)
      setM(0)
      setTimeFormat("")
    } else {
      setnoRolls(prev => prev + 1)
      setArrNums(prev => prev.map(item => {
        return item.isHeld === true ?
        item :
        { ...item, id: nanoid(), value: Math.floor((Math.random() * 6) + 1) } 
      }))
    }
  }

  function handleClick(dieId) {
    setArrNums(prev => {
      const tempArr= []
      for(let i = 0; i < prev.length; i++) {
        if(dieId === prev[i].id) {
          tempArr.push({
            ...prev[i],
            isHeld: !prev[i].isHeld
          })
        } else {
          tempArr.push(prev[i])
        }
      }
      return tempArr
    })
  }

  const collectionDie = arrNums.map(item => {
    return (
      <Die 
        value={item.value}
        isHeld={item.isHeld}
        key={item.id}
        id={item.id}
        handleClick={handleClick}
      />
    )
  })
  
  return (
    <>
      <main>
        {tenzies && <Confetti />}
        
        <div className='app--title'>Tenzies</div>
        <div className='app--desc'>
          Roll until all dice are the same. Click each die to 
          freeze it at its current value between rolls.
        </div>
        <div className='app--gameinfo'>
          <div className='app--roll'>Roll: {noRolls}</div>
          <div className='app--roll'>Time: {timeFormat}</div>
        </div>
        <div className='app--die-container'>
          {collectionDie}
        </div>
        <button onClick={rollDie} className='app--roll-btn'>{tenzies === true ? "New Game" : "Roll"}</button>
        
        <div className='app--gameinfo'>
          <div className='app--best'>Best Roll {userGame.roll}</div>
          <div className='app--best'>Best Time {userGame.time}</div>
        </div>
      </main>

      <div className='app--info'>
        Built and Designed by Georgette Dalen.
        <br />
        All rights reserved. ©
      </div>
    </>
  )
}

export default App
