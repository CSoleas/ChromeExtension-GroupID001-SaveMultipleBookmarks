/* global chrome */
import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import Ele_NameAndURL from "./Ele_NameAndURL.js";
import API_GetFolderStructure from "./API_GetFolderStructure.js";
import Ele_TreeView from "./Ele_TreeView.js";
import expandedFolders from "./var_ExpandedFolders";
import newFolderCreatedId from "./var_NewFolderCreatedId";

const App_SaveMultipleBookmarks = () => {
    const [count, setCount] = useState(0);
    const [folderStructure, setFolderStructure] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const highlightedTabs = useRef([]);

    useEffect(async () => {
        highlightedTabs.current = await chrome.tabs.query({ highlighted: true, currentWindow: true });
        const folderStructure = await API_GetFolderStructure();
        setFolderStructure(folderStructure);
    }, []);

    // Save selected bookmark
    const saveBookmark = () => {
        chrome.bookmarks.create({
            parentId: document.getElementsByClassName("bulletpoint-name-focus")[0].id,
            title: document.getElementById("title").value,
            url: document.getElementById("url").value,
        });
        if (count < highlightedTabs.current.length - 1) {
            setCount(count + 1);
        } else {
            closingScreen();
        }
    };

    // Save new folder
    const newFolderfunct = async () => {
        let parentid = document.getElementsByClassName("bulletpoint-name-focus")[0].id;
        try {
            await chrome.bookmarks.create(
                {
                    parentId: parentid,
                    title: document.getElementById("Modal2Input").value,
                },
                function (newFolder) {
                    newFolderCreatedId = newFolder.id;
                    expandedFolders.add(parentid);
                },
            );
        } catch (error) {
            console.log("folder creation issue");
        }
        const folderStructure = await API_GetFolderStructure();
        setFolderStructure(folderStructure);
    };

    const modalOpenKeyFunct = (event) => {
        let ele = document.activeElement.id;
        let keyPressed = event.key;

        if (keyPressed === "Esc" || keyPressed === "Escape") {
            event.preventDefault();
            setModalOpen(false);
            return;
        }

        if (keyPressed === "Enter" && (ele === "Modal2Input" || ele === "Modal2button1")) {
            event.preventDefault();
            newFolderfunct();
            setModalOpen(false);
            return;
        }

        if (keyPressed === "Enter" && ele === "Modal2button2") {
            event.preventDefault();
            setModalOpen(false);
            return;
        }

        if (keyPressed === "Tab" && event.shiftKey === false) {
            event.preventDefault();
            if (ele === "Modal2Input") {
                document.getElementById("Modal2button1").focus();
            } else if (ele === "Modal2button1") {
                document.getElementById("Modal2button2").focus();
            } else if (ele === "Modal2button2") {
                document.getElementById("Modal2Input").focus();
            }
            return;
        }

        if (keyPressed === "Tab" && event.shiftKey === true) {
            event.preventDefault();
            if (ele === "Modal2Input") {
                document.getElementById("Modal2button2").focus();
            } else if (ele === "Modal2button1") {
                document.getElementById("Modal2Input").focus();
            } else if (ele === "Modal2button2") {
                document.getElementById("Modal2button1").focus();
            }
            return;
        }
    };

    const Ele_NewFolderModal = () => {
        return (
            <>
                <div
                    className="Modal2Container"
                    id="Modal2Container"
                    onKeyDown={(e) => modalOpenKeyFunct(e)}
                    style={modalOpen ? { display: "block" } : { display: "none" }}
                >
                    <p className="Modal2Header"> New folder </p>

                    <label className="Modal2label" for="Modal2Input">
                        Name
                    </label>
                    <input
                        className="Modal2Input"
                        type="text"
                        defaultValue={"New folder"}
                        id="Modal2Input"
                        name="Modal2Input"
                        autocomplete="off"
                        onFocus={(e) => e.target.select()}
                        spellcheck="false"
                        autoFocus
                    />

                    <button
                        className="Modal2button1"
                        id="Modal2button1"
                        onMouseDown={() => {
                            newFolderfunct();
                            setModalOpen(false);
                        }}
                    >
                        Save
                    </button>
                    <button
                        className="Modal2button2"
                        id="Modal2button2"
                        onMouseDown={() => {
                            setModalOpen(false);
                        }}
                    >
                        Cancel
                    </button>
                </div>
                <a class="backdrop" onMouseDown={(e) => e.preventDefault()}></a>
            </>
        );
    };

    // KEYBOARD MOVEMENT
    const keyHandler = (event) => {
        let keyPressed = event.key;
        let ele = document.activeElement.id;

        if (keyPressed === "Tab" && event.shiftKey === false && ele === "url") {
            event.preventDefault();
            document.getElementsByClassName("bulletpoint-name-focus")[0].focus();
            return;
        }

        if (keyPressed === "Tab" && event.shiftKey === true && ele === "Button1") {
            event.preventDefault();
            document.getElementsByClassName("bulletpoint-name-focus")[0].focus();
            return;
        }

        if (keyPressed === "Enter" && ele === "Button1") {
            event.preventDefault();
            setModalOpen(true);
            return;
        }

        if (keyPressed === "Enter" && ele === "Button2") {
            event.preventDefault();
            saveBookmark();
            return;
        }

        if (keyPressed === "Enter" && ele !== "Button3") {
            event.preventDefault();
            saveBookmark();
        }
    };

    const closingScreen = () => {
        let squares = document.querySelectorAll(".hiddentile");
        squares.forEach((square) => (square.className = "hiddentile active"));
        setTimeout(() => {
            window.close();
        }, 1400);
    };

    return (
        <>
            {modalOpen ? <Ele_NewFolderModal /> : <></>}
            {[...Array(5)].map(() => (
                <div className="hiddentile"></div>
            ))}
            <div className="modalwindowOpen">
                <div className="Background" onKeyDown={(e) => keyHandler(e)}>
                    <div className="Container">
                        <p className="Header"> Save bookmark </p>
                        <p className="CounterBox">
                            {count + 1}/{highlightedTabs.current.length}
                        </p>

                        <Ele_NameAndURL i={count} bookmarkToSave={highlightedTabs.current} />

                        <div
                            className="treebox"
                            id="treebox"
                            tabindex="0"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                document.getElementsByClassName("bulletpoint-name-focus")[0].focus();
                            }}
                        >
                            {folderStructure.length === 0 ? (
                                <div>
                                    <p>loading..</p>
                                </div>
                            ) : (
                                <Ele_TreeView data={folderStructure} />
                            )}
                        </div>

                        <div className="buttonArea">
                            <button
                                className="Button1"
                                id="Button1"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setModalOpen(true);
                                }}
                            >
                                New folder
                            </button>
                            <button
                                className="Button2"
                                id="Button2"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    saveBookmark();
                                }}
                            >
                                Save
                            </button>
                            <button
                                className="Button3"
                                id="Button3"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.close();
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App_SaveMultipleBookmarks;
