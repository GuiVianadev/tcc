export class TitleAlreadyExistsError extends Error {
  constructor() {
    super("Esse título já existe, Coloque outro!");
  }
}
