import { GridFilterModel } from "@mui/x-data-grid";

// Example: convert filter model to query parameters (adjust to your API)
export function buildFilterQuery(filterModel: GridFilterModel): Promise<string> {
    const queries: string[] = [];
    filterModel.items.forEach((item) => {
        const { field, operator, value } = item;
        if (operator === 'isEmpty') {
            queries.push(`${field}_empty=true`);
        }
        else if (operator === 'isNotEmpty') {
            queries.push(`${field}_empty=false`);
        } else {
            if (value === null || value === undefined || value === '') return '';
            switch (operator) {
                case 'contains':
                    queries.push(`${field}_like=${encodeURIComponent(value)}`);
                    break;
                case 'doesNotContain':
                    queries.push(`${field}_not_like=${encodeURIComponent(value)}`);
                    break;
                case 'equals':
                    queries.push(`${field}=${encodeURIComponent(value)}`);
                    break;
                case 'doesNotEqual':
                    queries.push(`${field}_ne=${encodeURIComponent(value)}`);
                    break;
                case 'startsWith':
                    queries.push(`${field}_starts=${encodeURIComponent(value)}`);
                    break;
                case 'endsWith':
                    queries.push(`${field}_ends=${encodeURIComponent(value)}`);
                    break;
                case 'isAnyOf':
                    // Assuming value is an array
                    if (Array.isArray(value)) {
                        queries.push(`${field}_in=${value.map(v => encodeURIComponent(v)).join(',')}`);
                    }
                    break;
                default:
                    break;
            }
        }
    });
    return Promise.resolve(queries.join('&'));
}