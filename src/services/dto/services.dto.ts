import { Meta } from '../../traveller/dto/create-trip.dto.js';
import { Trip } from '../../database/prisma-client/client';

export interface GetAvailableTripsQueryDto {
  from?: string;
  to?: string;
  date?: string;
  page?: number;
  limit?: number;
}


type TripResponse =Pick<
  Trip,
  | 'from'
  | 'to'
  | 'departureDate'
  | 'luggageWeight'
  | 'pricePerUnit'
  | 'tripNotes'

>


export interface TripResponseDto {
    trips: TripResponse[];
    meta: Meta;
};

//  id: string;
//     travellerId: string;
//     from: string;
//     to: string;
//     departureDate: Date;
//     returnDate: Date | null;
//     luggageWeight: number;
//     tripStatus: TripStatus;
//     transportType: TransportType;
//     pricePerUnit: number;
//     currency: string | null;
//     tripNotes: string;
//     tripDurationDays: number | null;
//     createdAt: Date;
//     updatedAt: Date;
// }
