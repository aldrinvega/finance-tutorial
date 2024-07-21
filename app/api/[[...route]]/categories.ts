
import {z} from "zod";
import {Hono} from "hono";
import { db } from "@/db/drizzle";
import { categories, postCategoriesSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq, and, inArray, ne } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
    .get(
        "/", 
        clerkMiddleware(), 
        async (c) => {

        const auth = getAuth(c)

        if(!auth?.userId){
            return c.json({error: "Unauthorized"}, 401);
        }
            const data = await db
                .select({
                    id: categories.id,
                    name: categories.name
                })
                .from(categories)
                .where(eq(categories.userId, auth.userId))
                .orderBy(categories.name);

            return c.json({data})
    })
    .get(
        "/:id",
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);
            const {id} = c.req.valid("param");

            if(!id){
                return c.json({error: "Missing id"}, 400);
            }

            if(!auth?.userId){
                return c.json({error: "Unauthorized"}, 401);
            }

            const [data] = await db.select({
                id: categories.id,
                name: categories.name
            })
            .from(categories)
            .where(
                and(
                    eq(categories.userId, auth.userId), 
                    eq(categories.id, id)
                )
            );

            if(!data){
                return c.json({error: "Not found"}, 404);
            }

            return c.json({data});
        }
    )
    .post(
        "/",
        clerkMiddleware(),
        zValidator("json", postCategoriesSchema),
        async (c) => {
            const auth = getAuth(c);
            const value = c.req.valid("json");

            if(!auth?.userId){
                return c.json({error: "Unauthorized"}, 401);
            }

            // Geting object use "[]" to destructure the data
            const [data] = await db.insert(categories).values({
                id: createId(),
                userId: auth.userId,
                ...value,
            }).returning();

            return c.json({ data });
    })
    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator(
            "json", 
            z.object({
                ids: z.array(z.string())
            }),
        ),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");

            if(!auth?.userId){
                return c.json({error: "Unauthorized"}, 401);
            }

            const data = await db
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        inArray(categories.id, values.ids)
                    )
                )
                .returning({
                    id: categories.id,
                });

            return c.json({ data });
        },
    )
    .patch("/:id",
        clerkMiddleware(),
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        zValidator("json", postCategoriesSchema.pick({
            name: true,
        })),
        async (c) => {
            const auth = getAuth(c);
            const {id} = c.req.valid("param");
            const value = c.req.valid("json");

            if(!id){
                return c.json({error: "Missing id"}, 400);
            }

            if(!auth?.userId){
                return c.json({error: "Unauthorized"}, 401);
            }

            const [data] = await db
                .update(categories)
                .set(value)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
                    )
                )
                .returning();

            if(!data){
                return c.json({error: "Not found"}, 404);
            }

            return c.json({ data });
        }
    )
    .delete("/:id",
        clerkMiddleware(),
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        async (c) => {
            const auth = getAuth(c);
            const {id} = c.req.valid("param");

            if(!id){
                return c.json({error: "Missing id"}, 400);
            }

            if(!auth?.userId){
                return c.json({error: "Unauthorized"}, 401);
            }

            const [data] = await db
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
                    )
                )
                .returning({
                    id: categories.id,
                });

            if(!data){
                return c.json({error: "Not found"}, 404);
            }

            return c.json({ data });
        }
    );

export default app;