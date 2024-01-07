<script>
    let listOfPosts = [{"author": "me", "content": "potato"}, {"author": "a Potato", "content": "Do you like potatoes ?"}, {"author": "me", "content": "potato"},{"author": "me", "content": "potato"}, {"author": "me", "content": "potato"}, {"author": "Elon Musk", "content": "Send me BTC please"}, {"author": "me", "content": "potato"}, {"author": "a Potato", "content": "Do you like potatoes ?"}, {"author": "me", "content": "potato"},{"author": "me", "content": "potato"}, {"author": "me", "content": "potato"}, {"author": "Elon Musk", "content": "Send me BTC please"}, {"author": "me", "content": "potato"}, {"author": "a Potato", "content": "Do you like potatoes ?"}, {"author": "me", "content": "potato"},{"author": "me", "content": "potato"}, {"author": "me", "content": "potato"}, {"author": "Elon Musk", "content": "Send me BTC please"}]
</script>

<div class="leftBar">
    leftBar
</div>


<div class="topBar">
    top
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
    }


    .leftBar {
        grid-area: leftbar;
        border: solid;
    }

    .topBar {
        grid-area: topbar;
        border: solid;
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
</style>