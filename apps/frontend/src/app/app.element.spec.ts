import { AppRoot } from './app.element';

describe('AppRoot', () => {
  let app: AppRoot;

  beforeEach(() => {
    app = new AppRoot();
  });

  it('should create successfully', () => {
    expect(app).toBeTruthy();
  });
});
