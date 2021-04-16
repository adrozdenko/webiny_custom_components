import useGqlHandler from "./useGqlHandler";
import {
    GET_PROJECT,
    CREATE_PROJECT,
    DELETE_PROJECT,
    LIST_PROJECTS,
    UPDATE_PROJECT
} from "./graphql/projects";

const projectsData = {
    project1: {
        title: "Project 1",
        description: "This is my 1st project.",
        isNice: false
    },
    project2: {
        title: "Project 2",
        description: "This is my 2nd project with isNice put to default (false)."
    },
    project3: {
        title: "Project 3",
        isNice: true
    }
};
/**
 * This is a simple test that asserts basic CRUD operations work as expected.
 * Feel free to update this test according to changes you made in the actual code.
 *
 * @see https://docs.webiny.com/docs/api-development/introduction
 */
describe("CRUD Test", () => {
    const {
        until,
        invoke,
        clearElasticsearchIndices,
        createElasticsearchIndices
    } = useGqlHandler();

    beforeEach(async () => {
        await clearElasticsearchIndices();
        await createElasticsearchIndices();
    });

    afterEach(async () => {
        await clearElasticsearchIndices();
    });

    const createProject = async (data: Record<string, any>) => {
        return await invoke({
            body: {
                query: CREATE_PROJECT,
                variables: {
                    data
                }
            }
        });
    };

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Let's create a couple of projects.
        const [project1] = await createProject(projectsData.project1);
        const [project2] = await createProject(projectsData.project2);
        const [project3] = await createProject(projectsData.project3);

        // if this `until` resolves successfully, we know projects are propagated into elasticsearch
        await until(
            () =>
                invoke({
                    body: {
                        query: LIST_PROJECTS
                    }
                }).then(([data]) => data),
            ({ data }) => data.projects.listProjects.data.length === 3,
            { name: "list after created projects" }
        );

        // 2. Now that we have projects created, let's see if they come up in a basic listProjects query.
        const [projectsListResponse] = await invoke({
            body: {
                query: LIST_PROJECTS
            }
        });

        expect(projectsListResponse).toEqual({
            data: {
                projects: {
                    listProjects: {
                        data: [
                            {
                                id: project3.data.projects.createProject.data.id,
                                ...projectsData.project3,
                                description: null
                            },
                            {
                                id: project2.data.projects.createProject.data.id,
                                ...projectsData.project2,
                                isNice: false
                            },
                            {
                                id: project1.data.projects.createProject.data.id,
                                ...projectsData.project1
                            }
                        ],
                        error: null
                    }
                }
            }
        });

        // 3. delete project2
        const [deleteResponse] = await invoke({
            body: {
                query: DELETE_PROJECT,
                variables: {
                    id: project2.data.projects.createProject.data.id
                }
            }
        });

        expect(deleteResponse).toEqual({
            data: {
                projects: {
                    deleteProject: {
                        data: true,
                        error: null
                    }
                }
            }
        });

        // if this `until` resolves successfully, we know the deleted project was deleted from elasticsearch
        await until(
            () =>
                invoke({
                    body: {
                        query: LIST_PROJECTS
                    }
                }).then(([data]) => data),
            ({ data }) => data.projects.listProjects.data.length === 2,
            { name: "list after deleted project" }
        );

        const [projectListAfterDeleteResponse] = await invoke({
            body: {
                query: LIST_PROJECTS
            }
        });

        expect(projectListAfterDeleteResponse).toEqual({
            data: {
                projects: {
                    listProjects: {
                        data: [
                            {
                                id: project3.data.projects.createProject.data.id,
                                ...projectsData.project3,
                                description: null
                            },
                            {
                                id: project1.data.projects.createProject.data.id,
                                ...projectsData.project1
                            }
                        ],
                        error: null
                    }
                }
            }
        });

        // 4. update project 1
        const [updateResponse] = await invoke({
            body: {
                query: UPDATE_PROJECT,
                variables: {
                    id: project1.data.projects.createProject.data.id,
                    data: {
                        title: "Project 1 - updated",
                        description: "This is my 1st project. - updated",
                        isNice: true
                    }
                }
            }
        });

        expect(updateResponse).toEqual({
            data: {
                projects: {
                    updateProject: {
                        data: {
                            id: project1.data.projects.createProject.data.id,
                            title: "Project 1 - updated",
                            description: "This is my 1st project. - updated",
                            isNice: true
                        },
                        error: null
                    }
                }
            }
        });

        // 5. get project1 after the update
        const [getResponse] = await invoke({
            body: {
                query: GET_PROJECT,
                variables: {
                    id: project1.data.projects.createProject.data.id
                }
            }
        });

        expect(getResponse).toEqual({
            data: {
                projects: {
                    getProject: {
                        data: {
                            id: project1.data.projects.createProject.data.id,
                            title: "Project 1 - updated",
                            description: "This is my 1st project. - updated",
                            isNice: true
                        },
                        error: null
                    }
                }
            }
        });
    });

    test("should sort projects", async () => {
        // 1. Let's create a couple of projects.
        const [project1] = await createProject(projectsData.project1);
        const [project2] = await createProject(projectsData.project2);
        const [project3] = await createProject(projectsData.project3);

        // if this `until` resolves successfully, we know the deleted project was deleted from elasticsearch
        await until(
            () =>
                invoke({
                    body: {
                        query: LIST_PROJECTS
                    }
                }).then(([data]) => data),
            ({ data }) => data.projects.listProjects.data.length === 3,
            { name: "list projects" }
        );

        const [projectsListResponse] = await invoke({
            body: {
                query: LIST_PROJECTS,
                variables: {
                    sort: ["createdOn_ASC"]
                }
            }
        });

        expect(projectsListResponse).toEqual({
            data: {
                projects: {
                    listProjects: {
                        data: [
                            {
                                id: project1.data.projects.createProject.data.id,
                                ...projectsData.project1
                            },
                            {
                                id: project2.data.projects.createProject.data.id,
                                ...projectsData.project2,
                                isNice: false
                            },
                            {
                                id: project3.data.projects.createProject.data.id,
                                ...projectsData.project3,
                                description: null
                            }
                        ],
                        error: null
                    }
                }
            }
        });
    });

    test("should sort projects by title ASC", async () => {
        // 1. Let's create a couple of projects.
        const [project1] = await createProject(projectsData.project1);
        const [project2] = await createProject(projectsData.project2);
        const [project3] = await createProject(projectsData.project3);

        // if this `until` resolves successfully, we know the deleted project was deleted from elasticsearch
        await until(
            () =>
                invoke({
                    body: {
                        query: LIST_PROJECTS
                    }
                }).then(([data]) => data),
            ({ data }) => data.projects.listProjects.data.length === 3,
            { name: "list projects" }
        );

        const [projectsListResponse] = await invoke({
            body: {
                query: LIST_PROJECTS,
                variables: {
                    sort: ["title_ASC"]
                }
            }
        });

        expect(projectsListResponse).toEqual({
            data: {
                projects: {
                    listProjects: {
                        data: [
                            {
                                id: project1.data.projects.createProject.data.id,
                                ...projectsData.project1
                            },
                            {
                                id: project2.data.projects.createProject.data.id,
                                ...projectsData.project2,
                                isNice: false
                            },
                            {
                                id: project3.data.projects.createProject.data.id,
                                ...projectsData.project3,
                                description: null
                            }
                        ],
                        error: null
                    }
                }
            }
        });
    });

    test("should sort projects by title desc", async () => {
        // 1. Let's create a couple of projects.
        const [project1] = await createProject(projectsData.project1);
        const [project2] = await createProject(projectsData.project2);
        const [project3] = await createProject(projectsData.project3);

        // if this `until` resolves successfully, we know the deleted project was deleted from elasticsearch
        await until(
            () =>
                invoke({
                    body: {
                        query: LIST_PROJECTS
                    }
                }).then(([data]) => data),
            ({ data }) => data.projects.listProjects.data.length === 3,
            { name: "list projects" }
        );

        const [projectsListResponse] = await invoke({
            body: {
                query: LIST_PROJECTS,
                variables: {
                    sort: ["title_DESC"]
                }
            }
        });

        expect(projectsListResponse).toEqual({
            data: {
                projects: {
                    listProjects: {
                        data: [
                            {
                                id: project3.data.projects.createProject.data.id,
                                ...projectsData.project3,
                                description: null
                            },
                            {
                                id: project2.data.projects.createProject.data.id,
                                ...projectsData.project2,
                                isNice: false
                            },
                            {
                                id: project1.data.projects.createProject.data.id,
                                ...projectsData.project1
                            }
                        ],
                        error: null
                    }
                }
            }
        });
    });
});
