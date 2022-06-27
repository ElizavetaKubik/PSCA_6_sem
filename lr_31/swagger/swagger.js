let api = {
  openapi: "3.0.1",
  info: {
    description: "Numbers",
    version: "1.0.0",
    title: "Numbers",
    contact: {
      email: "lr_31@gmail.com",
    },
    license: {
      name: "Apache 2.0",
      url: "http://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  paths: {
    "/ts": {
      get: {
        tags: ["CRUD operations"],
        description: "Get numbers",
        operationId: "getTS",
        responses: {
          200: {
            description: "Numbers",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  id: "1",
                  name: "test",
                  number: "+375291234567",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["CRUD operations"],
        description: "Add number",
        operationId: "postTS",
        requestBody: {
          content: {
            "application/json": {
              name: "Number",
              schema: { type: "object" },
              required: true,
              description: "Add new number",
              example: {
                name: "test",
                number: "+375291234567",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success.",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  message: "Success.",
                },
              },
            },
          },
          400: {
            description: "Error.",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  message: "Error.",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["CRUD operations"],
        description: "Edit number",
        operationId: "putTS",
        requestBody: {
          content: {
            "application/json": {
              name: "Number",
              schema: { type: "object" },
              required: true,
              description: "Edit number",
              example: {
                id: "1",
                name: "test",
                number: "+375297654321",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success.",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  message: "Success.",
                },
              },
            },
          },
          400: {
            description: "ID required.",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  message: "ID required.",
                },
              },
            },
          },
          404: {
            description: "Number doesn't exist.",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  message: "Number doesn't exist.",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["CRUD operations"],
        description: "Delete number",
        operationId: "delTS",
        requestBody: {
          content: {
            "application/json": {
              name: "Number",
              schema: { type: "object" },
              required: true,
              description: "Delete number",
              example: {
                id: "1",
              },
            },
          },
        },
        responses: {
          200: {
            description: "OK message for delete",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  message: "Success.",
                },
              },
            },
          },
          400: {
            description: "ID required.",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  message: "ID required.",
                },
              },
            },
          },
          404: {
            description: "Number doesn't exist.",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: {
                  message: "Number doesn't exist.",
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = api;
