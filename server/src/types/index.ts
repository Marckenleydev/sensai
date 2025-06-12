
export interface IClerkUser {
    id: string,
    firstName: string | null,
    lastName: string | null,
    imageUrl: string;
    emailAddresses: Array<{
        emailAddress:string
    }> 
}
export interface AuthenticatedRequest extends Request {
  clerkUser?: IClerkUser;
}