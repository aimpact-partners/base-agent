import * as functions from '@google-cloud/functions-framework';
import {execute} from '@aimpact/base-agent/routes';
import * as dotenv from 'dotenv';
dotenv.config();

process.env.FUNCTION_REGION && functions.http('basic-agent', execute);
