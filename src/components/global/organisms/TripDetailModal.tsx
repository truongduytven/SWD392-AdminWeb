import React, { useState } from 'react'
import { Card, List, Typography, Image, Collapse } from 'antd'
import { Armchair, ChevronLeft, ChevronRight, Pen, Rocket } from 'lucide-react'
import IconGrid from './IconGrid'
import SeatIcon from '@/assets/seat.svg'

const { Title, Text } = Typography
const { Panel } = Collapse

const TripDetailModal = ({ trip }: any) => {
  const {
    TripID,
    StaffName,
    StaffEmail,
    FromCity,
    ToCity,
    StartLocation,
    EndLocation,
    StartTime,
    EndTime,
    StartDate,
    EndDate,
    TripPriceSeats,
    ImageUrls,
    TripUtilityModels,
    TripStationModels,
    Status
  } = trip
  // Define a color palette for different seat types
  const colors = ['#FF0000', '#0000FF', '#008000', '#FFFF00', '#FFA500'] // Add more colors as needed

  //   const renderSeatIcons = () => {
  //     const icons = [];
  //     let count = 0;

  //     TripPriceSeats.forEach((seat, index) => {
  //       const color = colors[index % colors.length]; // Use color based on index
  //       for (let i = 0; i < seat.Quantity; i++) {
  //         icons.push(<Pen key={count} style={{ color, margin: '5px' }} />);
  //         count++;
  //       }
  //     });

  //     // Fill to 25 with placeholders if needed
  //     while (count < 30) {
  //       icons.push(<div key={count} style={{ margin: '5px', width: '24px', height: '24px' }} />); // Placeholder
  //       count++;
  //     }

  //     return icons;
  //   };
  const renderSeatIcons = (): JSX.Element[] => {
    const icons:JSX.Element[] = []
    let totalIcons = 0

    TripPriceSeats.forEach((seat: any, index: any) => {
      const color = colors[index % colors.length] // Use color based on index
      for (let i = 0; i < seat.Quantity; i++) {
        icons.push(<Armchair key={totalIcons} style={{ color, margin: '5px' }} />)
        totalIcons++
      }
    })

    return icons
  }
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < ImageUrls.length - 1 ? prevIndex + 1 : 0))
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : ImageUrls.length - 1))
  }
  return (
    <div className='h-[460px] overflow-y-auto'>
      <Text>
        Trip ID: <strong>{TripID}</strong>
      </Text>
      <br />
      <Text>
        Nhân viên: <strong>{StaffName}</strong>
      </Text>
      <br />
      <Text>
        Email nhân viên: <strong>{StaffEmail}</strong>
      </Text>
      <br />
      <Text>
        Tuyến:{' '}
        <strong>
          {FromCity} - {ToCity}
        </strong>
      </Text>
      <br />
      {/* <Text>Đến thành phố: <strong>{ToCity}</strong></Text><br/> */}
      <Text>
        Địa điểm bắt đầu: <strong>{StartLocation}</strong>
      </Text>
      <br />
      <Text>
        Địa điểm kết thúc: <strong>{EndLocation}</strong>
      </Text>
      <br />
      <Text>
        Time:{' '}
        <strong>
          {StartTime} - {EndTime}
        </strong>
      </Text>
      <br />
      <Text>
        Ngày bắt đầu: <strong>{StartDate}</strong>
      </Text>
      <br />
      <Text>
        Ngày kết thúc: <strong>{EndDate}</strong>
      </Text>
      <br />
      <Text>
        Trạng thái: <strong>{Status}</strong>
      </Text>
      <br />
      <hr className='my-2' />
      <Collapse>
        <Panel header='Giá ghế' key='1' >
         <div className='flex flex-col gap-4 justify-center items-center' >

          <div className='flex flex-col gap-4'>
            {TripPriceSeats.map((item: any, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <Text>
                  {item.SeatName}: <strong>{item.Price}</strong> VND ({item.Quantity} ghế)
                </Text>
               
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>{renderSeatIcons()}</div>
         </div>

        </Panel>

        <Panel header='Ảnh' key='2'>
        <div className='p-4 flex flex-col justify-center items-center'>
          <div className='relative overflow-hidden mb-4 w-full h-fit '>
            <div
              className='flex transition-transform duration-500'
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {ImageUrls.map((image: string, index: number) => (
                <div key={index} className='flex-none w-full h-80'>
                  <img src={image} alt={`Slide ${index}`} className='w-full h-full rounded-md object-cover' />
                </div>
              ))}
            </div>
            <button
              onClick={handlePrev}
              className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-1 flex justify-center items-center rounded-full shadow hover:bg-opacity-100 transition'
            >
              <ChevronLeft className='text-primary' />
            </button>
            <button
              onClick={handleNext}
              className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-1 rounded-full shadow hover:bg-opacity-100 transition'
            >
              <ChevronRight className='text-primary' />
            </button>
          </div>
          <div className='flex space-x-4 overflow-x-auto'>
            {ImageUrls.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index}`}
                className={`w-24 h-24 object-cover rounded-md cursor-pointer ${currentIndex === index ? 'border-2 border-primary' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
          {/* <Image.PreviewGroup>
            {ImageUrls.map((url: any, index: any) => (
              <Image key={index} width={200} src={url} />
            ))}
          </Image.PreviewGroup> */}
        </Panel>

        <Panel header='Tiện ích' key='3'>
          <List
            dataSource={TripUtilityModels}
            renderItem={(item: any) => (
              <List.Item>
                <Text className=''>
                <strong>{item.UtilityName}</strong>: {item.Description}
                </Text>
              </List.Item>
            )}
          />
        </Panel>

        <Panel header='Trạm' key='4'>
          <List
            dataSource={TripStationModels}
            renderItem={(item: any) => (
              <List.Item>
                <Text>
               <strong>{item.StationName}</strong> (Thành phố: {item.AtCity})
                </Text>
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
    </div>
  )
}

export default TripDetailModal
