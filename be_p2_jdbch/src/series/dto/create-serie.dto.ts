import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSerieDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo título es obligatorio' })
  @IsString({ message: 'El campo título debe ser de tipo cadena' })
  @MaxLength(250, {
    message: 'El campo título no debe ser mayor a 250 caracteres',
  })
  readonly titulo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo sinopsis es obligatorio' })
  @IsString({ message: 'El campo sinopsis debe ser de tipo cadena' })
  @MaxLength(5000, {
    message: 'El campo sinopsis no debe ser mayor a 5000 caracteres',
  })
  readonly sinopsis: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo director es obligatorio' })
  @IsString({ message: 'El campo director debe ser de tipo cadena' })
  @MaxLength(100, {
    message: 'El campo director no debe ser mayor a 100 caracteres',
  })
  readonly director: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo temporadas es obligatorio' })
  @IsInt({ message: 'El campo temporadas debe ser un número entero' })
  @Min(1, { message: 'El campo temporadas debe ser al menos 1' })
  readonly temporadas: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo fechaEstreno debe estar definido' })
  @IsDateString({}, { message: 'El campo fechaEstreno debe ser de tipo fecha' })
  readonly fechaEstreno: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo genero es obligatorio' })
  @IsString({ message: 'El campo genero debe ser de tipo cadena' })
  @MaxLength(100, {
    message: 'El campo genero no debe ser mayor a 100 caracteres',
  })
  readonly tipoGenero: string;
}
