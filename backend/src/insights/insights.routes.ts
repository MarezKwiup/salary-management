import { Router } from 'express';
import { countryParamSchema } from './insights.validation';
import type { InsightsService } from './insights.service';

export function insightsRouter(service: InsightsService): Router {
    const router = Router();

    router.get('/countries', async (req, res) => {
        const overview = await service.countriesOverview();
        res.status(200).json(overview);
    });

    router.get('/countries/:country', async (req, res) => {
        const { country } = countryParamSchema.parse(req.params);
        res.json(await service.getCountryDetail(country));
    });

    return router;
}
