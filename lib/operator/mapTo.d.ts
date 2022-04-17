import type { Collection } from '../api';
import type { ArrayColl } from '../collection/array';

declare class MapToCollection<Source, Result> extends ArrayColl<Result> {
  constructor(source: Collection<Source>, mapFunc: (item: Source) => Result);
}
