import {Location} from "./location.interface";

export interface Company {
    name: string;
    locations: Location[];

    parCustomer: boolean;

    minScore: number;
    maxScore: number;
    avgScore: number;

    updated?: string;
}