export type IpedsConstructor<T> = new (...args: any[]) => T;
export type IpedsServiceConstructor<T, TUserDefinedAPI, TController> = new (api: TUserDefinedAPI, controller: TController) => T;
export interface IpedsEventEmitter<TEvents extends Record<string, any>> {
    emit<TEventName extends keyof TEvents & string>(eventName: TEventName, ...eventArg: TEvents[TEventName]): void;
    on<TEventName extends keyof TEvents & string>(eventName: TEventName, handler: (...eventArg: TEvents[TEventName]) => void): void;
    off<TEventName extends keyof TEvents & string>(eventName: TEventName, handler: (...eventArg: TEvents[TEventName]) => void): void;
}
export interface IpedsEventsController<TEvents extends Record<string, any>> {
    readonly emitter: IpedsEventEmitter<TEvents>;
    lookupService<T>(ctor: IpedsConstructor<T>): T;
}
export declare abstract class IpedsService<TUserDefinedAPI, TController> {
    constructor(_api: TUserDefinedAPI, _controller: TController);
}
export declare abstract class IpedsEngine<TUserDefinedAPI, TController> {
    private api;
    private instances;
    constructor(api: TUserDefinedAPI);
    setup(services: IpedsServiceConstructor<any, TUserDefinedAPI, TController>[]): void;
    protected getServiceInstances(): ReadonlyMap<Function, IpedsService<TUserDefinedAPI, TController>>;
    protected abstract createController(serviceCtor: IpedsServiceConstructor<unknown, TUserDefinedAPI, TController>): TController;
}
