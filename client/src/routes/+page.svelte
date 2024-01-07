
<div class="leftBar">
    leftBar
</div>


<div class="top">
    top
</div>

<div class="timeline">
    
    
</div>

<div class="bottom">
    bottom
</div>

<div class="rightBar">
    Trending
</div>

<style>

    :global(body) {
        display: flex;
        flex-direction: row;
        height: 100%;
    }
    
    .timeline {
        position: absolute;
        /*width: 60vw;
        margin-top: 7vh;
        margin-left: 20vw;
        overflow-y:auto;
        height: 86vh;*/
    }

    .top {
        margin-left: 20vw;
        position: absolute;
        top: 0%;
        left: 0%;
        width: 60vw;
        height: 7vh;
        border-bottom: solid ;
        background-color: aqua;
    }

    .bottom {
        margin-left: 20vw;
        position: absolute;
        top: 93vh;
        left: 0%;
        height: 7vh;
        width: 60vw;
        border-top: solid;
        background-color: aqua;
    }
    
    .leftBar {
        top: 0;
        left: 0;
        height: 100vh;
        position: absolute;
        border-right: solid;
        width: 20vw;
        background-color: beige;
    }

    .rightBar {
        top: 0;
        left: 80vw;
        height: 100vh;
        position: absolute;
        border-left: solid;
        width: 20vw;
        background-color: beige;
    }


</style>