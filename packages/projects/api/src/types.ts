import { ContextInterface } from "@webiny/handler/types";
import { DbContext } from "@webiny/handler-db/types";
import { HttpContext } from "@webiny/handler-http/types";
import { I18NContext } from "@webiny/api-i18n/graphql/types";
import { BaseI18NContentContext } from "@webiny/api-i18n-content/types";
import { ElasticSearchClientContext } from "@webiny/api-plugin-elastic-search-client/types";
import { TenancyContext } from "@webiny/api-security-tenancy/types";

/**
 * The context that is available to you.
 */
export interface ApplicationContext
    extends ContextInterface,
        DbContext,
        HttpContext,
        I18NContext,
        BaseI18NContentContext,
        ElasticSearchClientContext,
        TenancyContext {}

interface ApplicationUtilsDbKeyField {
    name: string;
}

interface ApplicationUtilsDbKey {
    primary: boolean;
    unique: boolean;
    name: string;
    fields: ApplicationUtilsDbKeyField[];
}

interface ApplicationUtilsDb {
    table?: string;
    keys: ApplicationUtilsDbKey[];
}

interface ApplicationUtilsEs {
    index: string;
}

/**
 * Description of the utils helper.
 */
export interface ApplicationUtils {
    /**
     * Method to create the DynamoDB table configuration.
     */
    db: (context: ApplicationContext) => ApplicationUtilsDb;
    /**
     * Method to create the DynamoDB to Elasticsearch stream table configuration.
     * Can be removed if Elasticsearch is not used.
     */
    esDb: (context: ApplicationContext) => ApplicationUtilsDb;
    /**
     * Method to create the Elasticsearch configuration.
     * Can be removed if Elasticsearch is not used.
     */
    es: (context: ApplicationContext) => ApplicationUtilsEs;
    /**
     * Method to create the PrimaryKey for the Project in DynamoDB tables.
     */
    createPk: (context: ApplicationContext, id: string) => string;
}

/**
 * Resolver response for single project query or mutation.
 */
export interface ResolverResponse<T extends unknown> {
    data: T;
    error?: any;
}

/**
 * Resolver response for list of projects query.
 */
export interface ListResolverResponse<T extends unknown> {
    data: T[];
    meta?: {
        cursor: string | null;
        hasMoreItems: boolean;
        totalCount: number;
    };
    error?: any;
}

interface Identity {
    id: string;
    displayName: string;
    type: string;
}

/**
 * Definition for the Project model in the code.
 */
export interface Project {
    // system fields
    id: string;
    createdOn: string;
    savedOn: string;
    createdBy: Identity;
    savedBy: Identity;
    // user defined values
    title: string;
    description?: string;
    isNice: boolean;
}

/**
 * Mutation arguments definition for the creation of the Project.
 */
export interface CreateProjectArgs {
    data: {
        title: string;
        description?: string;
        isNice?: boolean;
    };
}
/**
 * Mutation arguments definition for the update of the Project.
 */
export interface UpdateProjectArgs {
    id: string;
    data: {
        title: string;
        description?: string;
        isNice: boolean;
    };
}
/**
 * Mutation arguments definition for the deletion of the Project.
 */
export interface DeleteProjectArgs {
    id: string;
}

/**
 * Query arguments defition to fetch a single Project.
 */
export interface GetProjectArgs {
    id: string;
}

/**
 * Where definition when fetching a list of Projects.
 */
export interface ListProjectsWhere {
    // system fields
    id?: string;
    id_in?: string[];
    id_not?: string;
    id_not_in?: string[];
    savedOn_gt: Date;
    savedOn_lt: Date;
    createdOn_gt: Date;
    createdOn_lt: Date;
    // custom fields fields
    title_contains: string;
    title_not_contains: string;
    isNice: boolean;
}

/**
 * Query arguments definition to fetch a list of Projects.
 */
export interface ListProjectsArgs {
    where?: ListProjectsWhere;
    sort?: string[];
    limit?: number;
    after?: string;
}
