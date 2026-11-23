import express from "express";
import { EmployeeService } from "./employees/employee.service";
import { employeeRouter } from "./employees/employee.routes";
import { errorHandler, notFound } from "./middleware/errors";

export interface AppDeps {
    employeeService: EmployeeService;
}

export function createApp({ employeeService }: AppDeps) {
    const app = express();

    app.use(express.json({ limit: '100kb' }));
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' })
    })
    app.use('/employees', employeeRouter(employeeService));
    app.use(notFound);
    app.use(errorHandler);
    return app;
}