import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

export const app = new OpenAPIHono();

const ParamsSchema = z.object({
	id: z //id は
		.string() // 文字列で
		.min(3) // 最小3文字
		.openapi({
			param: {
				name: "id",
				in: "path",
			},
			example: "1212121",
		}),
});

const UserSchema = z
	.object({
		id: z.string().openapi({
			example: "123",
		}),
		name: z.string().openapi({
			example: "John Doe",
		}),
		age: z.number().openapi({
			example: 42,
		}),
	})
	.openapi("User");

const ErrorSchema = z.object({
	code: z.number().openapi({
		example: 400,
	}),
	message: z.string().openapi({
		example: "Bad Request",
	}),
});

const route = createRoute({
	method: "get",
	path: "/users/{id}",
	request: {
		params: ParamsSchema,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: UserSchema,
				},
			},
			description: "Retrieve the user",
		},
		400: {
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
			description: "Returns an error",
		},
	},
});

app.openapi(
	route,
	(c) => {
		const { id } = c.req.valid("param");
		return c.json(
			{
				id,
				age: 20,
				name: "Ultra-man",
			},
			200,
		);
	},
	// Hook
	(result, c) => {
		if (!result.success) {
			return c.json(
				{
					code: 400,
					message: "Validation Error",
				},
				400,
			);
		}
	},
);
