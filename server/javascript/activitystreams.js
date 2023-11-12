async function getOrderedCollection(url) {
    let fetchedUrl = await fetch(url, {headers: {"Accept": "application/activity+json"}})
    console.log(await fetchedUrl.json())
}

module.exports = {"getOrderedCollection": getOrderedCollection}