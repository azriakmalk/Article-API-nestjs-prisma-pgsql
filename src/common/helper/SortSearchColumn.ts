import { ColumnMapping } from '.';
import { ServiceException } from '../exceptions';

type SortOrder = 'asc' | 'desc';

interface OrderBy {
  [key: string]: any;
}

interface Where {
  [key: string]: any;
}

function buildNestedObject(fieldPath: string, value: any) {
  return fieldPath
    .split('.')
    .reverse()
    .reduce((acc, curr) => ({ [curr]: acc }), value);
}

export function SortSearchColumn(
  sort_column: string | undefined,
  sort_desc: SortOrder | string | undefined,
  search_column: string | string[],
  search_text: string | string[],
  search: string,
  columnMapping: ColumnMapping,
  hasDeletedAt: boolean = false,
  searchFields?: string[], // New optional parameter
): { orderBy: OrderBy[]; where: Where } {
  const orderBy: OrderBy[] = [];
  const where: Where = {};
  const sort =
    sort_desc && ['asc', 'desc'].includes(sort_desc) ? sort_desc : 'desc';

  // Handle sorting
  if (sort_column && columnMapping[sort_column]) {
    const orderObj = buildNestedObject(columnMapping[sort_column].field, sort);
    orderBy.push(orderObj);
  } else {
    // Default sorting by id desc
    orderBy.push({ id: 'desc' });
  }

  // Handle specific searching
  if (
    Array.isArray(search_column) &&
    Array.isArray(search_text) &&
    search_column.length === search_text.length
  ) {
    const searchConditions = {};
    search_column.forEach((column, index) => {
      if (columnMapping[column]) {
        const searchValue = search_text[index];
        if (!searchConditions[column]) {
          searchConditions[column] = [];
        }
        searchConditions[column].push(searchValue);
      }
    });

    where.AND = [];
    for (const column in searchConditions) {
      const values = searchConditions[column];
      if (columnMapping[column]) {
        if (columnMapping[column].type === 'boolean') {
          const searchField = buildNestedObject(
            columnMapping[column].field,
            values[0] === 'true',
          );
          where.AND.push(searchField);
        } else {
          const searchField = buildNestedObject(columnMapping[column].field, {
            in: values.map((value) => {
              if (columnMapping[column].type === 'bigint') {
                return BigInt(value);
              } else {
                return value;
              }
            }),
          });
          where.AND.push(searchField);
        }
      }
    }
  } else if (
    typeof search_column === 'string' &&
    typeof search_text === 'string' &&
    columnMapping[search_column]
  ) {
    let searchField;
    if (columnMapping[search_column].type === 'boolean') {
      searchField = buildNestedObject(
        columnMapping[search_column].field,
        search_text === 'true',
      );
    } else if (columnMapping[search_column].type === 'bigint') {
      searchField = buildNestedObject(
        columnMapping[search_column].field,
        BigInt(search_text),
      );
    } else if (columnMapping[search_column].type === 'enum') {
      const search = columnMapping[search_column].enums?.[search_text];

      if (!search) throw new ServiceException('invalid search text');

      searchField = buildNestedObject(
        columnMapping[search_column].field,
        search,
      );
    } else {
      searchField = buildNestedObject(columnMapping[search_column].field, {
        contains: search_text,
        mode: 'insensitive',
      });
    }
    where.AND = [searchField];
  }

  // Handle global search
  if (search) {
    const globalSearch = [];
    const fieldsToSearch = searchFields || Object.keys(columnMapping);
    for (const column of fieldsToSearch) {
      if (columnMapping[column] && columnMapping[column].type === 'string') {
        const searchField = buildNestedObject(columnMapping[column].field, {
          contains: search,
          mode: 'insensitive',
          // startsWith: search, // Similar to 'searchString%'
        });
        globalSearch.push(searchField);
      }
    }
    if (!where.OR) {
      where.OR = globalSearch;
    } else {
      where.OR.push(...globalSearch);
    }
  }

  // Add default where condition if deleted_at column exists
  if (hasDeletedAt) {
    where.deleted_at = null;
  }

  return { orderBy, where };
}
