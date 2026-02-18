declare class Logger {
    socket: any;
    constructor();
    log(msg: any): void;
}
declare const logger: Logger;
export { logger as Logger };
