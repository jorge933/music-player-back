import {
  FastifySchemaValidationError,
  SchemaErrorDataVar,
  SchemaErrorFormatter,
} from "fastify/types/schema";
import { SCHEMA_ERROR_MESSAGES } from "../constants/schemaErrorMessages";
import { ApiError } from "../classes/api-error";
import { HttpStatusCode } from "axios";

interface ValidationError extends FastifySchemaValidationError {
  keyword: keyof typeof SCHEMA_ERROR_MESSAGES;
  params: { missingProperty: string };
}

function schemaErrorFormatter(
  [firstError]: ValidationError[],
  dataVar: SchemaErrorDataVar
) {
  const {
    keyword,
    params: { missingProperty },
  } = firstError;

  const formatMessage = SCHEMA_ERROR_MESSAGES[keyword];
  const formattedMessage = formatMessage(missingProperty, dataVar);

  const error = new Error(formattedMessage);

  return error;
}

const castedSchemaErrorFormatter = schemaErrorFormatter as SchemaErrorFormatter;

export { castedSchemaErrorFormatter as schemaErrorFormatter };
