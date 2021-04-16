import { GraphQLSchemaPlugin } from "@webiny/handler-graphql/types";
import { ApplicationContext } from "./types";
import graphql from "./graphql";
import {
    getProject,
    isInstalled,
    listProjects,
    install,
    uninstall,
    createProject,
    updateProject,
    deleteProject
} from "./resolvers";

const emptyResolver = () => ({});

export default (): GraphQLSchemaPlugin<ApplicationContext> => ({
    type: "graphql-schema",
    name: "graphql-schema-project",
    schema: {
        /**
         * Schema definition for the GraphQL API.
         */
        typeDefs: graphql,
        resolvers: {
            Query: {
                projects: emptyResolver
            },
            Mutation: {
                projects: emptyResolver
            },
            ProjectQuery: {
                /**
                 * Get a single project by ID.
                 */
                getProject,
                /**
                 * List projects.
                 * Can be filtered with where argument.
                 * Can be sorted with sort argument.
                 */
                listProjects,
                /**
                 * Check if Elasticsearch index is created.
                 * Can be removed if Elasticsearch will not be used.
                 */
                isInstalled
            },
            ProjectMutation: {
                /**
                 * Create the Elasticsearch index.
                 * Can be removed if Elasticsearch will not be used.
                 */
                install,
                /**
                 * Delete the Elasticsearch index.
                 * Can be removed if Elasticsearch will not be used.
                 */
                uninstall,
                /**
                 * Store a single project into the database.
                 * It also stores into the Elasticsearch - if not removed.
                 */
                createProject,
                /**
                 * Store a single existing project into the database.
                 * It also stores into the Elasticsearch - if not removed.
                 */
                updateProject,
                /**
                 * Delete a single existing project from the database.
                 * It also deletes from the Elasticsearch - if not removed.
                 */
                deleteProject
            }
        }
    }
});
