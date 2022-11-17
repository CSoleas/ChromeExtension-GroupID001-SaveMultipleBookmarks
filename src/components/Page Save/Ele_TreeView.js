import React, { useState, memo, useEffect, useRef } from "react";
import expandedFolders from "./var_ExpandedFolders";
import newFolderCreatedId from "./var_NewFolderCreatedId";

const Ele_TreeView = ({ data }) => {
    const dblClickTimeSpan = 300;
    const selectedFolder = useRef();

    useEffect(() => {
        let selectedFolderID = newFolderCreatedId === "" ? data[0].id : newFolderCreatedId;
        document.getElementById(selectedFolderID).className = "bulletpoint-name-focus";
        selectedFolder.current = [selectedFolderID, []];
        if (newFolderCreatedId !== "") {
            document.getElementById(newFolderCreatedId).focus({ preventScroll: true });
            document.getElementById(newFolderCreatedId).scrollIntoView({ block: "nearest" });
        }
        newFolderCreatedId = "";
    }, [data]);

    const addOrRemoveFromExpandedFolders = (id) => {
        if (expandedFolders.has(id)) {
            expandedFolders.delete(id);
        } else {
            expandedFolders.add(id);
        }
    };

    const TreeViewBuild = ({ data }) => {
        const TreeNodeBuild = ({ folderNode }) => {
            const hasChild = folderNode.children.length ? true : false;
            const folderNodeID = folderNode.id;
            const [childVisible, setChildVisible] = useState(expandedFolders.has(folderNodeID) ? true : false);

            let clicks = 0;
            let clickTimer = 0;

            // KEYBOARD
            const keyHandler = (event) => {
                let keyPressed = event.key;
                let currentELe = event.target.parentElement.parentElement;

                const focusFolderFromKeyb = (ele, event) => {
                    event.target.className = "bulletpoint-name";
                    ele.className = "bulletpoint-name-focus";
                    ele.focus({ preventScroll: true });
                    ele.scrollIntoView({ block: "nearest" });
                    selectedFolder.current = [ele.id, event.nativeEvent.composedPath()];
                };

                if (keyPressed === "Enter") {
                }

                // TAB
                if (keyPressed === "Tab" && event.shiftKey === false) {
                    document.getElementById("Button1").focus();
                    return;
                }
                // TAB + Shift
                if (keyPressed === "Tab" && event.shiftKey === true) {
                    event.preventDefault();
                    document.getElementById("url").focus();
                }

                // ARROW RIGHT
                if (keyPressed === "ArrowRight" && hasChild) {
                    setChildVisible(true);
                    addOrRemoveFromExpandedFolders(event.target.id);
                }

                // ARROW LEFT
                if (keyPressed === "ArrowLeft") {
                    // Treeview Open
                    if (childVisible) {
                        setChildVisible(false);
                        addOrRemoveFromExpandedFolders(event.target.id);
                        return;

                        // Treeview Closed
                    } else if (event.nativeEvent.composedPath()[4].tagName === "LI") {
                        currentELe = currentELe.parentElement.parentElement.firstElementChild.lastElementChild;
                        focusFolderFromKeyb(currentELe, event);
                    }
                }

                // ARROW UP
                if (keyPressed === "ArrowUp") {
                    // No Previous Sibling
                    if (currentELe.previousElementSibling === null) {
                        if (event.nativeEvent.composedPath()[4].tagName === "LI") {
                            currentELe = event.nativeEvent.composedPath()[4].firstElementChild.lastElementChild;
                            focusFolderFromKeyb(currentELe, event);
                        }

                        // Previous Sibling
                    } else {
                        currentELe = currentELe.previousElementSibling;
                        while (currentELe.children.length > 1) {
                            currentELe = currentELe.lastElementChild.lastElementChild;
                        }
                        currentELe = currentELe.lastElementChild.lastElementChild;
                        focusFolderFromKeyb(currentELe, event);
                    }
                }

                // ARROW DOWN
                if (keyPressed === "ArrowDown") {
                    // Folder is expanded
                    if (childVisible) {
                        currentELe =
                            event.target.parentElement.nextElementSibling.firstElementChild.firstElementChild
                                .lastElementChild;
                        focusFolderFromKeyb(currentELe, event);
                        return;
                    }

                    // Next Sibling
                    if (currentELe.nextElementSibling === null) {
                        let newlist = event.nativeEvent.composedPath();
                        for (let i = 4; i < newlist.length; i += 2) {
                            if (newlist[i].tagName === "LI" && newlist[i].nextElementSibling !== null) {
                                currentELe = newlist[i].nextElementSibling.firstElementChild.lastElementChild;
                                focusFolderFromKeyb(currentELe, event);
                                return;
                            }
                        }

                        // No sibling
                    } else {
                        currentELe = currentELe.nextElementSibling.firstElementChild.lastElementChild;
                        focusFolderFromKeyb(currentELe, event);
                    }
                }
            };

            const changeFocus = (ele, event) => {
                document.getElementById(selectedFolder.current[0]).className = "bulletpoint-name";
                selectedFolder.current = [ele.id, event.nativeEvent.composedPath()];
                ele.className = "bulletpoint-name-focus";
                ele.focus({ preventScroll: true });
                ele.scrollIntoView({ block: "nearest" });
            };

            // MOUSE
            const mouseClickHandler = (ele, event) => {
                clicks++;

                // focus new element
                changeFocus(ele, event);

                // single click
                if (clicks === 1) {
                    clickTimer = setTimeout(() => {
                        clicks = 0;
                    }, dblClickTimeSpan);
                }

                // double-click event
                if (clicks >= 2) {
                    setChildVisible((v) => !v);
                    addOrRemoveFromExpandedFolders(event.target.id);

                    clearTimeout(clickTimer);
                    clicks = 0;
                }
            };

            const arrowIconMousemouseClickHandler = (event) => {
                setChildVisible((v) => !v);

                let newlist = selectedFolder.current[1];
                let ele = event.target.nextElementSibling.nextElementSibling;
                let eleID = "n" + ele.id.toString();
                addOrRemoveFromExpandedFolders(ele.id);

                for (let i = 4; i < newlist.length; i += 2) {
                    if (newlist[i].tagName === "LI" && newlist[i].id === eleID) {
                        changeFocus(ele, event);
                        return;
                    }
                }
            };

            return (
                <li className="bulletpoint" id={"n" + folderNodeID.toString()}>
                    <div className="wrapper">
                        {hasChild ? (
                            <div
                                className="img1"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    arrowIconMousemouseClickHandler(e);
                                }}
                            ></div>
                        ) : (
                            <div className="img3"></div>
                        )}

                        <div
                            className="img2"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                mouseClickHandler(e.target.nextElementSibling, e);
                            }}
                        ></div>

                        <div
                            id={folderNodeID}
                            className={"bulletpoint-name"}
                            onMouseDown={(e) => {
                                mouseClickHandler(e.target, e);
                            }}
                            onKeyDown={(e) => {
                                e.preventDefault();
                                keyHandler(e);
                            }}
                            tabindex="-1"
                        >
                            {folderNode.title}
                        </div>
                    </div>
                    {childVisible && <TreeViewBuild data={folderNode.children} />}
                </li>
            );
        };

        return (
            <ul className="bulletpoint-container">
                {data.map((tree) => (tree.url ? <></> : <TreeNodeBuild folderNode={tree} />))}
            </ul>
        );
    };

    return <TreeViewBuild data={data} />;
};

export default memo(Ele_TreeView);
