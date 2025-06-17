import { _userResponseSchema } from "@/modules/user";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const _dashboardResponseSchema = _userResponseSchema.extend({
  balance: z.number(),
});

export const dashboardResponseSchema = {
  $id: "dashboardResponseSchema",
  ...zodToJsonSchema(_dashboardResponseSchema),
};
