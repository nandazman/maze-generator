export const sleep = (timeout = 250) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}