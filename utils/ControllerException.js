class ControllerException extends Error {
    constructor(code, message) {
        super();
        this.message = message;
        this.name = "CONTROLLER_EXCEPTION";
        this.exceptionCode = code;
    }
}

module.exports = ControllerException;