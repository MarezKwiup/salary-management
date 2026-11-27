import { expect, test } from '@playwright/test';

test('HR can go from the country overview to a country breakdown', async ({ page }) => {
    await page.goto('/insights');

    const india = page.getByRole('row', { name: /India/ });
    await expect(india).toContainText('₹'); // salaries shown in the country's own currency

    await page.getByRole('link', { name: 'India' }).click();

    await expect(page).toHaveURL(/\/insights\/IN$/);
    await expect(page.getByRole('heading', { name: 'India' })).toBeVisible();
    await expect(page.getByText('Median salary')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pay by job title' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Salary spend by department' })).toBeVisible();
});

test('switching country updates the page and the URL', async ({ page }) => {
    await page.goto('/insights/IN');

    await page.getByRole('combobox', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'Japan' }).click();

    await expect(page).toHaveURL(/\/insights\/JP$/);
    await expect(page.getByRole('heading', { name: 'Japan' })).toBeVisible();
});

test('an unknown country code goes back to the overview', async ({ page }) => {
    await page.goto('/insights/XX');
    await expect(page).toHaveURL(/\/insights$/);
});