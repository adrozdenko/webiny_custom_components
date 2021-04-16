// We use these fields in every query / mutation below.
const ERROR_FIELDS = /* GraphQL */ `
    {
        code
        message
        data
    }
`;

export const GET_PROJECT = /* GraphQL */ `
    query GetProject(
        $id: ID!
    ) {
        projects {
            getProject(id: $id) {
                data {
                    id
                    title
                    description
                    isNice
                }
                error ${ERROR_FIELDS}
            }
        }
    }
`;

// A basic create "Project" mutation.
export const CREATE_PROJECT = /* GraphQL */ `
    mutation CreateProject($data: ProjectCreateInput!) {
        projects {
            createProject(data: $data) {
                data {
                    id
                    title
                    description
                    isNice
                }
                error ${ERROR_FIELDS}
            }
        }
    }
`;

export const UPDATE_PROJECT = /* GraphQL*/ `
    mutation UpdateProject($id: ID!, $data: ProjectUpdateInput!) {
        projects {
            updateProject(id: $id, data: $data) {
                data {
                    id
                    title
                    description
                    isNice
                }
                error ${ERROR_FIELDS}
            }
        }
    }
`;

// A basic delete "Project" mutation.
export const DELETE_PROJECT = /* GraphQL */ `
    mutation DeleteProject($id: ID!) {
        projects {
            deleteProject(id: $id) {
                data
                error {
                    message
                    code
                    data
                }
            }
        }
    }
`;

// A basic list "Projects" query.
export const LIST_PROJECTS = /* GraphQL */ `
    query ListProjects(
        $where: ProjectListWhereInput
        $sort: [ProjectListSort!]
        $limit: Int
        $after: String
    ) {
        projects {
            listProjects(where: $where, sort: $sort, limit: $limit, after: $after) {
                data {
                    id
                    title
                    description
                    isNice
                }
                error ${ERROR_FIELDS}

            }
        }
    }
`;
