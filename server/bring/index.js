export default function bring({
    path,
    options = {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include",
        // headers: {
        //     "Content-Type": "application/json",
        // },
        redirect: "follow", // manual, *follow, error
        // body: formData // body data type must match "Content-Type" header
    },
}) {
    if (!path) throw new Error("Path is required")
    options = {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include",
        // headers: {
        //     "Content-Type": "application/json",
        // },
        redirect: "follow", // manual, *follow, error
        // body: formData // body data type must match "Content-Type" header
        ...options,
    }
    // console.log(options)
    return new Promise((resolve, reject) => {
        fetch(path, options)
            .then(response => {
                const contentType = response.headers.get("content-type")
                if ( 200 > response.status && response.status >= 300 )
                    reject(response)
                if (contentType && contentType.indexOf("application/json") !== -1)
                    response
                        .json()
                        .then(json => resolve(json))
                        .catch(er => reject(er))
                else
                    response
                        .text()
                        .then(text => resolve(text))
                        .catch(er => reject(er))
            })
            .catch(er => reject(er))
    })
}