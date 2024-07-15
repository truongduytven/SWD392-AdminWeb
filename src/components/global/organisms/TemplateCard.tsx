import React from 'react';
import { Card, Button } from 'antd';

const TemplateCard = ({ template, onSelect }) => {
  return (
    <Card className=''
    title={`${template.FromCity} - ${template.ToCity}`}
      style={{ width: '100%', margin: '16px' }}
      cover={
        <img
          alt="Template"
          src={template.ImageUrls[0]} // Display the first image
          style={{ width:"100%", objectFit: 'cover' }}
        />
      }
    >
      <p><strong>Tuyến:</strong> {template.StartLocation} - {template.EndLocation}</p>
      <p><strong>Trạng thái:</strong> {template.Status}</p>
      <p><strong>Tiện ích:</strong></p>
      <ul>
        {template.TripUtilityModels.map((utility, index) => (
          <li key={index}>{utility.UtilityName}</li>
        ))}
      </ul>
      <div>
        <strong>Giá ghế:</strong>
        <ul>
          {template.TripPriceSeats.map((seat) => (
            <li key={seat.SeatName}>
              {seat.SeatName}: {seat.Price.toLocaleString()} VND (Số lượng: {seat.Quantity})
            </li>
          ))}
        </ul>
      </div>
      <Button type="primary" className='mt-4' onClick={() => onSelect(template)}>Chọn template</Button>
    </Card>
  );
};

export default TemplateCard;
