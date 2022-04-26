import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
const mime = require('mime-types');

type PresignAction = 'putObject' | 'getObject';


@Injectable()
export class FileService {
  private s3Storage = this.getS3Storage();

  constructor(private configService: ConfigService) { }

  async getPresignUrl(action: PresignAction, storagePath: string) {
    if (!this.isValidPath(storagePath))
      throw new HttpException("Invalid storage path", HttpStatus.BAD_REQUEST);

    const ContentType = this.getContentType(storagePath);

    const presignConfig = this.getPresignUrlConfig(storagePath, ContentType);
    const presignUrl = await this.s3Storage.getSignedUrlPromise(action, presignConfig);

    return { url: presignUrl };
  }

  getContentType(storagePath: string): string {
    const ContentType = mime.lookup(storagePath);
    if (!ContentType)
      throw new HttpException("Invalid ContentType", HttpStatus.BAD_REQUEST);
    return ContentType;
  }

  isValidPath(storagePath: string): boolean {
    return true;
  }

  getPresignUrlConfig(path: string, ContentType: string) {
    const FIVE_MINUTES = 60 * 5;
    return {
      Bucket: this.configService.get<string>('S3_IMAGE_STORAGE_NAME'),
      Key: path,
      Expires: FIVE_MINUTES,
      ContentType,
    };
  }

  getS3Storage() {
    return new S3({
      signatureVersion: 'v4',
      region: this.configService.get<string>('AWS_DEFAULT_REGION'),
      accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('S3_SECRET_ACCESS_KEY'),
    });
  }
}
