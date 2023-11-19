import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { EntityManager } from 'typeorm';
import { promisify } from 'util';
import { Data } from './entities/data.entity';
// import { create, IPFSHTTPClient } from 'kubo-rpc-client';

@Injectable()
export class AppService {
  constructor(private readonly entityManager: EntityManager) {}
  // private client: IPFSHTTPClient;
  // async getAPI(): Promise<string> {
  //   this.client = create();
  //   const result = await this.client.id();
  //   return result.id.toString();
  // }
  async postContents(data: string) {
    const split_count = 5;
    const frag_length = data.length / split_count;
    const fragments: string[] = [];
    for (let i = 0; i < split_count; i++) {
      fragments.push(
        data.substring(
          i * frag_length,
          Math.min((i + 1) * frag_length, data.length),
        ),
      );
    }

    const iv = Buffer.from('passwordpassword').subarray(0, 16);
    const dbData = this.entityManager.create(Data, {
      path: '/asdf',
      cids: [],
      keys: [],
    });
    for (let i = 0; i < split_count; i++) {
      const frag = fragments[i];
      const key = (await promisify(scrypt)(dbData.path, 'salt', 32)) as Buffer;
      // console.log(key);
      const cipher = createCipheriv('aes-256-ctr', key, iv);
      const encrypted = Buffer.concat([
        cipher.update(frag, 'utf8'),
        cipher.final(),
      ]);
      dbData.cids.push(encrypted.toString('hex'));
      dbData.keys.push(key.toString('hex'));
    }

    return dbData.save();
  }

  async getContents(path: string) {
    const decrypts: string[] = [];
    const dbData = await this.entityManager.findOneBy(Data, { path });
    console.log(dbData.cids);
    for (let i = 0; i < 5; i++) {
      const key = Buffer.from(dbData.keys[i], 'hex');
      const decipher = createDecipheriv(
        'aes-256-ctr',
        key,
        Buffer.from('passwordpassword').subarray(0, 16),
      );
      const encryptedText = Buffer.from(dbData.cids[i], 'hex');
      const decryptedText = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
      ]);
      console.log(decryptedText);
      decrypts.push(decryptedText.toString('utf8'));
    }

    return decrypts;
  }
}
