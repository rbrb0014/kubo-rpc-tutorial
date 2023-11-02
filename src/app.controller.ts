import {
  Body,
  Controller,
  Get,
  Param,
  // Get,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // async getAPI(): Promise<string> {
  //   return this.appService.getAPI();
  // }

  @Post('/contents/:data')
  // @UseInterceptors(FileInterceptor('file'))
  async postContents(
    @Param('data') data: string,
    // @Res() res: Response,
    // @Body() body,
    // @UploadedFile(
    //   new ParseFilePipeBuilder()
    //     .addFileTypeValidator({ fileType: 'png' })
    //     .addMaxSizeValidator({ maxSize: 1000 * 1000 * 1000 }) //
    //     .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    // )
    // file: Express.Multer.File,
  ) {
    // const image = `data:${file.mimetype};base64,${file.buffer.toString(
    //   'base64',
    // )}`;
    // return image;
    return this.appService.postContents(data);
  }

  @Get('/contents')
  async getContents(@Body() body: { path: string }) {
    return this.appService.getContents(body.path);
  }
}
