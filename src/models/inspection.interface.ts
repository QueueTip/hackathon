import {Violation} from "./violation.interface";

export interface Inspection {
    business_id:number;
    score: number;
    date: string;
    type: string;

    violations: Violation[];
}