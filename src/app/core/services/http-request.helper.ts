import { HttpParams } from "@angular/common/http";
import { ParamsTypes } from "../types/http-request-helper.types";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class HttpRequestHelper {

  buildQueryParams(params: ParamsTypes) {
    let httpParams = new HttpParams();

    for (const [key, value] of Object.entries(params)) {
      httpParams = httpParams.set(key, value);
    }

    return httpParams;
  }
}
