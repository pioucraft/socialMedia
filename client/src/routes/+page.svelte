<script>
    let listOfPosts = [{"author": "me", "content": "potato"}, {"author": "a Potato", "content": "Do you like potatoes ?"}, {"author": "me", "content": "potato"},{"author": "me", "content": "potato"}, {"author": "me", "content": "potato"}, {"author": "Elon Musk", "content": "Send me BTC please"}, {"author": "me", "content": "potato"}, {"author": "a Potato", "content": "Do you like potatoes ?"}, {"author": "me", "content": "potato"},{"author": "me", "content": "potato"}, {"author": "me", "content": "potato"}, {"author": "Elon Musk", "content": "Send me BTC please"}, {"author": "me", "content": "potato"}, {"author": "a Potato", "content": "Do you like potatoes ?"}, {"author": "me", "content": "potato"},{"author": "me", "content": "potato"}, {"author": "me", "content": "potato"}, {"author": "Elon Musk", "content": "Send me BTC please"}]
    let profileDropdownOppened = true
</script>

<div class="leftBar">
    leftBar
</div>


<div class="topBar">
    <input type="search" name="" id="" class="topBar-search" placeholder="Search on da Social Media">
    <button on:click={() => {profileDropdownOppened = true}} class="topBar-profilePicture"><img src="profilePicture-test.jpg" alt="" class="topBar-profilePicture-image"></button>
    {#if profileDropdownOppened}
        <button on:click={() => {profileDropdownOppened = false}} class="topBar-fullInvisibleButton"></button>
        <div class="topBar-profilePictureDropdown">
            <button class="topbar-profilePictureDropDown-button">Sign in</button>
            <button class="topbar-profilePictureDropDown-button">Create account</button>
        </div>
    {/if}
</div>

<div class="timeline">
    {#each listOfPosts as post}
        <div class="timeline-post">
            <h5>{post.author}</h5>
            <p>{post.content}</p>
        </div>
    {/each}
</div>

<div class="bottomBar">
    bottom
</div>

<div class="rightBar">
    Trending
</div>

<style>

    :root {
        --primary: black;
        --secondary: black;
        --accent: black;
    }

    :global(body) {
        display: grid;
        grid-template-areas: 
        "leftbar topbar rightbar"
        "leftbar timeline rightbar"
        "leftbar bottombar rightbar";
        grid-template-rows: 75px auto 70px;
        grid-template-columns: 2fr 5fr 2fr;
        height: 100vh;
        margin: 0;
    }

   


    .leftBar {
        grid-area: leftbar;
        border: solid;
    }

    .topBar {
        display: grid;
        grid-template-areas: "search profile";
        grid-template-columns: auto 10vh;
        gap: 5vw;
        grid-area: topbar;
        border: solid;
        align-items: center;
        padding-left: 3vw;
    }

    .rightBar {
        grid-area: rightbar;
        border: solid;
    }

    .timeline {
        grid-area: timeline;
        border: solid;
        overflow-y: auto;
    }

    .bottomBar {
        grid-area: bottombar;
        border: solid;
    }

    .timeline-post {
        border-bottom: solid;
        padding: 1%;
    }

    .topBar-search {
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        grid-area: search;
        border-radius: 5vh;
        border: solid gray 2px;
        outline: none;
        padding: 1%;
        padding-left: 2%;
        padding-right: 2%;
        font-size: large;
    }

    .topBar-profilePicture {
        grid-area: profile;
        width: 6vh;
        height: 6vh;
        cursor: pointer;
        border: none;
        background-color: transparent;
    }

    .topBar-profilePicture-image {
        width: 6vh;
        height: 6vh;
        border-radius: 100%;
    }

    .topBar-profilePictureDropdown {
        position: absolute;
        right: 23vw;
        top: 10vh;
        display: flex;
        flex-direction: column;
        background-color: black;
        border-radius: 1vh;
        padding: 10px;
    }

    .topBar-fullInvisibleButton {
        height: 100vh;
        width: 100vw;
        position: absolute;
        left: 0;
        top: 0;
        background-color: transparent;
        border: none;
    }

    .topbar-profilePictureDropDown-button {
        margin: 1vh;
        padding: 1vh;
        font-size: medium;
        color: ;
    }

    @media only screen and (max-width: 600px) {
        :global(body) {
            grid-template-columns:0px auto 0px;
        }

        .leftBar {
            display: none;
        }

        .rightBar {
            display: none;
        }

        .topBar-profilePictureDropdown {
            right: 3vw;
        }
    }
</style>