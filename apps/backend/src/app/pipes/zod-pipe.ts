import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: any) {}

  transform(value: unknown) {
    this.schema.parse(value);
    return value;
  }
}
