import React from 'react';
import { Pen } from 'lucide-react';

const iconData = [
  { name: 'a', quantity: 10 },
  { name: 'b', quantity: 15 }
];

const colors = ['#FF0000', '#0000FF']; // Red for the first 10, Blue for the rest

const renderIcons = () => {
  const icons = [];
  let count = 0;

  // Loop through the array and generate icons
  iconData.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      if (count < 10) {
        icons.push(<Pen key={count} style={{ color: colors[0], margin: '5px' }} />);
      } else {
        icons.push(<Pen key={count} style={{ color: colors[1], margin: '5px' }} />);
      }
      count++;
    }
  });

  // If there are fewer than 25 icons, fill the rest with blank spaces or a default icon
  while (count < 25) {
    icons.push(<div key={count} style={{ margin: '5px', width: '24px', height: '24px' }} />); // Empty space or placeholder
    count++;
  }

  return icons;
};

const IconGrid = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
      {renderIcons()}
    </div>
  );
};

export default IconGrid;
