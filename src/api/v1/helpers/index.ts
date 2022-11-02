import { NextFunction, Request, Response } from 'express';

class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(statusCode: number, message: string, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Tạo một đối tượng bao gồm các thuộc tính đối tượng đã chọn
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */

const pick = (object: any, keys: any): object => {
    return keys.reduce((obj: any, key: string) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            // eslint-disable-next-line no-param-reassign
            obj[key] = object[key];
        }
        return obj;
    }, {});
};

// bắt lỗi bất động bộ
const catchAsync = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

const getPagination = (page: number, size: number) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const getPagingData = (data: any, page: number, limit: number, fieldSend: string) => {
    const { count: totalItems, rows } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, [fieldSend]: rows, totalPages, currentPage };
};

export { ApiError, pick, catchAsync, getPagination, getPagingData };
