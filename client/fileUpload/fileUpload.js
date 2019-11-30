let csrfToken = null;

// File Upload Test
const fileUpload = (e) => {
    e.preventDefault();
    //https://stackoverflow.com/questions/5587973/javascript-upload-file
    let formData = new FormData();
    let picture = document.querySelector('#fileData').files[0];

    formData.append("sampleFile", picture);
    formData.append('_csrf', csrfToken);
    fetch(`/upload`, {method: "POST", body: formData})
    .then(
        function(response){
            if(response.status === 200){
                response.json().then(function(data){
                    window.location = data.redirect;
                });
            }
        }
    );
    return false;
};

const UploadFile = (props) => {
    return (
        <form id='uploadForm' 
            name="uploadForm"
            //action="/upload" // ?_csrf={csrfToken}
            onSubmit={fileUpload}
            method='POST' 
            encType="multipart/form-data"
            className="mainForm"
            >
            <input type="hidden" name="_csrf" value={csrfToken}/>
            <input type="file" name="sampleFile" id="fileData" />
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