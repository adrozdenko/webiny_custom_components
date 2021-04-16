import { ListProjectsWhere } from "./types";

/**
 * A basic filtering functionality for Elasticsearch.
 */
export const createElasticsearchQuery = (where?: ListProjectsWhere) => {
    if (!where || Object.keys(where).length === 0) {
        return undefined;
    }
    const query = {
        must: [],
        mustNot: []
    };
    if (where.id) {
        query.must.push({
            term: {
                ["id.keyword"]: where.id
            }
        });
    }
    if (where.id_in) {
        query.must.push({
            terms: {
                ["id.keyword"]: where.id_in
            }
        });
    }
    if (where.id_not) {
        query.mustNot.push({
            term: {
                ["id.keyword"]: where.id_not
            }
        });
    }
    if (where.id_not_in) {
        query.mustNot.push({
            terms: {
                ["id.keyword"]: where.id_not_in
            }
        });
    }
    if (where.savedOn_gt) {
        query.must.push({
            range: {
                savedOn_gt: {
                    gt: where.savedOn_gt
                }
            }
        });
    }
    if (where.savedOn_lt) {
        query.must.push({
            range: {
                savedOn_lt: {
                    lt: where.savedOn_lt
                }
            }
        });
    }
    if (where.createdOn_gt) {
        query.must.push({
            range: {
                createdOn_gt: {
                    gt: where.createdOn_gt
                }
            }
        });
    }
    if (where.createdOn_lt) {
        query.must.push({
            range: {
                createdOn_lt: {
                    lt: where.createdOn_lt
                }
            }
        });
    }
    if (where.title_contains) {
        query.must.push({
            query_string: {
                allow_leading_wildcard: true,
                fields: "title",
                query: `*${where.title_contains}*`
            }
        });
    }
    if (where.title_not_contains) {
        query.mustNot.push({
            query_string: {
                allow_leading_wildcard: true,
                fields: "title",
                query: `*${where.title_not_contains}*`
            }
        });
    }
    if (where.isNice !== undefined) {
        query.must.push({
            term: {
                ["isNice.keyword"]: where.isNice
            }
        });
    }

    return query;
};

export const encodeElasticsearchCursor = (cursor?: any) => {
    if (!cursor) {
        return null;
    }

    return Buffer.from(JSON.stringify(cursor)).toString("base64");
};

export const decodeElasticsearchCursor = (cursor?: string) => {
    if (!cursor) {
        return null;
    }

    return JSON.parse(Buffer.from(cursor, "base64").toString("ascii"));
};

/**
 * Fields that will have unmapped_type set to "date". Without this, sorting by date does not work.
 */
const dateTypeFields = ["createdOn", "savedOn"];
export const createElasticsearchSort = (sort?: string[]) => {
    if (!sort || sort.length === 0) {
        return [
            {
                createdOn: {
                    order: "DESC",
                    // eslint-disable-next-line
                    unmapped_type: "date"
                }
            }
        ];
    }
    return sort.map(s => {
        const [field, order] = s.split("_");
        const fieldName = dateTypeFields.includes(field) ? field : `${field}.keyword`;
        return {
            [fieldName]: {
                order: order === "ASC" ? "ASC" : "DESC",
                // eslint-disable-next-line
                unmapped_type: dateTypeFields.includes(field) ? "date" : undefined
            }
        };
    });
};
