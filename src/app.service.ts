import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { EntityManager } from 'typeorm';
import { promisify } from 'util';
import { Data } from './entities/data.entity';
import { Fragment } from './entities/fragment.entity';
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
    console.log(fragments);

    const iv = Buffer.from('passwordpassword').subarray(0, 16);
    const dbData = this.entityManager.create(Data, {
      path: '/asdf',
      fragments: [],
    });
    await this.entityManager.transaction(
      async (entityManager: EntityManager) => {
        const loadedDbData = await entityManager.save(dbData);
        await entityManager.save(
          await Promise.all(
            fragments.map(async (frag) => {
              // The key length is dependent on the algorithm.
              // In this case for aes256, it is 32 bytes.
              const key = (await promisify(scrypt)(frag, 'salt', 32)) as Buffer;
              console.log(key);
              const cipher = createCipheriv('aes-256-ctr', key, iv);
              const encrypted = Buffer.concat([
                cipher.update(frag, 'utf8'),
                cipher.final(),
              ]);
              console.log(key.toString('hex'));
              console.log(Buffer.from(key.toString('hex'), 'hex'));
              return this.entityManager.create(Fragment, {
                cid: encrypted.toString('hex'),
                key: key.toString('hex'),
                data: loadedDbData,
              });
            }),
          ),
        );
      },
    );
    return 'ok';
  }

  async getContents(path: string) {
    // const encrypts: Buffer[] = [];
    const encrypts: string[] = [];
    const dbData = await this.entityManager.findOne(Data, {
      select: { fragments: true },
      where: { path },
      relations: { fragments: true },
    });
    for (let i = 0; i < 5; i++) {
      console.log(dbData.fragments[i].key);
      const key = Buffer.from(dbData.fragments[i].key, 'hex');
      console.log(key);
      const decipher = createDecipheriv(
        'aes-256-ctr',
        key,
        Buffer.from('passwordpassword').subarray(0, 16),
      );
      const encrypt = Buffer.concat([
        decipher.update(Buffer.from(dbData.fragments[i].cid, 'utf8')),
        decipher.final(),
      ]).toString('hex');
      encrypts.push(encrypt);
    }

    return encrypts;
  }
}
