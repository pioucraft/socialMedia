async function getCollection(url) {
    let fetchedUrl = await fetch(url, {headers: {"Accept": "application/activity+json"}})
    fetchedUrl = await fetchedUrl.json()
    console.log(fetchedUrl)
    let collection = []
    if(typeof fetchedUrl.first == "string") {
        let fetched = await (await fetch(fetchedUrl.first, {headers: {"Accept": "application/activity+json"}})).json()
        console.log(fetched)
        if(fetched.orderedItems) {
            collection = fetched.orderedItems
        }
        else {
            
        }
        
        //if
    }
}

module.exports = {"getCollection": getdCollection}