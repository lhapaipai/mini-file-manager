import { createStore } from "vuex";

import { downloadFromBlob } from "pentatrion-lib/downloadHelper";
import { toIsoString } from "pentatrion-lib/dateHelper";
import { formFetchOrNotify, fetchOrNotify } from "pentatrion-lib/apiHelper";

import { parseOriginalSelection } from "./utils/filters";
import { checkAndFixValidation, completeUploadOptions } from "./utils/complete";
import { isValidFile, isEditableFile } from "./utils/validation";

export default function createStoreWithOptions({
  entryPoints,
  endPoint,
  fileValidation,
  originalSelection,
  fileUpload,
  multiple = false,
  theme = "mini-file-manager-theme",
  debug = false,
}) {
  originalSelection = parseOriginalSelection(originalSelection, entryPoints);
  // console.log(entryPoints);
  let debugStr = debug ? "?XDEBUG_TRIGGER" : "";
  return createStore({
    state: {
      endPoints: {
        deleteFile: `${endPoint}/delete${debugStr}`,
        downloadArchive: `${endPoint}/download-archive${debugStr}`,
        getFileContent: `${endPoint}/get-file-content`,
        editFile: `${endPoint}/edit${debugStr}`,
        getFiles: `${endPoint}/get-files${debugStr}`,
        uploadFile: `${endPoint}/upload${debugStr}`,
        chunkFile: `${endPoint}/chunk${debugStr}`,
        addDirectory: `${endPoint}/add-directory${debugStr}`,
        cropFile: `${endPoint}/crop${debugStr}`,
      },
      entryPoints,
      fileValidation: checkAndFixValidation(fileValidation),
      fileUpload: completeUploadOptions(fileUpload),
      // entryPoints :[
      //   {
      //       label: 'Conversation',
      //       directory: 'projet/puplinge-classique/todo',
      //       origin: 'private',
      //       readOnly: false,
      //       icon: 'fa-lock'
      //   },
      // ]

      currentEntryPoint: null,
      secondaryDirectories: [],
      multiple,
      theme,
      directory: null,
      files: [],
      selectedFiles: [],
      // when editing filename
      editing: false,
      editContent: null,
      sortBy: "filename",
    },
    getters: {
      sortedFiles(state) {
        return state.files.sort((a, b) => {
          if (a.isDir === b.isDir) {
            return a[state.sortBy] > b[state.sortBy];
          } else {
            return a.isDir ? false : true;
          }
        });
      },
      completeDirectory(state) {
        let suffixe = "",
          prefix = "";
        if (!state.currentEntryPoint) {
          return null;
        }
        if (state.secondaryDirectories.length > 0) {
          suffixe = state.secondaryDirectories.join("/");
        }
        if (state.currentEntryPoint.directory !== "") {
          prefix = state.currentEntryPoint.directory;
        }
        return prefix + (suffixe !== "" ? (prefix !== "" ? "/" : "") + suffixe : "");
      },
      invalidSelectedFiles(state) {
        return state.selectedFiles.filter((file) => {
          return !isValidFile(file, state.fileValidation);
        });
      },
      uneditableSelectedFiles(state) {
        return state.selectedFiles.filter((file) => {
          return !isEditableFile(file, state.fileValidation);
        });
      },
    },
    mutations: {
      setFiles(state, files) {
        state.files = files;
      },
      replaceFile(state, { file, newFile }) {
        let pos = state.files.indexOf(file);
        if (pos === -1) {
          console.log("impossible de trouver le fichier", file);
        }
        state.files.splice(pos, 1, newFile);
      },
      replaceFileById(state, { fileId, newFile }) {
        let pos = state.files.findIndex((f) => f.id === fileId);
        if (pos === -1) {
          console.log("impossible de trouver le fichier", fileId);
        }
        state.files.splice(pos, 1, newFile);
      },
      updateFileUploadProgress(state, { id, progression }) {
        let pos = state.files.findIndex((f) => f.id === id);
        if (pos === -1) {
          console.log(
            "impossible de trouver le fichier",
            state.files.map((f) => f.id).join(","),
            id,
            progression,
          );
          return;
        }
        if (!state.files[pos].uploadInfos) {
          console.log("le fichier n'a pas d'options d'upload", state.files[pos]);
          return;
        }
        state.files[pos].uploadInfos.progression = progression;
      },
      removeFile(state, file) {
        let pos = state.files.indexOf(file);
        if (pos === -1) {
          console.log("impossible de trouver le fichier", file);
        }
        state.files.splice(pos, 1);
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
      selectFileById(state, id) {
        let file = state.files.find((f) => f.id === id);
        if (!file) {
          return;
        }
        state.selectedFiles = [file];
      },
      addFileByIdToSelection(state, fileId) {
        let file = state.files.find((f) => f.id === fileId);
        if (!file) {
          return;
        }
        state.selectedFiles.push(file);
      },
      addFileToSelection(state, file) {
        state.selectedFiles.push(file);
      },
      removeFileToSelection(state, file) {
        let index = state.selectedFiles.indexOf(file);
        if (index !== -1) {
          state.selectedFiles.splice(index, 1);
        }
      },
      clearSelection(state) {
        state.selectedFiles = [];
      },

      setEditing(state, focus) {
        state.editing = focus;
      },
      setEditContent(state, file = null) {
        state.editContent = file;
      },
      setCurrentEntryPoint(state, entryPoint) {
        state.currentEntryPoint = entryPoint;
      },
      setSecondaryDirectory(state, arr) {
        state.secondaryDirectories = arr;
      },
    },
    actions: {
      async addDirectory({ state, getters, commit }, newDirectoryName) {
        return formFetchOrNotify(state.endPoints.addDirectory, {
          body: {
            filename: newDirectoryName,
            directory: getters.completeDirectory,
            origin: state.currentEntryPoint.origin,
          },
        }).then(({ directory }) => {
          commit("addFile", directory);
        });
      },
      async cropFile({ commit, state }, { file, dimensions, finalWidth, finalHeight }) {
        let { uploadRelativePath, origin } = file;
        let { x, y, width, height, rotate } = dimensions;
        // console.log("before crop", file);
        return formFetchOrNotify(state.endPoints.cropFile, {
          body: {
            uploadRelativePath,
            origin,
            x,
            y,
            width,
            height,
            finalWidth,
            finalHeight,
            rotate,
          },
        }).then(({ file: newFile }) => {
          commit("removeFileToSelection", file);
          commit("replaceFile", { file, newFile });
          commit("addFileToSelection", newFile);
          commit("setEditContent", newFile);
          // console.log("file cropped", file);
          return newFile;
        });
      },
      async updateFile({ commit, state }, { oldId, newFile }) {
        let isSelected = state.selectedFiles.some((f) => f.id === oldId);

        if (isSelected) {
          commit("clearSelection");
        }

        commit("replaceFileById", { fileId: oldId, newFile });
        if (isSelected) {
          commit("selectFileById", newFile.id);
        }
      },
      async updateFilename({ commit, state }, { file, newFilename }) {
        // console.log("before", file);
        let { origin, uploadRelativePath, directory, filename } = file;
        return formFetchOrNotify(state.endPoints.editFile, {
          body: {
            origin,
            uploadRelativePath,
            directory,
            filename,
            readOnly: state.currentEntryPoint.readOnly,
            newFilename,
          },
        }).then(({ file: newFile }) => {
          commit("clearSelection");
          commit("replaceFile", { file, newFile });
          commit("selectFileById", newFile.id);
        });
      },
      async download({ state }, { files = [] }) {
        if (files.length === 1 && !files[0].isDir) {
          let file = files[0];
          fetchOrNotify(
            `${state.endPoints.getFileContent}/download/${file.origin}/${file.uploadRelativePath}`,
          )
            .then((t) => t.blob())
            .then((b) => downloadFromBlob(b, file.filename));
          return;
        }

        let archiveName =
          state.directory.filename + "-" + toIsoString(new Date()) + ".zip";

        return formFetchOrNotify(state.endPoints.downloadArchive, {
          body: {
            files: files.map((f) => f.id),
          },
        })
          .then((t) => t.blob())
          .then((b) => {
            downloadFromBlob(b, archiveName);
          });
      },
      async deleteSelectedFiles({ commit, dispatch, state, getters }) {
        formFetchOrNotify(state.endPoints.deleteFile, {
          body: {
            files: state.selectedFiles.map((f) => f.id),
          },
        }).catch(() => {
          dispatch("getFiles");
        });

        let selection = state.selectedFiles;

        let nextId;

        commit("clearSelection");
        for (let file of selection) {
          let filePos = getters.sortedFiles.findIndex((f) => f.id === file.id);
          /* prettier-ignore */
          nextId = getters.sortedFiles[filePos + 1]
            ? getters.sortedFiles[filePos + 1].id
            : getters.sortedFiles[filePos - 1]
              ? getters.sortedFiles[filePos - 1].id
              : null;
          commit("removeFile", file);
        }

        if (nextId) {
          commit("addFileByIdToSelection", nextId);
        }
      },
      async getFiles({ dispatch, state, getters, commit }) {
        return formFetchOrNotify(state.endPoints.getFiles, {
          body: {
            directory: getters.completeDirectory,
            origin: state.currentEntryPoint.origin,
          },
        }).then(({ files, directory }) => {
          dispatch("setFiles", files);
          commit("setDirectory", directory);

          if (originalSelection) {
            for (let fileSelected of originalSelection) {
              let file = files.find((f) => f.id === fileSelected[3]);
              if (file) {
                commit("addFileToSelection", file);
              }
            }
            originalSelection = null;
          }
        });
      },
      async setFiles({ commit }, files) {
        commit("clearSelection");
        commit("setFiles", files);
      },
      async setCurrentEntryPoint({ commit, dispatch }, entryPoint) {
        commit("setCurrentEntryPoint", entryPoint);
        let directory = entryPoint.directory;
        if (originalSelection) {
          directory = originalSelection[0][1];
        }
        dispatch("setSecondaryDirectoryFromFullDirectory", directory);
      },
      async setSecondaryDirectoryFromFullDirectory({ state, commit, dispatch }, path) {
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
          // si prefix est vide il n'y a pas de slash initial sinon il y en a un.
          suffix = suffix.replace(/^\//, "");
          secondaryDirectories = suffix.split("/");
        }
        commit("setSecondaryDirectory", secondaryDirectories);
        dispatch("getFiles");
        // console.log(prefix, suffix);
      },
      async init({ dispatch, state }) {
        let entryPoint;

        if (originalSelection) {
          entryPoint = state.entryPoints.find(
            (e) => e.origin === originalSelection[0][0],
          );
        }
        if (entryPoint) {
          dispatch("setCurrentEntryPoint", entryPoint);
        } else {
          dispatch("setCurrentEntryPoint", state.entryPoints[0]);
        }
      },
    },
  });
}
