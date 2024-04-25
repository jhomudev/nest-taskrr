import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest().user,
);
