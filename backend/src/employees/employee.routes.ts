import { Router } from 'express';
import {
    createEmployeeSchema,
    employeeIdSchema,
    listEmployeesQuerySchema,
    updateEmployeeSchema,
} from './employee.validation';
import type { EmployeeService } from './employee.service';

export function employeeRouter(service: EmployeeService): Router {
    const router = Router();

    router.post('/', async (req, res) => {
        const body = createEmployeeSchema.parse(req.body);
        const employee = await service.create(body);
        res.status(201).json(employee);
    });

    router.get('/:id', async (req, res) => {
        const { id } = employeeIdSchema.parse(req.params);
        res.json(await service.getById(id));
    });

    router.patch('/:id', async (req, res) => {
        const { id } = employeeIdSchema.parse(req.params);
        const changes = updateEmployeeSchema.parse(req.body);
        res.json(await service.update(id, changes));
    });

    router.delete('/:id', async (req, res) => {
        const { id } = employeeIdSchema.parse(req.params);
        await service.delete(id);
        res.status(204).send();
    });

    router.get('/', async (req, res) => {
        const query = listEmployeesQuerySchema.parse(req.query);
        res.json(await service.list(query));
    });

    return router;
}
