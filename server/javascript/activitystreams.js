async function getOrderedCollection(url) {
    let fetchedUrl = await fetch(url, {headers: {"Accept": "application/activity+json"}})
    fetchedUrl = await fetchedUrl.json()
    console.log(fetchedUrl)
    let collection = []
    if(fetchedUrl.first == String) {
        let fetched = await fetch(fetchedUrl.first, {headers: {"Accept": "application/activity+json"}})
        console.log(fetched)
        //collection = 
        //if
    }
}

module.exports = {"getOrderedCollection": getOrderedCollection}