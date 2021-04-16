const graphql = /* GraphQL */ `
    # response for the delete mutation
    type ProjectDeleteResponse {
        data: Boolean
        error: ProjectError
    }
    # meta property containing:
    #   cursor - the last project received in the list
    #   hasMoreItems - if there are more projects to load
    #   totalCount - total amount of projects that can be fetched with given query
    type ProjectListMeta {
        cursor: String
        hasMoreItems: Boolean!
        totalCount: Int!
    }
    # response error definition
    type ProjectError {
        code: String!
        message: String!
        data: JSON
    }
    # project is created by whom?
    type CreatedByResponse {
        id: String!
        displayName: String!
        type: String!
    }
    # project definition
    type Project {
        id: ID!
        createdOn: DateTime!
        savedOn: DateTime!
        createdBy: CreatedByResponse!
        title: String!
        description: String
        isNice: Boolean!
    }
    # input definition when creating the project
    input ProjectCreateInput {
        title: String!
        description: String
        isNice: Boolean
    }
    # input definition when updating the project
    input ProjectUpdateInput {
        title: String
        description: String
        isNice: Boolean
    }
    # possible where filters when listing projects
    input ProjectListWhereInput {
        # system fields
        id: String
        id_in: [String!]
        id_not: String
        id_not_in: [String!]
        savedOn_gt: DateTime
        savedOn_lt: DateTime
        createdOn_gt: DateTime
        createdOn_lt: DateTime

        # custom fields
        title_contains: String
        title_not_contains: String
        isNice: Boolean
    }
    # possible sort options when listing projects
    enum ProjectListSort {
        title_ASC
        title_DESC
        createdOn_ASC
        createdOn_DESC
        savedOn_ASC
        savedOn_DESC
    }
    # Response type when querying targe
    type ProjectResponse {
        data: Project
        error: ProjectError
    }
    # Response type when listing projects
    type ProjectListResponse {
        data: [Project]
        meta: ProjectListMeta
        error: ProjectError
    }
    # A type definition to add the Elasticsearch index
    type InstallResponse {
        data: Boolean
        error: ProjectError
    }
    # A type definition to remove the Elasticsearch index
    type UninstallResponse {
        data: Boolean
        error: ProjectError
    }

    type ProjectQuery {
        getProject(id: ID!): ProjectResponse!

        listProjects(
            where: ProjectListWhereInput
            sort: [ProjectListSort!]
            limit: Int
            after: String
        ): ProjectListResponse!

        isInstalled: InstallResponse!
    }

    type ProjectMutation {
        createProject(data: ProjectCreateInput!): ProjectResponse!

        updateProject(id: ID!, data: ProjectUpdateInput!): ProjectResponse!

        deleteProject(id: ID!): ProjectDeleteResponse!

        install: InstallResponse!

        uninstall: UninstallResponse!
    }
    # we need to extend the original Query with projects so we can write a query like { projects: { listProjects {...} } }
    extend type Query {
        projects: ProjectQuery
    }
    # we need to extend the original Mutation with projects so we can write a mutation like { projects: { createProject {...} } }
    extend type Mutation {
        projects: ProjectMutation
    }
`;
export default graphql;
