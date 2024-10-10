import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './entity/grade.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grade])
  ],
  providers: [GradeService],
  exports: [GradeService],
})
export class GradeModule {}
