import { createApp } from './app.js';
import { env } from './config/env.js';
import { createDb } from './db/client.js';
import { PgEmployeeRepository } from './employees/employee.repository.js';
import { EmployeeService } from './employees/employee.service.js';

const { db } = createDb(env.DATABASE_URL);
const employeeService = new EmployeeService(new PgEmployeeRepository(db));
const app = createApp({ employeeService });
const server = app.listen(env.PORT, () => {
  console.log(`Server listening on PORT: ${env.PORT}`);
});

function shutdown(signal: string) {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
