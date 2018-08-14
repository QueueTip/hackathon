import {Violation} from "./violation.interface";
import {Inspection} from "./inspection.interface";

export interface Business {
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