let csrfToken = null;

// File Upload Test
const fileUpload = (e) => {
    e.preventDefault();
    //https://stackoverflow.com/questions/5587973/javascript-upload-file
    let formData = new FormData();
    let picture = document.querySelector('#fileData').files[0];

    formData.append("sampleFile", picture);
    formData.append('_csrf', csrfToken);
    console.log(formData.getAll("sampleFile"));
    fetch(`/upload?_csrf=${csrfToken}`,
    {
        method: "POST",
        body: formData,
    })
    .then(
        function(response){
            if(response.status === 200){
                response.json().then(function(data){
                    fetch(`/retrieve?name=${data.imageName}`, { 
                        method: "GET",
                        query: {name: data.imageName},
                    })
                    .then(function(newData){
                        ReactDOM.render(
                            <ImageDisplay imageName={`${data.imageName}`}/>, document.querySelector("#imageArea")
                        );
                    }
                    )
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
const ImageDisplay = (props) => {
    return (
        <img src={`/retrieve?name=${props.imageName}`} />
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