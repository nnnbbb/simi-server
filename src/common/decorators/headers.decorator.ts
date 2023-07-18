import { applyDecorators } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";
import { IS_PUBLIC_KEY } from "./public.decorator";

export function Headers() {
  return applyDecorators(
    ApiHeader({
      name: 'token',
      required: true,
      description: "TOEKN",
      schema: {
        default: process.env.NODE_ENV !== 'production' ? IS_PUBLIC_KEY : ""
      }
    })
  );
}