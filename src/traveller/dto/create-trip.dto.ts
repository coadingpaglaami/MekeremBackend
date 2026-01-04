import { SendRequest, User } from 'src/database/prisma-client/browser.js';
import { Trip } from '../../database/prisma-client/client.js';

export type RequiredFields = Pick<
  Trip,
  | 'from'
  | 'to'
  | 'departureDate'
  | 'luggageWeight'
  | 'pricePerUnit'
  | 'transportType'
  | 'tripNotes'
>;

export type OptionalFields = Omit<Trip, keyof RequiredFields | 'updatedAt'>;

export type CreateTripDto = RequiredFields & OptionalFields;
export interface TripResponseDto {
  message: string;
  trip: CreateTripDto;
}

export type GetTravellerTripsDto = Omit<
  RequiredFields,
  'pricePerUnit' | 'transportType'
> & { id: string };

export interface Meta {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  limit: number;
}

export interface GetTravellerTripsResponseDto {
  meta: Meta;
  data: GetTravellerTripsDto[];
}

export type SendRequestResponseDto = Pick<
  SendRequest,
  | 'tripId'
  | 'id'
  | 'status'
  | 'productWeight'
  | 'productImage'
  | 'requestMessage'
> & { trip: Pick<Trip, 'from' | 'to' | 'departureDate' | 'pricePerUnit'> } & {
  sender: Pick<User, 'name' | 'id'>;
};
