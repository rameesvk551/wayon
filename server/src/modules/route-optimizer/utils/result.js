/**
 * Result monad — wraps success/failure with typed value or error.
 */
export class Result {
    /**
     * @param {boolean} isSuccess
     * @param {string | Error} [error]
     * @param {*} [value]
     */
    constructor(isSuccess, error, value) {
        if (isSuccess && error) {
            throw new Error("InvalidOperation: A result cannot be successful and contain an error");
        }
        if (!isSuccess && !error) {
            throw new Error("InvalidOperation: A failing result needs to contain an error message");
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error;
        this._value = value;

        Object.freeze(this);
    }

    getValue() {
        if (!this.isSuccess) {
            throw new Error("Can't get the value of an error result. Use 'getErrorValue' instead.");
        }
        return this._value;
    }

    getErrorValue() {
        return this.error;
    }

    static ok(value) {
        return new Result(true, undefined, value);
    }

    static fail(error) {
        return new Result(false, error);
    }

    static combine(results) {
        for (const result of results) {
            if (result.isFailure) return result;
        }
        return Result.ok();
    }
}

/**
 * Validation error class
 */
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}
