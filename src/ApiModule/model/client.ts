/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ClientMinimum } from "./clientMinimum";


export interface Client extends ClientMinimum{
    credentials: string;
    phone: string;
    additional_data?: any | null;
    id: number;
}

