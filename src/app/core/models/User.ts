/* eslint-disable @typescript-eslint/naming-convention */
export interface User {
    phoneNumber: string;
    displayName?: string;
    accessToken: string;
    role?: string;
}

export enum UserType {
    CTV = 'CTV',
    DAI_LY = 'DAI_LY'

}
