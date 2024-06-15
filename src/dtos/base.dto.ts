import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { ToNumbers } from '@/utils/decorators'

export class ListDto {
  @IsOptional()
  @Transform(({ value }) => value && +value)
  @IsNumber()
  page?: number

  @IsOptional()
  @Transform(({ value }) => value && +value)
  @IsNumber()
  limit?: number

  @IsOptional()
  sortBy?: [string, string][]

  @IsOptional()
  searchBy?: string[]

  @IsOptional()
  search?: string

  @IsOptional()
  filter?: { [column: string]: string | string[] }

  @IsOptional()
  select?: string[]

  @IsOptional()
  path?: string
}

export class ParamIdDto {
  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  id: number
}

export class BulkIdsDto {
  @ToNumbers()
  @IsNotEmpty()
  @IsPositive({ each: true })
  ids: number[]
}

export class UploadImageDto {
  @IsOptional()
  image: string
}
