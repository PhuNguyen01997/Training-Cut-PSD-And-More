$(document).ready(function () {
//-- Advertise
    //--Effect when focus in input__subcribe
    $(".advertise__subcribe--ipt").children("input").focusin(function(){
        $(this).prev().addClass("ipt-focus");
    });
    $(".advertise__subcribe--ipt").children("input").focusout(function(){
        $(this).prev().removeClass("ipt-focus");
    });
    //-- Dislay on or off add-menu when click top right button-header
    $(".advertise__header--btn").click(function(){
        $(this).parent().next().slideToggle();
    });
//--  Select
    //-- Effect icon in filter brand list
    $(".filter__brand--list").children().click(function(){
        $(this).toggleClass("chosed");
    });
    //-- Effect display off of filter__select table
    $(".filter__select--title").click(function(){
        let isOpened = $(this).attr("data-isOpened") === "true" ? true : false;
        $(this).next().slideToggle();
        $(this).children("i").removeClass();
        if(isOpened === false){
            $(this).children("i").addClass("fa fa-chevron-down");
            $(this).attr("data-isOpened",!isOpened);
        }
        else{
            $(this).children("i").addClass("fa fa-chevron-left");
            $(this).attr("data-isOpened",!isOpened);
        }
    });
    //-- Effect for choose or don't choose filter option list
    $(".filter__select--list").children().click(function(){
        $(this).toggleClass("chosed");
    });
    //-- Button reset filter all in top right header
    $(".filter__header--btn").click(function(){
        $(".filter__brand--list").children().removeClass("chosed");
        $(".filter__select--list").children().removeClass("chosed");
        let arrInput = document.querySelectorAll(".fliter__form-item input");
        arrInput = [...arrInput];
        arrInput.map( ipt => {
            ipt.value = null;
        } );
    });

//-- Chart
    //-- Effect icon three dot in top right
    $(".chart__grid-item--header i").click(function(){
        $(this).next().slideToggle();
    });
    //-- Effect  pagi year-month-daily
    var pagiBtns = document.querySelectorAll(".chart__pagi--btn");

    setPagiActive = function(){
        let width = this.offsetWidth;
        let coordX = this.offsetLeft;
        //Set color black blue
        $(this).siblings().removeClass("chart__pagi--btn-Active");
        $(this).addClass("chart__pagi--btn-Active");
        //Set background grey
        $(this).siblings(".chart__pagi--chosed").css("width",  width);
        $(this).siblings(".chart__pagi--chosed").css("left",  coordX);
    };

    pagiBtns.forEach( pagiBtn => pagiBtn.addEventListener("click", setPagiActive ));
});