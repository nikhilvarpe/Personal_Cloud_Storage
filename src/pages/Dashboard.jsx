import NavBar from "../components/NavBar";
import FolderBreadcrumbs from "../components/FolderBreadcrumbs";
import FolderItem from "../components/FolderItem";
import CreateFolderButton from "../components/CreateFolderButton";
import { useFolder } from "../hooks/useFolder";
import { useParams, useLocation } from "react-router-dom";
import AddFileButton from "../components/AddFileButton";
import FileItem from "../components/FileItem";
import LoadingRing from "../components/LoadingRing";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { useState } from "react";
import { useAlert } from "../contexts/AlertContext";
import { db, storage } from "../firebase";
import { ALERT_CLASSES } from "../constants";
import { useGlobalFiles } from "../hooks/useGlobalFiles";

export default function Dashboard() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles, loadingState } = useFolder(
    folderId,
    state.folder
  );
  const { allFiles, loading: globalLoading } = useGlobalFiles();

  const { showAlert } = useAlert();
  const [showConformationModal, setShowConformationModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openConformationModal = (file) => {
    setSelectedFile(file);
    setSelectedFolder(null);
    setShowConformationModal(true);
  };

  const openFolderDeleteModal = (folder) => {
    setSelectedFolder(folder);
    setSelectedFile(null);
    setShowConformationModal(true);
  };

  const handleDeleteFile = async () => {
    const fileRef = storage.refFromURL(selectedFile.url);

    await fileRef.delete().finally(async () => {
      await db.files
        .doc(selectedFile.id)
        .delete()
        .then(() => {
          setShowConformationModal(false);
          showAlert(ALERT_CLASSES.SUCCESS, "File deleted successfully");
        })
        .catch((err) => {
          setShowConformationModal(false);
          showAlert(ALERT_CLASSES.ERROR, err.message);
        });
    });
  };

  const handleDeleteFolder = async () => {
    await db.folders
      .doc(selectedFolder.id)
      .delete()
      .then(() => {
        setShowConformationModal(false);
        showAlert(ALERT_CLASSES.SUCCESS, "Folder deleted successfully");
      })
      .catch((err) => {
        setShowConformationModal(false);
        showAlert(ALERT_CLASSES.ERROR, err.message);
      });
  };

  const isSearching = searchQuery.trim().length > 0;
  const filteredFiles = isSearching
    ? allFiles.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : [];

  const isDataReady =
    loadingState.childFolders && loadingState.childFiles && !globalLoading;

  return (
    <div className="min-h-full bg-white">
      <NavBar setSearchQuery={setSearchQuery} />

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
          <CreateFolderButton currentFolder={folder} />
          <AddFileButton currentFolder={folder} />
        </div>

        <div className="my-4">
          <FolderBreadcrumbs currentFolder={folder} />
        </div>

        {!isDataReady ? (
          <div className="flex h-full w-full justify-center">
            <LoadingRing />
          </div>
        ) : (
          <>
            {childFolders?.length > 0 && <h5 className="mb-4">Folders:</h5>}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {childFolders.map((childFolder) => (
                <FolderItem
                  key={childFolder.id}
                  folder={childFolder}
                  onDelete={() => openFolderDeleteModal(childFolder)}
                />
              ))}
            </div>

            {(childFolders.length > 0 ||
              (!isSearching && childFiles.length > 0) ||
              (isSearching && filteredFiles.length > 0)) && (
              <div className="divider"></div>
            )}

            <h5 className="mb-4">Files:</h5>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {(isSearching ? filteredFiles : childFiles).map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  openConformationModal={openConformationModal}
                />
              ))}
            </div>

            {!isSearching &&
              childFolders.length === 0 &&
              childFiles.length === 0 && (
                <div className="divider">Create a folder or upload a file</div>
              )}

            {isSearching && filteredFiles.length === 0 && (
              <div className="text-gray-500">No matching files found.</div>
            )}
          </>
        )}
      </div>

      <ConfirmationModal
        showModal={showConformationModal}
        setShowModal={setShowConformationModal}
        title={selectedFile ? "Delete File" : "Delete Folder"}
        text={
          selectedFile
            ? `Are you sure you want to delete file: ${selectedFile.name}?`
            : `Are you sure you want to delete folder: ${selectedFolder?.name}?`
        }
        onConfirmation={selectedFile ? handleDeleteFile : handleDeleteFolder}
      />
    </div>
  );
}