import {Business} from "./business.interface";

export interface Company {
    name: string;
    businesses: Business[];

    parCustomer: boolean;

    minScore: number;
    maxScore: number;
    avgScore: number;

    updated?: Date;
}