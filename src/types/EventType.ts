import { EventTypeEnum } from 'src/enums/EventTypeEnum'

export interface EventType {
  code: string
  createdAt: string
  endTime: string
  id: number
  percent?: number
  amount?: number
  startTime: string
  type: EventTypeEnum
}

export interface EventTypeBody {
  startTime: string
  endTime: string
  eventType: number
  value: number
  allFood: boolean
  foods: number[]
}
