
export function  invertColor(color:string) {
    return '#' + ("000000" + (0xFFFFFF ^ parseInt(color.substring(1),16)).toString(16)).slice(-6);
}