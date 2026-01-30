import app from './app';
import { config } from './config/config';

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
