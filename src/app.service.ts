import { Injectable } from '@nestjs/common';
import { create, IPFSHTTPClient } from 'kubo-rpc-client';

@Injectable()
export class AppService {
  private client: IPFSHTTPClient;
  async getAPI(): Promise<string> {
    this.client = create();
    const result = await this.client.id();
    return result.id.toString();
  }
}
