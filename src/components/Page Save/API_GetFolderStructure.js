/*global chrome*/

// Complexity
// ----------
// F = number of Folders
// B = number of Bookmarks
// N = F + B
// Time complexity: O(N)
// Memory complexity: O(N)
// Rendering Time complexity: O(F)

// Reason
// ------
// Recreate the TreeView structure using recursion in the original order with only folders included in the new structure.
// Now we can render each folder without the need to check if it contains other folders inside.

const API_GetFolderStructure = async () => {
    const logTree = (tree) => {
        const currentTreeStructure = tree[0].children;
        const folderStructure = [];

        const createFolderStructure = (data, folderStructure) => {
            let i = 0;
            return data.forEach((item) => {
                if (item.children) {
                    folderStructure.push({
                        children: [],
                        id: item.id,
                        index: item.index,
                        parentId: item.parentId,
                        title: item.title,
                    });
                    createFolderStructure(item.children, folderStructure[i].children);
                    i++;
                }
            });
        };

        createFolderStructure(currentTreeStructure, folderStructure);
        return folderStructure;
    };

    const onError = (error) => {
        console.log(`An error: ${error}`);
    };

    const gettingTree = chrome.bookmarks.getTree();
    return gettingTree.then(logTree, onError);
};

export default API_GetFolderStructure;
