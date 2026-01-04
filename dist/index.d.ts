export type Constructor<T> = new (...args: any[]) => T;
export interface IpedsController<UDAPI = any, Settings = any> {
    readonly events: {
        emit: (event: any) => void;
    };
    readonly settings: Settings;
    readonly api: UDAPI;
    lookupService<T>(ctor: Constructor<T>): T;
}
export declare abstract class IpedsService<UDAPI = any, Settings = any> {
    protected readonly ctx: IpedsController<UDAPI, Settings>;
    constructor(ctx: IpedsController<UDAPI, Settings>);
}
export declare class IpedsEngine<UDAPI> {
    private api;
    private instances;
    constructor(api: UDAPI);
    initialize(services: Constructor<any>[]): void;
    private routeEvent;
}
