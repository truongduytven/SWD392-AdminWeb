import React from 'react'
import { Card, List, Descriptions, Image, Tag } from 'antd'

const { Meta } = Card

interface TripPriceSeat {
  SeatName: string
  Price: number
  Quantity: number
}

interface TripUtilityModel {
  UtilityName: string
  Description: string
}

interface TripStationModel {
  StationID: string
  StationName: string
  AtCity: string
}

interface Template {
  TemplateID: string
  FromCity: string
  ToCity: string
  StartLocation: string
  EndLocation: string
  TripPriceSeats: TripPriceSeat[]
  ImageUrls: string[]
  TripUtilityModels: TripUtilityModel[]
  TripStationModels: TripStationModel[]
  Status: string
}
interface TemplateDisplayProps {
  templates: Template[]
}
const TemplateDisplay: React.FC<TemplateDisplayProps> = ({ templates }) => {
  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={templates}
      renderItem={(template) => (
        <List.Item>
          <Card hoverable cover={<Image className='w-96' src={template.ImageUrls[0]} alt='Trip Image' />}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              {template.ImageUrls.map((url, index) => (
                <Image key={index} width={100} src={url} alt={`Trip Image ${index + 1}`} />
              ))}
            </div>
            <Meta
              title={
                <div style={{ display: 'flex', alignItems: 'center', marginBottom:"10px", marginTop:"20px" }}>
                  <span className='text-lg' style={{ marginRight: 8 }}>{`${template.FromCity} → ${template.ToCity}`}</span>
                  {template.Status === 'KHÔNG HOẠT ĐỘNG' ? (
                    <Tag color='red'>Không Hoạt Động</Tag>
                  ) : (
                    <Tag color='green'>Hoạt Động</Tag>
                  )}
                </div>
              }
              description={null} // Remove description to avoid double content
            />
            <Descriptions column={1} bordered>
              <Descriptions.Item label='Từ'>{template.FromCity}</Descriptions.Item>
              <Descriptions.Item label='Đến'>{template.ToCity}</Descriptions.Item>
              <Descriptions.Item label='Địa điểm bắt đầu'>{template.StartLocation}</Descriptions.Item>
              <Descriptions.Item label='Địa điểm kết thúc'>{template.EndLocation}</Descriptions.Item>
            </Descriptions>
            <h3 className='text-lg font-semibold mt-4'>Ghế và giá</h3>
            <List
              dataSource={template.TripPriceSeats}
              renderItem={(seat) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${seat.SeatName}: ${seat.Price} VND`}
                    description={`Quantity: ${seat.Quantity}`}
                  />
                </List.Item>
              )}
            />
            <h3 className='text-lg font-semibold mt-4'>Tiện ích</h3>
            <List
              dataSource={template.TripUtilityModels}
              renderItem={(utility) => (
                <List.Item>
                  <List.Item.Meta title={utility.UtilityName} description={utility.Description} />
                </List.Item>
              )}
            />
            <h3 className='text-lg font-semibold mt-4'>Trạm dừng</h3>
            <List
              dataSource={template.TripStationModels}
              renderItem={(station) => (
                <List.Item>
                  <List.Item.Meta title={station.StationName} description={station.AtCity} />
                </List.Item>
              )}
            />
           
          </Card>
        </List.Item>
      )}
    />
  )
}

export default TemplateDisplay
