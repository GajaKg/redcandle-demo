import { HttpContextToken } from "@angular/common/http";

// creating the token with data to pass with the request
export const NoToastMessage = new HttpContextToken<boolean>(() => true);
