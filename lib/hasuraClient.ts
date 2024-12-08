import { publicConfig } from "@/config/public";
import { GraphQLClient } from "graphql-request";

export const hasuraClient = new GraphQLClient(publicConfig.ROBOT_PUMP_HASURA_URL);
