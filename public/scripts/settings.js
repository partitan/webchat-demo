$(".setting").change(
    function(){
        console.log ("setting changed")
        console.log($(this).val());
        console.log($(this).attr("id"));

        localStorage[$(this).attr("id")]  = $(this).val();
    }
);

function save_all_settings(){
    $(".setting").each(function(){
        localStorage[$(this).attr("id")]  = $(this).val();
    });
}

function save_all_chat_params(){
    $(".chatParam").each(function(){
        localStorage[$(this).attr("id")]  = $(this).val();
    });
}
