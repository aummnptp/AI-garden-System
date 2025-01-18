import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { Document, SubDocument } from './entities/docs.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Document,SubDocument])],
  controllers: [DocsController],
  providers: [DocsService],
})
export class DocsModule {}
