export class PaginatedData<Type> {
  items: Type[];
  count: number;
  currentPage: number;
  nextPage: number;
  maxPage: number;

  constructor(items: Type[], count: number, currentPage: number, nextPage: number, maxPage: number) {
    this.items = items;
    this.count = count;
    this.currentPage = currentPage;
    this.nextPage = nextPage;
    this.maxPage = maxPage;
  }
}
