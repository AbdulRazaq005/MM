import { get } from "lodash";
import axios from "axios";

export async function getAsync(url = "", params = {}) {
  try {
    const response = await axios.get(url, { params });
    // console.info("ApiHandlerResponse: ", response);
    return successHandler(response);
  } catch (error) {
    console.error({ error });
    return errorHandler(error);
  }
}

export const successHandler = (response) => {
  return {
    success: true,
    payload: response.data,
  };
};

export const errorHandler = (error) => {
  const GeneralError = "Server Error";
  const InternalServerErrorMessage = "Internal Server Error";
  const ForbiddenMessage = "You are not authorized to view this content";
  const ServiceUnavailableMessage = "Service is unavailable. Please try later";
  const GatewayTimeoutMessage = "Server is taking too long to respond";

  const isHttpError = error.response && error.response.status;
  if (isHttpError) {
    const responseStatus = get(error, "response.status", 0);

    switch (responseStatus) {
      case 200: {
        break;
      }
      case 400: {
        return getErrorResponse(get(error, "message", "Bad request"));
      }
      case 401: {
        console.log("REDIRECT");
        window.location.href = "/login";
        break;
      }
      case 403: {
        return getErrorResponse(ForbiddenMessage);
      }
      case 500: {
        return getErrorResponse(InternalServerErrorMessage);
      }
      case 503: {
        return getErrorResponse(ServiceUnavailableMessage);
      }
      case 504: {
        return getErrorResponse(GatewayTimeoutMessage);
      }
      default: {
        return getErrorResponse(GeneralError);
      }
    }
  } else {
    return getErrorResponse(GeneralError);
  }
};

function getErrorResponse(message) {
  return {
    success: false,
    payload: {
      message,
    },
  };
}
