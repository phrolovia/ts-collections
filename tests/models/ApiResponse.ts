export interface ApiResponseLoading {
    status: "loading";
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
