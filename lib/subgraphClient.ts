import { publicConfig } from "@/config/public";
import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient(publicConfig.ROBOT_PUMP_GRAPH_URL);
