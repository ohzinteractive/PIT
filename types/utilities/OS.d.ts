declare class OS {
    is_android: any;
    is_ios: any;
    is_ipad: any;
    is_linux: any;
    is_mac: any;
    is_mobile: any;
    is_windows: any;
    operating_systems: any;
    init(): void;
    get_os(): any;
}
declare const os: OS;
export { os as OS };
