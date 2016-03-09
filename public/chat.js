$("#startChat").click(function(){
    if($("#orgId").val() === "" ||
        $("#orgName").val() === "" ||
        $("#queueName").val() === ""){
            $("#missingRequiredFields").show();
            $('#collapseOne').collapse('show');
            return;
    }


    save_all_settings();
    save_all_chat_params();

    $("#chatWithUs").hide();
    $("#accordion").hide();

    createChatConfig();

    ININ.webchat.create(chatConfig, function(err, webchat) {
        if (err) {
            throw err;
        }

        // Render to frame
        webchat.renderFrame({
            containerEl: 'chatContainer'
        });
    });
});


var chatConfig = {};
function createChatConfig(){

    var environment = environments[$('#regionSelect').val()].environment;
    chatConfig = {
        // Web chat application URL
        "webchatAppUrl": "https://apps."+ environment +"/webchat",

        // Web chat service URL
        "webchatServiceUrl": "https://realtime."+ environment +":443",

       "orgId": $("#orgId").val(),

       // Organization name
       "orgName": $("#orgName").val(),


        "queueName":$("#queueName").val(),

        // Log level
        "logLevel": "DEBUG",

        // Locale code
        "locale": "en",

        // Data that will be included with interaction
        "data": {
            "firstName": $("#firstName").val(),
            "lastName": $("#lastName").val(),
            "addressStreet":  $("#street").val(),
            "addressCity":  $("#city").val(),
            "addressPostalCode":  $("#zip").val(),
            "addressState":  $("#state").val(),
            "phoneNumber":  $("#phone").val()
        },

        // Logo used at the top of the chat window
        "companyLogo": {
            "width": 600,
            "height": 149,
            "url": $("#companyLogo").val()
        },

        // Logo used within the chat window
        "companyLogoSmall": {
            "width": 149,
            "height": 149,
            "url": $("#companyLogoSmall").val()
        },

        // Image used for agent
        "agentAvatar": {
            "width": 462,
            "height": 462,
            "url": $("#agentAvatar").val()
        },

        // Text displayed with chat window is displayed
        "welcomeMessage": "Thanks for chatting.",

        // CSS class applied to the chat window
        "cssClass": "webchat-frame",

        // Custom style applied to the chat window
        "css": {
            "width": "100%",
            "height": "100%"
        }
    };
}
