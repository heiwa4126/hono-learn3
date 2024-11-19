import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { app as app1 } from "./app1.js";
import { app as app2 } from "./app2.js";
import { app as base1 } from "./base1.js"; // Import the app from app1.tsx

export const app = new OpenAPIHono();

app.route("/", base1);
app.route("/api", app1);
app.route("/api", app2);

// The OpenAPI documentation will be available at /doc
app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "My API",
	},
});

app.get("/ui", swaggerUI({ url: "/doc" }));

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
