import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';

@Injectable()
export class JPDateAdapter extends NativeDateAdapter {
  override getDateNames(): string[] {
    return Array.from(Array(31), (v, k) => `${k + 1}`);
  }
}
