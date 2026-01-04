import { Meta } from '../../traveller/dto/create-trip.dto.js';
import {
  SendRequest as RequestSend,
  Trip,
} from '../../database/prisma-client/client';

export interface GetAvailableTripsQueryDto {
  from?: string;
  to?: string;
  date?: string;
  page?: number;
  limit?: number;
}

type TripResponse = Pick<
  Trip,
  | 'from'
  | 'to'
  | 'departureDate'
  | 'luggageWeight'
  | 'pricePerUnit'
  | 'tripNotes'
>;

export interface TripResponseDto {
  trips: TripResponse[];
  meta: Meta;
}

export type SendRequestDto = Pick<
  RequestSend,
  'requestMessage' | 'productWeight' 
>;


export interface SendRequestResponseDto {
  sendRequest: SendRequestDto;
  trip: Pick<Trip, 'id' | 'from' | 'to' | 'departureDate'>;
}


