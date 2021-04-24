import { createStore } from "vuex";

import { apiHelper, downloadHelper, dateHelper } from "pentatrion-lib";
const { jsonFetchOrNotify } = apiHelper;

export default function createStoreWithOptions(fileManagerOptions) {
  return createStore({
    state: {
      ...fileManagerOptions,
      /* from fileManagerOptions
      endPoints: {
        deleteFile   :"/media-manager/delete"
        downloadArchive :"/media-manager/download-archive"
        showFile     :"/media-manager/get/{mode}/{origin}/{uploadRelativePath}"
        editFile     :"/media-manager/edit"
        getFiles     :"/media-manager/get-files"
        uploadFile   :"/media-manager/upload"
        addDirectory :"/media-manager/add-directory"
      },
      isAdmin:
      entryPoints :[
        {
            label: 'Conversation',
            directory: 'projet/puplinge-classique/todo',
            origin: 'private',
            readOnly: false,
            icon: 'fa-lock'
        },
      ]
      */

      currentEntryPoint: null,
      secondaryDirectories: [],
      multiple: false,
      directory: null,
      files: [],
      selectedFiles: [],
      editing: false
    },
    getters: {
      completeDirectory(state) {
        let suffixe = "";
        if (!state.currentEntryPoint) {
          return;
        }
        if (state.secondaryDirectories.length > 0) {
          suffixe = "/" + state.secondaryDirectories.join("/");
        }
        return state.currentEntryPoint.directory + suffixe;
      }
    },
    mutations: {
      setFiles(state, files) {
        state.files = files;
      },
      setDirectory(state, directory) {
        state.directory = directory;
      },
      setEntryPoints(state, entryPoints) {
        state.entryPoints = entryPoints;
      },
      addFile(state, file) {
        state.files.splice(0, 0, file);
      },
      addFileByIdToSelection(state, fileId) {
        let file = state.files.find(f => f.id === fileId);
        if (!file) {
          return;
        }
        if (state.multiple) {
          state.selectedFiles.push(file);
        } else {
          state.selectedFiles = [file];
        }
      },
      addFileToSelection(state, file) {
        if (state.multiple) {
          state.selectedFiles.push(file);
        } else {
          state.selectedFiles = [file];
        }
      },
      removeFileToSelection(state, file) {
        let index = state.selectedFiles.indexOf(file);
        state.selectedFiles.splice(index, 1);
      },
      selectFileByInode(state, inode) {
        let file = state.files.find(f => f.inode === inode);
        if (!file) {
          return;
        }
        state.selectedFiles = [file];
      },
      unselectFiles(state) {
        state.selectedFiles = [];
      },
      // le problème c'est que le fichier mis à jour ne se trouve pas nécessairement au même emplacement.
      // updateFilename(state, file) {
      //   let filePos = state.files.findIndex(f => f.id === file.id);
      //   state.files.splice(filePos, 1, file);
      //   state.selectedFiles = [file];
      // },
      setEditing(state, focus) {
        state.editing = focus;
      },
      deleteSelectedFiles(state) {
        for (let file of state.selectedFiles) {
          let index = state.files.indexOf(file);
          if (index !== -1) {
            state.files.splice(index, 1);
          }
        }
        state.selectedFiles = [];
      },
      setCurrentEntryPoint(state, entryPoint) {
        state.currentEntryPoint = entryPoint;
      },
      setSecondaryDirectory(state, arr) {
        state.secondaryDirectories = arr;
      }
    },
    actions: {
      async addDirectory(
        { state, getters, dispatch, commit },
        newDirectoryName
      ) {
        jsonFetchOrNotify(state.endPoints.addDirectory, {
          method: "POST",
          body: {
            filename: newDirectoryName,
            directory: getters.completeDirectory,
            origin: state.currentEntryPoint.origin
          }
        }).then(async ({ files, directory }) => {
          await dispatch("setFiles", files);
          commit("selectFileByInode", directory.inode);
        });
      },
      async updateFilename({ commit, state, dispatch }, { file, filename }) {
        // console.log(file.id);
        jsonFetchOrNotify(state.endPoints.editFile, {
          method: "POST",
          body: {
            file,
            newFilename: filename
          }
        }).then(async ({ files }) => {
          // console.log(files);

          await dispatch("setFiles", files);
          commit("selectFileByInode", file.inode);
        });
      },
      async download({ state, getters }, { files = [] }) {
        if (files.length === 1 && !files[0].isDir) {
          let file = files[0];
          jsonFetchOrNotify(
            `${state.endPoints.showFile}/download/${file.origin}/${file.uploadRelativePath}`,
            {},
            false
          )
            .then(t => t.blob())
            .then(b => downloadHelper.downloadFromBlob(b, file.filename));
          return;
        }

        let archiveName =
          state.directory.filename +
          "-" +
          dateHelper.toIsoString(new Date()) +
          ".zip";

        jsonFetchOrNotify(
          state.endPoints.downloadArchive,
          {
            method: "POST",
            body: { files }
          },
          false
        )
          .then(t => t.blob())
          .then(b => {
            downloadHelper.downloadFromBlob(b, archiveName);
          });
      },
      async deleteSelectedFiles({ commit, dispatch, state }) {
        jsonFetchOrNotify(state.endPoints.deleteFile, {
          method: "POST",
          body: state.selectedFiles
        }).catch(() => {
          dispatch("getFiles");
        });
        commit("deleteSelectedFiles");
      },
      async getFiles({ dispatch, state, getters, commit }) {
        jsonFetchOrNotify(state.endPoints.getFiles, {
          method: "POST",
          body: {
            directory: getters.completeDirectory,
            origin: state.currentEntryPoint.origin
          }
        }).then(({ files, directory }) => {
          dispatch("setFiles", files);
          if (directory) {
            commit("setDirectory", directory);
          }
        });
      },
      async setFiles({ commit }, files) {
        commit("unselectFiles");
        commit("setFiles", files);
      },
      async setCurrentEntryPoint({ commit, dispatch }, entryPoint) {
        commit("setCurrentEntryPoint", entryPoint);
        dispatch(
          "setSecondaryDirectoryFromFullDirectory",
          entryPoint.directory
        );
      },
      async setSecondaryDirectoryFromFullDirectory(
        { state, commit, dispatch },
        path
      ) {
        let prefix = state.currentEntryPoint.directory;
        if (path.indexOf(prefix) !== 0) {
          console.error("répertoire inconnu");
          return;
        }
        // prefix                    path                                suffix
        // "projet/alterosac/public" projet/alterosac/public/artistes/fx artistes/fx
        // "projet/alterosac/todo"   projet/alterosac/todo/artistes/fx   artistes/fx

        let suffix = path.substring(prefix.length);
        let secondaryDirectories = [];
        if (suffix !== "") {
          // s'il n'est pas vide il commence par un slash initial
          // que l'on souhaite retirer
          secondaryDirectories = suffix.substring(1).split("/");
        }
        commit("setSecondaryDirectory", secondaryDirectories);
        dispatch("getFiles");
        // console.log(prefix, suffix);
      },
      async init({ dispatch, state }) {
        dispatch("setCurrentEntryPoint", state.entryPoints[0]);
      }
    }
  });
}
