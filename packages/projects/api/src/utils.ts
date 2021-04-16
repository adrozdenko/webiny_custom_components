import WebinyError from "@webiny/error";
import { ApplicationUtils } from "./types";

export const utils: ApplicationUtils = {
    /**
     * DynamoDB table.
     */
    db: () => ({
        table: process.env.DB_TABLE_PROJECT,
        keys: [
            {
                primary: true,
                unique: true,
                name: "primary",
                fields: [
                    {
                        name: "PK"
                    },
                    {
                        name: "SK"
                    }
                ]
            }
        ]
    }),
    /**
     * DynamoDB to Elasticsearch stream table definition.
     * Can be removed if Elasticsearch is not used.
     */
    esDb: () => ({
        table: process.env.DB_TABLE_ELASTICSEARCH,
        keys: [
            {
                primary: true,
                unique: true,
                name: "primary",
                fields: [
                    {
                        name: "PK"
                    },
                    {
                        name: "SK"
                    }
                ]
            }
        ]
    }),
    /**
     * Elasticsearch config is created with tenant in mind. So different tenants do not have access to each others data.
     * Can be removed if Elasticsearch is not used.
     */
    es(context) {
        const tenant = context.security.getTenant();
        if (!tenant) {
            throw new WebinyError(`There is no tenant on "context.security".`);
        }
        return {
            index: `${tenant.id}-project`
        };
    },
    /**
     * Primary key for the DynamoDB.
     * It is constructed out of tenant, so different tenants do not have access to others data, and a name of this API entity.
     */
    createPk: (context, id) => {
        const tenant = context.security.getTenant();
        if (!tenant) {
            throw new WebinyError(`There is no tenant on "context.security".`);
        }
        return `T#${tenant.id}#project#${id}`;
        /**
         * If you want to use different locales per project, uncomment code below.
         * And remove the return above.
         */
        // const locale = context.i18n.getCurrentLocale();
        // if (!locale) {
        //     throw new WebinyError(`There is no locale on "context.i18n".`)
        // }
        // return `T#${tenant.id}#L#${locale.code}#project#${id}`;
    }
};
