import { fnRes } from "../types/general";

export function resWrapper(data: any, message: string = 'Operation successful'): fnRes {
    const result = {
        data: data,
        message: message,
    };
    
    if (!data) {
        return {
            error: true,
            result: {
                ...result,
                data: null,
                message: message || 'No data available',
            }
        };
    }

    return {
        error: false,
        result: result,
    };
}