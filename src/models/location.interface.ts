import {Inspection} from "./inspection.interface";

export interface Location {
    business_id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    latitude: number;
    longitude: number;
    phone_number: string;

    inspections: Inspection[];
}