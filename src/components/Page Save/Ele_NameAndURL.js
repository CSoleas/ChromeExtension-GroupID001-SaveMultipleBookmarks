import React, { useEffect } from "react";

const Ele_NameAndURL = ({ i, bookmarkToSave }) => {
    let saveButton = document.getElementById("Button2");
    let unwantedCharacters = /[`@#%^&*\[\]{};:\\|<>\/?~]/;

    useEffect(() => {
        document.getElementById("title").select();
    }, [bookmarkToSave]);

    const acceptableSaveState = (event) => {
        let urlInputElement = event.target;
        let url = urlInputElement.value;
        let urlFirstChar = url.slice(0, 1);

        if (unwantedCharacters.test(urlFirstChar) || url.length === 0 || url === "http://" || url === "https://") {
            urlInputElement.className = "InputURL-error";
            saveButton.disabled = true;
        } else {
            urlInputElement.className = "InputURL";
            saveButton.disabled = false;
        }
    };

    return (
        <div className="Ele_NameAndURL" key={i}>
            <div>
                <label for="title">Name</label>
                <input
                    className="InputName"
                    type="text"
                    defaultValue={bookmarkToSave.length > 0 ? bookmarkToSave[i].title : ""}
                    id="title"
                    name="title"
                    autocomplete="off"
                    onFocus={(e) => e.target.select()}
                    spellcheck="false"
                    autoFocus
                />
            </div>

            <div>
                <label for="url">URL</label>
                <input
                    className="InputURL"
                    type="url"
                    defaultValue={bookmarkToSave.length > 0 ? bookmarkToSave[i].url : ""}
                    id="url"
                    name="url"
                    autocomplete="off"
                    onFocus={(e) => e.target.select()}
                    spellcheck="false"
                    onChange={(e) => acceptableSaveState(e)}
                />
            </div>
        </div>
    );
};

export default Ele_NameAndURL;
