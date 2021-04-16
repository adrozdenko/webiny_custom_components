import { ErrorResponse, Response, NotFoundResponse } from "@webiny/handler-graphql";
import { utils } from "../utils";
import { ApplicationContext, DeleteProjectArgs, ResolverResponse, Project } from "../types";

const deleteProject = async (
    _,
    args: DeleteProjectArgs,
    context: ApplicationContext
): Promise<ResolverResponse<boolean>> => {
    const { db } = context;
    const { id } = args;
    /**
     * Primary key is always constructed out of the id and a fixed Project configuration.
     */
    const primaryKey = utils.createPk(context, id);
    /**
     * First we need to check if the project we want to delete is actually in the database.
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
     * We do operations in batch, when possible, so there are no multiple calls towards the DynamoDB.
     */
    const batch = db.batch();
    batch.delete(
        /**
         * Delete the DynamoDB project record.
         */
        {
            ...utils.db(context),
            query: {
                PK: primaryKey,
                SK: id
            }
        },
        /**
         * Delete the DynamoDB project record in stream table.
         * Can be removed if Elasticsearch is not used.
         */
        {
            ...utils.esDb(context),
            query: {
                PK: primaryKey,
                SK: id
            }
        }
    );
    /**
     * Try to delete the data from the DynamoDB. Fail with response if error happens.
     */
    try {
        await batch.execute();
    } catch (ex) {
        return new ErrorResponse({
            message: ex.message,
            code: ex.code || "PROJECT_DELETE_ERROR",
            data: ex
        });
    }

    return new Response(true);
};

export default deleteProject;
