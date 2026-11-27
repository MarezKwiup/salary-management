import { Alert, Anchor, Badge, Center, Group, Loader, Paper, Select, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { useCountryDetail } from '../api/insights';
import { DepartmentChart } from '../features/insights/DepartmentChart';
import { JobTitleTable } from '../features/insights/JobTitleTable';
import { StatCards } from '../features/insights/StatCards';
import { COUNTRIES, COUNTRY_CODES, isCountryCode, type CountryCode } from '../lib/countries';

const countryOptions = COUNTRY_CODES.map((code) => ({ value: code, label: COUNTRIES[code].name }));

export function CountryInsightsPage() {
    const { country = '' } = useParams();
    const code = country.toUpperCase();

    if (!isCountryCode(code)) return <Navigate to='/insights' replace />;
    return <CountryInsights country={code} />
}

function CountryInsights({ country }: { country: CountryCode }) {
    const navigate = useNavigate();
    const { data, isPending, isError } = useCountryDetail(country);

    return (
        <Stack>
            <Anchor component={Link} to='/insights' size='sm'>
                <Group gap={4}>
                    <IconArrowLeft size={14} /> All countries
                </Group>
            </Anchor>

            <Group justify='space-between' align='end'>
                <Group gap='sm' align='center'>
                    <Title order={2}>{COUNTRIES[country].name}</Title>
                    <Badge variant='light'>{COUNTRIES[country].currency}</Badge>
                </Group>
                <Select
                    aria-label='Country'
                    data={countryOptions}
                    value={country}
                    onChange={(value) => value && navigate(`/insights/${value}`)}
                    allowDeselect={false}
                    w={220}
                />
            </Group>

            {isPending && (
                <Center py='xl'>
                    <Loader />
                </Center>
            )}
            {isError && (
                <Alert color='red' title='Could not load insights'>
                    Please check that the server is running and try again.
                </Alert>
            )}

            {data && data.summary.headcount === 0 && (
                <Text c='dimmed' ta='center' py='xl'>
                    No employees in {data.countryName} yet.
                </Text>
            )}

            {data && data.summary.headcount > 0 && (
                <>
                    <StatCards stats={data.summary} country={country} />

                    <Paper withBorder p='md' radius='md'>
                        <Title order={4}>Pay by job title</Title>
                        <Text c='dimmed' size='sm' mb='sm'>
                            Highest average first.
                        </Text>
                        <JobTitleTable rows={data.jobTitles} country={country} />
                    </Paper>

                    <Paper withBorder p='md' radius='md'>
                        <Title order={4}>Salary spend by department</Title>
                        <Text c='dimmed' size='sm' mb='md'>
                            Total annual salaries in {data.currency}.
                        </Text>
                        <DepartmentChart rows={data.departments} country={country} />
                    </Paper>
                </>
            )}
        </Stack>
    );
}