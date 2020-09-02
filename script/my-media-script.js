

//-- Video Script
$(document).ready(function () {
    var video = {
        currentVd: {
            name: `"A Night to Remember" Launch Cinematic`,
            // url: "https://www.youtube.com/embed/ehjJ614QfeM",
            url: "https://www.youtube.com/embed/Tx9WyKtLzio",
            imgPresent: "./images/vd-4-img.jpg",
            gifPresent: "./images/vd-4.gif",
            viewer: "12,434,934",
        },
        relatedVD: [
            {
                name: "Killing Monsters Cinematic Trailer",
                url: "https://www.youtube.com/embed/c0i88t0Kacs",
                imgPresent: "./images/vd-1-img.jpg",
                gifPresent: "./images/vd-1.gif",
                viewer: "8,204,301",
            },
            {
                name: "The Sword Of Destiny Trailer",
                url: "https://www.youtube.com/embed/HtVdAasjOgU",
                imgPresent: "./images/vd-2-img.jpg",
                gifPresent: "./images/vd-2.gif",
                viewer: "10,234,583",
            },
            {
                name: "The Trail” Opening Cinematic",
                url: "https://www.youtube.com/embed/FcogCjLymeI",
                imgPresent: "./images/vd-3-img.jpg",
                gifPresent: "./images/vd-3.gif",
                viewer: "11,899,284",
            },
        ]
    }

    var currentContainer = $(".player__grid-item-1 .player__vd--video"); 
    var currentTitle = $(".player__grid-item-1 .player__content--title");
    var currentViewer = $(".player__grid-item-1 .player__content--feed span:first-child");
    var relatedItem = $(".player__grid-item-2 .player__vd"); // This is array
    var relatedImg = $(".player__grid-item-2 .player__vd--video"); // This is array
    var relatedTitle = $(".player__grid-item-2 .player__vd--title") // This is array
    var relatedViewer = $(".player__grid-item-2 .player__vd--text"); // This is array

    setVideo = function(){
        currentContainer.attr("src", video.currentVd.url);
        currentTitle.text(video.currentVd.name);
        currentViewer.html(`<i class="fa fa-play" aria-hidden="true"></i> ${video.currentVd.viewer}`);
        relatedImg.map( (index, relatedElem) => {
            $(relatedElem).attr("src",video.relatedVD[index].imgPresent);
        });
        relatedTitle.map( (index, relatedElem) => {
            $(relatedElem).text(video.relatedVD[index].name);
        });
        relatedViewer.map( (index, relatedElem) => {
            $(relatedElem).html(`<i class="fa fa-play" aria-hidden="true"></i> ${video.relatedVD[index].viewer}`);
        })
    }
    onMouseEnter = function(){
        const index = $(this).children("img").attr("data-index");
        $(this).children("img").attr("src",video.relatedVD[index].gifPresent);
    };
    onMouseLeave = function(){
        const index = $(this).children("img").attr("data-index");
        $(this).children("img").attr("src",video.relatedVD[index].imgPresent);
    };
    setVideo();
    
    relatedItem.click(function(){
        const index = $(this).children("img").attr("data-index");
        const tempObj = Object.assign({},video.currentVd);
        video.currentVd = Object.assign({},video.relatedVD[index]); 
        video.relatedVD[index] = Object.assign({},tempObj);
        setVideo();
    });
    relatedItem.hover(onMouseEnter, onMouseLeave);
});

//-- Audio Script
$(document).ready(function () {
    // Create Wave Audio
    var waveSolo = WaveSurfer.create({
        container: '#waveform-solo',
        waveColor: '#c6c9cc',
        progressColor: '#33a7e3',
        height: 80, // Because this container is height 40, i only want half upper of waveform
        barWidth: 2,
        barHeight: 1, // the height of the wave
        barGap: 2,
        cursorWidth: 0,
    });
    waveSolo.load($(".player__grid-item-4").find("audio").attr("src"));

    var waveThird = WaveSurfer.create({
        container: "#waveform-third",
        waveColor: '#c6c9cc',
        progressColor: '#33a7e3',
        height: 80, // Because this container is height 40, i only want half upper of waveform
        barWidth: 2,
        barHeight: 1, // the height of the wave
        barGap: 2,
        cursorWidth: 0,
    });
    // I am set time out 0.5s because i only can query and get audio in owl-carousel when owl-carousel load finish
    setTimeout(function(){
        waveThird.load($(".player__grid-item-3").find("#owl-carousel--player .active audio").attr("src")); // get audio from carousel center
    }, 500);
    

    var waveArr = [waveSolo, waveThird];
    var isPlaying;

    function setValWave(waveAudio, domElem){
        let container = $(domElem).parents(".player__grid-item");
        let domCurrentTime = container.find("span.current");
        
        // Set current time of song is playing
        domCurrentTime.text(converterTime(waveAudio.getCurrentTime()));
    }
    function setValBar(audio, domElem){
        let container = $(domElem).parents(".player__grid-item");
        let domCurrentTime = container.find("span.current");
        let domCurrentBar = container.find(".player__music-line");
        let percent = converterPercent(audio.currentTime, audio.duration);

        // Set current time of song is playing
        domCurrentTime.text(converterTime(audio.currentTime));
        
        // Set current bar
        domCurrentBar.children().css("width", percent + "%");
        
        // When song is finish
        if(audio.ended){
            $(domElem).removeClass("player__trigger--playing");
            clearInterval(isPlaying);
        }
    }
    function converterPercent(currSecond, sumSecond){
        return currSecond * 100 / sumSecond
    }
    function converterTime(sumSecond){
        sumSecond = Math.ceil(sumSecond);
        let minute = Math.floor(sumSecond/60);
        let second = sumSecond % 60;
        return `${minute}:${second < 10 ? "0" + second : second}`;
    }

    //-- Effect heart in top right of player__grid-item-4,5 twitter when click
    $(".player__heart").on("click", function() {
        $(this).toggleClass("is-active");
    });
    //-- Change button pause or play music ( > || )  when click
    $(".player__trigger").on("click",function(){
        console.log("click");
        if(this.dataset.type === "wave"){
            const index = this.dataset.name === "waveform-solo" ? 0 : 1; // because i has only two waveform
            // waveArr[index].setPlaybackRate(10);
            if( waveArr[index].isReady ){
                $(this).toggleClass("player__trigger--playing");
                if(waveArr[index].isPlaying() === false){
                    waveArr[index].play();
                    isPlaying = setInterval( () => {  //-- Set time, progress when the song is playing
                        setValWave(waveArr[index], this);  
                    },500);
                }
                else{
                    clearInterval(isPlaying);
                    waveArr[index].pause();
                }
            }
        }
        if(this.dataset.type === "bar"){
            $(this).toggleClass("player__trigger--playing");
            const audio = $(this).siblings("audio").get(0);
            if(audio.paused){
                audio.play();
                isPlaying = setInterval( () => {  //-- Set time, progress when the song is playing
                    setValBar(audio, this);  
                },500);
            }
            else{
                clearInterval(isPlaying);
                audio.pause();
            }
        }
    });
});