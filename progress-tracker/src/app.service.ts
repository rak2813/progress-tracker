import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiBaseUrlEnv(): string {
    return process.env.API_BASE_URL;
  }
}
