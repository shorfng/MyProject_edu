export function getMessage(state: number, source: string, message: string, orderNo?: string, extendParams?: any) {
    // @ts-ignore
    return {
        state,
        source,
        message,
        orderNo,
        ...extendParams
    }
}
