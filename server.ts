import './env';
import './globals';
import 'db';
import { app } from 'app';

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.info(`serv started on port ${PORT}`));
