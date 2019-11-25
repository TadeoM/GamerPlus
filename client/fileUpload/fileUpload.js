// File Upload Test
const handleQuest = (e) =>{
    e.preventDefault();

    $("#questMessage").animate({width:'hide'},350);

    if($("#questName").val()==''|| $("#questExp").val()==''||$("#questType").val()==''||$("#questContent").val()=='')
    {
        handleError("Gamer! All fields are required");
        return false;
    }

    sendAjax('POST',$("#uploadForm").attr("action"), $("#uploadForm").serialize(), function(){
        loadQuestsFromServer();
        
    });
    
    return false;
};

const UploadFile = (props) => {
    return (
        <form ref='uploadForm' 
            id='uploadForm' 
            action='/upload' 
            method='post' 
            encType="multipart/form-data">
            <input type="file" name="sampleFile" />
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input type='submit' value='Upload!' />
        </form> 
    )
}

const setup = (csrf) => {
    createAcountWindow(csrf); // default view

    ReactDOM.render(
        <UploadFile csrf ={csrf}/>, document.querySelector("#makeQuest")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});