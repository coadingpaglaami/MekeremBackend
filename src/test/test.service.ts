import { Injectable } from '@nestjs/common';
import { TravellerService } from '../traveller/traveller.service.js';
import { CreateTripDto } from '../traveller/dto/create-trip.dto.js';
import type { Request } from 'express';


@Injectable()
export class TestService {
    constructor(private travellerService:TravellerService) {}
    async adminTest(body:any,req:Request):Promise<any>{
        const results = await Promise.all(
            body.map(async (item: CreateTripDto) =>
                this.travellerService.createTrip(req, item)
            )
        );
        return results;
    }
}
