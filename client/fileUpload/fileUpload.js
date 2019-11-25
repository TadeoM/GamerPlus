let csrfToken = null;

// File Upload Test
const handleUpload = (e) =>{
    e.preventDefault();

    $("#questMessage").animate({width:'hide'},350);

    if($("#questName").val()==''|| $("#questExp").val()==''||$("#questType").val()==''||$("#questContent").val()=='')
    {
        handleError("Gamer! All fields are required");
        return false;
    }

    sendAjax('POST',$("#uploadForm").attr("action"), $("#uploadForm").serialize(), function(){
    });
    
    return false;
};

const UploadFile = (props) => {
    console.log(csrfToken);
    return (
        <form id='uploadForm' 
            name="uploadForm"
            action='/upload' // ?_csrf={csrfToken}
            method='POST' 
            encType="multipart/form-data"
            className="mainForm"
            >
            <input type="hidden" name="_csrf" value={csrfToken}/>
            <input type="file" name="sampleFile" />
            <input type='submit' value='Upload!' />
        </form> 
    )
}

const setup = (csrf) => {
    ReactDOM.render(
        <UploadFile />, document.querySelector("#uploadArea")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        csrfToken = result.csrfToken;
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});