import { z } from "zod";
import { _userResponseSchema } from "../auth/auth.schema";
import zodToJsonSchema from "zod-to-json-schema";

export const _dashboardResponseSchema = _userResponseSchema.extend({
  balance: z.number(),
});

export const dashboardResponseSchema = {
  $id: "dashboardResponseSchema",
  ...zodToJsonSchema(_dashboardResponseSchema),
};