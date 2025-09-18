export interface ApiResponseLoading {
    status: "loading";
    estimatedTime: number; // in milliseconds
}

export interface ApiResponseSuccess<T> {
    status: "success";
    data: T;
}

export interface ApiResponseError {
    status: "error";
    error: string;
}

export type ApiResponse<T> = ApiResponseLoading | ApiResponseSuccess<T> | ApiResponseError;

export const isSuccess = <T>(response: ApiResponse<T>): response is ApiResponseSuccess<T> => {
    return response.status === "success";
}

export const isError = <T>(response: ApiResponse<T>): response is ApiResponseError => {
    return response.status === "error";
}

export const isLoading = <T>(response: ApiResponse<T>): response is ApiResponseLoading => {
    return response.status === "loading";
}
