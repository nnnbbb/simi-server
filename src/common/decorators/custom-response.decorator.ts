import { applyDecorators, HttpCode, HttpStatus, Type, UseInterceptors } from "@nestjs/common";
import { ApiResponse, ApiResponseOptions } from "@nestjs/swagger";
import { TransformInterceptor } from "../interceptors/transform.interceptor";

export function CustomResponse<T>(options: ApiResponseOptions & { type: Type<T> }) {
  const { type } = options
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      ...options,
    }),
    UseInterceptors(new TransformInterceptor(type)),
    HttpCode(HttpStatus.OK),
  );
}