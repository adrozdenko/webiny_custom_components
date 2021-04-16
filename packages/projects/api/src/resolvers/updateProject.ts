import { ErrorResponse, Response, NotFoundResponse } from "@webiny/handler-graphql";
import { utils } from "../utils";
import { ApplicationContext, ResolverResponse, Project, UpdateProjectArgs } from "../types";

/**
 * Keys to be filtered out of the DynamoDB record.
 */
const excludeKeys = ["PK", "SK"];

const updateProject = async (
    _,
    args: UpdateProjectArgs,
    context: ApplicationContext
): Promise<ResolverResponse<Project>> => {
    const { db } = context;
    const { id, data } = args;
    /**
     * Primary key is always constructed out of the id and a fixed Project configuration.
     */
    const primaryKey = utils.createPk(context, id);
    /**
     * First we need to check if the project we want to update is actually in the database.
     */
    const [[item]] = await db.read<Project>({
        ...utils.db(context),
        query: {
            PK: primaryKey,
            SK: id
        },
        limit: 1
    });
    if (!item) {
        return new NotFoundResponse(`Project with id "${id}" not found.`);
    }
    /**
     * If there is no data sent, we do not need to proceed to updating the project.
     * Some proper validation should be inserted instead of part.
     */
    if (Object.keys(data).length === 0) {
        return new Response(item);
    }

    /**
     * Build the Project data model to be updated in the database.
     */
    const modelData: Project = {
        ...item,
        ...data,
        savedOn: new Date().toISOString()
    };
    /**
     * Remove the keys which are not needed later on.
     */
    const model: Project = Object.keys(modelData).reduce((acc, key) => {
        if (excludeKeys.includes(key)) {
            return acc;
        }
        acc[key] = modelData[key];
        return acc;
    }, ({} as unknown) as Project);
    /**
     * Create the index name that is going to be used when streaming from DDB to Elasticsearch.
     * Can be removed if Elasticsearch is not used.
     */
    const { index: esIndex } = utils.es(context);
    /**
     * We do operations in batch, when possible, so there are no multiple calls towards the DynamoDB.
     */
    const batch = db.batch();
    batch
        /**
         * Update the DynamoDB project record.
         */
        .update({
            ...utils.db(context),
            query: {
                PK: primaryKey,
                SK: id
            },
            data: {
                PK: primaryKey,
                SK: id,
                ...model,
                /**
                 * We always insert the version of Webiny this project was created with so it can be used later for upgrades.
                 */
                webinyVersion: context.WEBINY_VERSION
            }
        })
        /**
         * Update the DynamoDB project record in stream table.
         * Can be removed if Elasticsearch is not used.
         */
        .update({
            ...utils.esDb(context),
            query: {
                PK: primaryKey,
                SK: id
            },
            data: {
                PK: primaryKey,
                SK: id,
                /**
                 * Elasticsearch index that is this table streaming to.
                 */
                index: esIndex,
                data: {
                    ...model,
                    webinyVersion: context.WEBINY_VERSION
                }
            }
        });
    /**
     * Try to update the data in the DynamoDB. Fail with response if error happens.
     */
    try {
        await batch.execute();
    } catch (ex) {
        return new ErrorResponse({
            message: ex.message,
            code: ex.code || "PROJECT_UPDATE_ERROR",
            data: ex
        });
    }

    return new Response(model);
};

export default updateProject;
