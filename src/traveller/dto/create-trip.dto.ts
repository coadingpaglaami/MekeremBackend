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
