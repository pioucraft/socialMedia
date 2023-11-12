async function getOrderedCollection(url) {
    let fetchedUrl = await fetch(url, {headers: {"Accept": "application/activity+json"}})
    console.log(fetchedUrl)
}

module.exports = {"getOrderedCollection": getOrderedCollection}