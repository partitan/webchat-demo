var pureCloudSession = null;

var environments = {
    na : {
        clientId: "b9602a86-8bfc-4f45-8fe5-3ced3c5de138",
        name: "North America",
        environment: "mypurecloud.com"
    },
    anz : {
        clientId: "",
        name: "Australia/New Zealand",
        environment: "mypurecloud.com.au"
    },
    eu : {
        clientId: "",
        name: "EU (Ireland)",
        environment: "mypurecloud.ie"
    },
    jp : {
        clientId: "a146fc4e-94a1-4f6e-9f41-1856bfec0013",
        name: "Japan",
        environment: "mypurecloud.jp"
    },
    dca : {
        clientId: "ed0ca151-ee0b-4f86-9f22-f321b743f4ec",
        name: "DCA",
        environment: "inindca.com"
    }
}



function processQueues(queues){
    console.log(queues);
    for(var x=0 ; x< queues.entities.length; x++){
        var queue = queues.entities[x]
        $('#queueNameSelect').append('<option value="'+ queue.name +'">'+ queue.name +'</option>');
    }

    if(queues.nextUri && queues.nextUri !== ''){
        pureCloudSession.get(queues.nextUri).done(processQueues);
    }else{
        $("#queueNameSelect").prop('disabled', false);
        $("#queueLoading").hide();
    }
}

$(document).ready(function(){
    $('#queueNameSelect').hide();
    $('#queueName').show();
    $("#queueLoading").hide();

    $('#agentAvatar').val(window.location.href.replace(/\/#/,'') + 'images/agent.jpg');
    $('#companyLogoSmall').val(window.location.href.replace(/\/#/,'') + 'images/companylogo.png');
    $('#companyLogo').val(window.location.href.replace(/\/#/,'') + 'images/companylogo.png');

    for (var i = 0; i < localStorage.length; i++){
        try{
                $('#' + localStorage.key(i)).val(localStorage.getItem(localStorage.key(i)));
        }
        catch(ex){}
    }

    for(var key in environments){
         $('#regionSelect').append('<option value="'+ key +'">'+ environments[key].name +'</option>');
    }
    if(localStorage.regionSelect){
        $('#regionSelect option[value="'+ localStorage.regionSelect + '"]').prop('selected', true)
    }


    if(localStorage.disableAutoFill !== "on"){
        $('#firstName').val(chance.first());
        $('#lastName').val(chance.last());
        $('#street').val(chance.address());
        $('#city').val(chance.city());
        $('#phone').val(chance.phone());
        $('#state').val(chance.state());
        $('#zip').val(chance.zip());
    }else{
        $( "#disableAutoFill" ).prop( "checked", true );
    }

    if($("#orgId").val() !== "" &&
        $("#orgName").val() !== "" &&
        $("#queueName").val() !== ""){
            $('#collapseOne').collapse('hide');
    }

    $('#regionSelect').change(function() {
        var region = $('#regionSelect').val()
        if (region === 'na' ||
            region === 'jp' ||
            region === 'dca') {
            $('#getorgsettings').prop("disabled",false);
            $('#autofillwarning').hide();
        } else {
            $('#getorgsettings').prop("disabled",true);
            $('#autofillwarning').show();
        }
    });

    pureCloudSession = new PureCloudSession(environments[$('#regionSelect').val()].environment);
    if(pureCloudSession.hasAuthorizationToken()){
        getOrgDetails();
    }

    $("#getorgsettings").click(function(){
        var clientId = environments[$('#regionSelect').val()].clientId;

        pureCloudSession.environment(environments[$('#regionSelect').val()].environment);
        pureCloudSession.authorize(clientId,window.location.href.replace(/#/,'')).done(getOrgDetails);

        event.preventDefault();
        return false;
    });

});

function getOrgDetails(){
    $('#queueNameSelect').show();
    $("#queueNameSelect").prop('disabled', true);
    $('#queueName').hide();
    $("#queueLoading").show();

    $('#queueNameSelect').empty();
    var configurationApi = new ConfigurationApi(pureCloudSession);
    var routingApi = new RoutingApi(pureCloudSession);

    configurationApi.getOrganization().done(function(orgDetails){
        $("#orgName").val(orgDetails.thirdPartyOrgName);
        $('#orgName').attr('readonly', true);
        $("#orgId").val(orgDetails.thirdPartyOrgId);
        $('#orgId').attr('readonly', true);
    });

    routingApi.getQueues().done(processQueues);
}
