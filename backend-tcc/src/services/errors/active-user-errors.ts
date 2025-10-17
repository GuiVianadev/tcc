export class ActiveUserError extends Error {
  constructor() {
    super("The user is active");
  }
}
