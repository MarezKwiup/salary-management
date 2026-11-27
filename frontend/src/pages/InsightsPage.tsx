import { BarChart } from "@mantine/charts";
import { Alert, Center, Loader, Paper, Stack, Text, Title } from "@mantine/core";
import { useCountryOverview } from "../api/insights";
import { CountryOverviewTable } from "../features/insights/CountryOverviewTable";
import { COUNTRIES } from "../lib/countries";

export function InsightsPage() {
    const { data, isPending, isError } = useCountryOverview();

    const rows = data ? [...data].sort((a, b) => b.headcount - a.headcount) : undefined;
    
    return (
        <Stack>
            <div>
                <Title order={2}>Salary insights</Title>
                <Text c='dimmed' size="sm">
                    Salaries are shown in each country's own currency and are never converted or
                    combined across countries. Select a country for a breakdown by job title and
                    department.
                </Text>
            </div>

            {isPending && (
                <Center py='xl'>
                    <Loader />
                </Center>
            )}
            {isError && (
                <Alert color="red" title='Could not load insights'>
                    Please check that the server is running and try agian.
                </Alert>
            )}
            {rows && rows.length === 0 && (
                <Text c='dimmed' ta='center' py='xl'>
                    No employees yet. Add some on the Employees page to see insights.
                </Text>
            )}

            {rows && rows.length > 0 && (
                <>
                    <CountryOverviewTable rows={rows} />
                    <Paper withBorder p='md' radius='md'>
                        <Title order={4} mb='md'>
                            Headcount by country
                        </Title>
                        <BarChart
                            h={260}
                            data={rows.map((row) => ({
                                country: COUNTRIES[row.country]?.name ?? row.country,
                                headcount: row.headcount
                            }))}
                            dataKey="country"
                            series={[{ name: 'headcount', label: 'Employees', color: 'blue.6' }]}
                            gridAxis="y"
                        />
                    </Paper>
                </>
            )}
        </Stack>
    )
}