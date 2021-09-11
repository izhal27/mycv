import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (request.currentUser) {
      console.log(request.currentUser.admin);

      return request.currentUser.admin;
    }

    return false;
  }
}
