import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  @Transform(({ obj }) => {
    if (obj.user) {
      return obj.user.id;
    }

    return obj.userId;
  })
  @Expose()
  userId: number;

  @Expose()
  approved: boolean;
}
