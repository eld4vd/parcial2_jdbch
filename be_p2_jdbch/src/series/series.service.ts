import { Injectable } from '@nestjs/common';
import { CreateSerieDto } from './dto/create-serie.dto';
import { UpdateSerieDto } from './dto/update-serie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Serie } from './entities/serie.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Serie) private seriesRepository: Repository<Serie>,
  ) {}

  async create(createSeriesDto: CreateSerieDto): Promise<Serie> {
    const existe = await this.seriesRepository.findOneBy({
      titulo: createSeriesDto.titulo,
    });

    if (existe) {
      throw new Error('La serie ya existe');
    }

    const serie = new Serie();
    serie.titulo = createSeriesDto.titulo.trim();
    serie.sinopsis = createSeriesDto.sinopsis.trim();
    serie.director = createSeriesDto.director.trim();
    serie.temporadas = createSeriesDto.temporadas;
    serie.fechaEstreno = new Date(createSeriesDto.fechaEstreno);
    return this.seriesRepository.save(serie);
  }

  async findAll(): Promise<Serie[]> {
    return this.seriesRepository.find();
  }

  async findOne(id: number): Promise<Serie> {
    const serie = await this.seriesRepository.findOneBy({ id });
    if (!serie) {
      throw new Error('La serie no existe');
    }
    return serie;
  }

  async update(id: number, updateSeriesDto: UpdateSerieDto): Promise<Serie> {
    const serie = await this.findOne(id);
    serie.titulo = updateSeriesDto.titulo.trim();
    serie.sinopsis = updateSeriesDto.sinopsis.trim();
    serie.director = updateSeriesDto.director.trim();
    serie.temporadas = updateSeriesDto.temporadas;
    serie.fechaEstreno = new Date(updateSeriesDto.fechaEstreno);
    return this.seriesRepository.save(serie);
  }

  async remove(id: number) {
    const serie = await this.findOne(id);
    return this.seriesRepository.softRemove(serie);
  }
}
