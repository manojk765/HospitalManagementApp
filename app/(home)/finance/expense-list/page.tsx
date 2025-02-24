import React, { useState } from 'react';

const ExpensePage: React.FC = () => {
  // State to track button clicks
  const [count, setCount] = useState(0);

  // Function to handle button click
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Simple TSX Page</h1>
      <p>This is a single-page React TypeScript component.</p>
      
      <div style={{ marginTop: '20px' }}>
        <p>You clicked the button {count} times!</p>
        <button onClick={handleClick}>Click Me</button>
      </div>
    </div>
  );
};

export default ExpensePage ;
