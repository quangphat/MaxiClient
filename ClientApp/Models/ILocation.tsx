export interface ILocation {
    id: string,
    countryCode: string,
    provinceCode: string,
    districtCode: string,
    displayName: string,
    address: string,
    code:string,
    locationType: number,
    controlId?: string
}
export interface ILocationSimple {
    id: string,
    code: string,
    display: string,
    address: string,
}