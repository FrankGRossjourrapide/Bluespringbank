import React, {useState} from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>Count: <strong>{count}</strong></p>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(c => c + 1)} style={{marginLeft:8}}>+</button>
    </div>
  )
}
